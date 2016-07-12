'use strict'

const config = module.exports = {};
const fs = require('fs');
const Sequelize = require('sequelize');

config.hostname = process.env.HOST || process.env.HOSTNAME;

// Http
config.https = {};
config.https.port = process.env.PORT || '8989';

// Https
config.https.options = {
  key: fs.readFileSync('./config/server.key'),
  cert: fs.readFileSync('./config/server.crt')
};

//DB config
config.dbName = 'Bldgdev';
// config.dbUser = 'admin';
// config.dbPwd = 'P@ssw0rd';
config.dbUser = 'postgres';
config.dbPwd = 'postgres';
config.dbHost = '10.252.163.130';
config.timeFormat = 'YYYY-MM-DD HH:mm:ss';
config.poolMax = 5;

// Cors
config.origin = '*';
config.methods = 'GET,PUT,POST,DELETE,OPTIONS';
config.allowedHeaders = 'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, X-Language, X-Session, x-userTokenId, Pragma, Cache-Control, If-Modified-Since';

// Log
config.log = {};
config.log.logPath = 'logs/';
config.log.logDbPath = 'logs/db';
config.log.projectName = 'BMS';
config.log.logTime = 15;

// Token
config.expires = 30; // minutes
config.renewTokenTime = 29; // minutes, time left before token expire
config.interceptRespCode = ['00000','01001','01002','01003','01004']; //responseCode that will get new Token

// Regular Format
// config.regUserName = /^[a-zA-Z0-9]+$/;
config.regDigit = /^[0-9]+$/;

// Response Json
config.devMsg = true; //Response devMsg when error
