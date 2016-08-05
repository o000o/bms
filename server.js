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
// const keepAlive = require('./routes/keepAlive')
// const mlogger = require('morgan')
// const https = require('https')
const moment = require('moment-timezone')
const app = express()

// app.use(mlogger('dev'))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({ limit: '50mb'}))

const corsPolicy = {
  origin: cfg.origin,
  methods: cfg.methods,
  allowedHeaders: cfg.allowedHeaders
};
app.use(cors(corsPolicy))

// app.all([require('./utils/logUtils')],incoming()); //Not Work

app.use((req, res, next) => { //Incoming
  // let transaction = moment(new Date()).tz('Asia/Bangkok').format('YYYYMMDDHHmmss')
  // let ooo = JSON.parse(JSON.stringify(req))
  // ooo.sysTransaction = transaction
  // req = ooo
  logger.incoming(req)
  next()
})

app.use((err, req, res, next) =>{
  logger.incoming(req,err);
  if (err instanceof SyntaxError) {
    // res.status(err.status || 400);
    // logger.summary(req,'SyntaxError|Incomplete Parameter');
    // return res.json(resp.getJsonError(error.code_00005, error.desc_00005, err.message));
    return resp.getIncompleteParameter(req,res,'SyntaxError',err)
  } else next()
})

app.get('/bms/logout/user', auth.logout)
app.post('/bms/login/user', auth.login)

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
// app.all('/bms/*', [require('./middlewares/validateRequest')]);
// Add the interceptor middleware for renew token
app.use('/bms/*', [require('./middlewares/interceptResponse')])
app.use('/bms/', require('./routes'))

// If no route is matched by now, it must be a 404
app.use((req, res, next) => {
  // logger.info(req,'Unknow URL')
  logger.summary(req,'Unknow URL')
  res.status(404);
  res.json(resp.getJsonError(error.code_00004, error.desc_00004))
  next()
})

// Catch 500 Error
app.use((err, req, res, next) => {
  logger.error(req,err)
  // res.status(err.status || 500)
  // logger.summary(req,'Server Catch 500 Error')
  // return res.json(resp.getJsonError(error.code_00003, error.desc_00003, err.message))
  return resp.getInternalError(req,res,'Server Catch 500',err)
  // res.json(resp.getJsonError(error.code_00003, error.desc_00003, err))
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