'use strict'

const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const logger = require('./utils/logUtils');
const cfg = require('./config/config');
const resp = require('./utils/respUtils');
const error = require('./config/error');
// const keepAlive = require('./routes/keepAlive');
const mlogger = require('morgan');
const https = require('https');
const app = express();

// try{
app.use(mlogger('dev'));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({ limit: '50mb'}));

const corsPolicy = {
  origin: cfg.origin,
  methods: cfg.methods,
  allowedHeaders: cfg.allowedHeaders
};
app.use(cors(corsPolicy));

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
// app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
// app.all('/bizlive/api/*', [require('./middlewares/validateRequest')]);
// app.all('/*', [require('./middlewares/validateRequest')]);
app.use('/bms/', require('./routes'));
// app.get('/bizlivekeepAlive/user', keepAlive.register);

// If no route is matched by now, it must be a 404
app.use((req, res, next) => {
  logger.error('Unknow URL');
  res.json(resp.getJsonError(error.code_00004, error.desc_00004));
  next();
});

// Catch 500 Error
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  logger.error('System Error : '+err);
  //res.json(resp.getJsonError(50000, err));
});

// Start the server
//=====HTTP=====
app.listen(cfg.https.port, () => {
  console.log(chalk.green("Server listen on : " + cfg.https.port));
  logger.info("Server listen on : " + cfg.https.port);
});
//=====HTTPS=====
// https.createServer(cfg.https.options, app).listen(cfg.https.port);
// console.log(chalk.green("Server listen on : " + cfg.https.port));

// }catch(err){
//   console.log('Error : ' + chalk.red(err));
//   // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
// }