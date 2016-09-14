'use strict'

const express = require('express')
const cors = require('cors')
const chalk = require('chalk')
const bodyParser = require('body-parser')
const logger = require('./utils/logUtils')
const cfg = require('./config/config')
const resp = require('./utils/respUtils')
const error = require('./config/error')
const auth = require('./routes/auth.js')
const util = require('./utils/bmsUtils')
// const keepAlive = require('./routes/keepAlive')
// const mlogger = require('morgan')
// const https = require('https')
const moment = require('moment-timezone')
const document = require('./routes/document.js');
const passport = require('passport')
require('./middlewares/passport')(passport, cfg)


const app = express()

// app.use(mlogger('dev'))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}))
app.use(bodyParser.json({ limit: '50mb'}))

const corsPolicy = {
  origin: cfg.origin,
  methods: cfg.methods,
  allowedHeaders: cfg.allowedHeaders
}
app.use(cors(corsPolicy))

app.use((req, res, next) => { //Incoming
  let uName = req.header('x-userTokenId') ? ('_'+util.getUserName(req.header('x-userTokenId'))) : ''
  if((uName=='')&&(req.body)&&(req.body.requestData)&&(req.body.requestData.userName)) uName = '_'+req.body.requestData.userName
  req.ssid = moment(new Date()).tz('Asia/Bangkok').format('YYYYMMDDHHmmss') + uName
  logger.incoming(req)
  next()
})

app.use((err, req, res, next) =>{ //Incoming and then Error
  let uName = req.header('x-userTokenId') ? ('_'+util.getUserName(req.header('x-userTokenId'))) : ''
  if((uName=='')&&(req.body)&&(req.body.requestData)&&(req.body.requestData.userName)) uName = '_'+req.body.requestData.userName
  req.ssid = moment(new Date()).tz('Asia/Bangkok').format('YYYYMMDDHHmmss') + uName
  logger.incoming(req,err)
  if (err instanceof SyntaxError) {
    return resp.getIncompleteParameter(req,res,'SyntaxError',err)
  } else next()
})
app.use(passport.initialize())
app.get('/bms/logout/user', auth.logout)
app.post('/bms/login/user', auth.login)

app.get('/bms/loginSSO/user', 
  passport.authenticate(cfg.sso.passport.strategy,
      {
        successRedirect: '/',
        failureRedirect: '/login'
      }
  )
)
app.post(cfg.sso.passport.saml.path,
  passport.authenticate(cfg.sso.passport.strategy,
    {
      failureRedirect: '/',
      failureFlash: true
    }), auth.samlLogin);

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
// app.all('/bms/*', [require('./middlewares/validateRequest')])

//Bypass Intercept
app.get('/bms/document/download', document.archivDownload)

// Add the interceptor middleware for renew token
app.use('/bms/*', [require('./middlewares/interceptResponse')])
app.use('/bms/', require('./routes'))

// If no route is matched by now, it must be a 404
app.use((req, res, next) => {
  // logger.info(req,'Unknow URL')
  logger.summary(req,'Unknow URL')
  res.status(404)
  res.json(resp.getJsonError(error.code_00004, error.desc_00004))
  next()
})

// Catch 500 Error
app.use((err, req, res, next) => {
  logger.error(req,err)
  return resp.getInternalError(req,res,'Server Catch 500',err)
})

// Start the server
//=====HTTP=====
app.listen(cfg.https.port, () => {
  console.log(chalk.green("Server listen on : " + cfg.https.port))
  logger.info(null,"======>Server listen on : " + cfg.https.port)
})
//=====HTTP 2=====
// const http = require('http')
// http.createServer(app).listen(cfg.https.port)
// console.log(chalk.green("Server listen on : " + cfg.https.port))

//=====HTTPS=====
// https.createServer(cfg.https.options, app).listen(cfg.https.port)
// console.log(chalk.green("Server listen on : " + cfg.https.port))
//=====HTTPS 2=====
// var https = require('https')
// var server = https.createServer(app).listen(config.port, function() {
//     console.log('Https App started')
// })
