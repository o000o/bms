'use strict'

const config = module.exports = {};
const fs = require('fs');
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');

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
config.renewTokenTime = 10; // minutes, time left before token expire
config.interceptRespCode = ['00000','01001','01002','01003','01004']; //responseCode that will get new Token

// Regular Format
// config.regUserName = /^[a-zA-Z0-9]+$/;
config.regDigit = /^[0-9]+$/;

// Response Json
config.devMsg = true; //Response devMsg when error

// OM
config.om = {};
config.om.wsdlPath = __dirname+'/om.wsdl';
config.om.OmCode = 'OMTESTBMS';
config.om.options = {wsdl_options:{
    ntlm: true,
    username: "omws_stg",
    password: "OM@stg!#2014",
    domain: "corp-ais900dev"
}};

// Email Notification to DM
config.email = {};
config.email.notify = false;
config.email.transporter = nodemailer.createTransport({
    host: '10.252.160.41',
    port : 25,
    connectionTimeout : 10000 // 10 Sec
});
config.email.options = {
    from: 'bms_dev@corp.ais900dev.org', // sender address
    // to: 'kittilau@corp.ais900dev.org', // list of receivers
    subject: 'BMS :: User-Request ที่ยังไม่ได้รับการดำเนินการ', // Subject line
    html: fs.createReadStream('./config/content.html') // html body
};