'use strict'

const config = module.exports = {}
const fs = require('fs')
const Sequelize = require('sequelize')
const nodemailer = require('nodemailer')
const ip = require('ip')
const cst = require('../config/constant')

config.hostname = process.env.HOST || process.env.HOSTNAME

// Http
config.https = {}
config.https.port = process.env.PORT || '8989'

// Https
config.https.options = {
	key: fs.readFileSync('./config/server.key'),
	cert: fs.readFileSync('./config/server.crt')
}

//DB config
config.dbName = 'Bldgdev'
// config.dbUser = 'admin'
// config.dbPwd = 'P@ssw0rd'
config.dbUser = 'bmsadmin' //'postgres'
config.dbPwd = 'P@ssw0rd' //'postgres'
config.dbHost = '10.252.163.130'
config.timeFormat = 'YYYY-MM-DD HH:mm:ss'
config.poolMax = 5

// Cors
config.origin = '*'
config.methods = 'GET,PUT,POST,DELETE,OPTIONS'
config.allowedHeaders = 'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, X-Language, X-Session, x-userTokenId, Pragma, Cache-Control, If-Modified-Since'

// Log
config.log = {}
config.log.logPath = 'logs/'
config.log.logDbPath = 'logs/db'
config.log.projectName = 'BMS'
config.log.logTime = 15
config.log.db = true
config.log.info = true
config.log.error = true
config.log.queryResult = true
config.log.debug = false

// Token
config.expires = 30 // minutes
config.renewTokenTime = 10 // minutes, time left before token expire
config.interceptRespCode = ['00000','01001','01002','01003','01004'] //responseCode that will get new Token

// Regular Format
// config.regUserName = /^[a-zA-Z0-9]+$/
config.regDigit = /^[0-9]+$/

// Response Json
config.devMsg = true //Response devMsg when error

// Department for workflow
config.adminDepartment = 'Admin Team'

// OM
config.om = {}
config.om.timeout = 10000 //10 Sec
config.om.wsdlPath = __dirname+'/om.wsdl'
config.om.OmCode = 'OMTESTBMS'
config.om.options = {wsdl_options:{
    ntlm: true,
    username: 'omws_stg',
    password: 'OM@stg!#2014',
    domain: 'corp-ais900dev'
}}
config.om.approvalPosition = ['VP','SVP','EVP','SEVP','C Level'] //Which Position is required to approve UR after DM approved

// Email Notification to DM
config.email = {}
config.email.notify = true
config.email.subject = {}
config.email.subject[cst.status.wDmApproval] = 'BMS :: User-Request ที่รอการอนุมัติ' //user create request email manager
config.email.subject[cst.status.dmApproved] = 'BMS :: User-Request ที่รอการอนุมัติ' //dm approved email VP
config.email.subject[cst.status.wVpApproval] = 'BMS :: User-Request ที่รอการอนุมัติ' //dm approved email VP
config.email.subject[cst.status.dmRejected] = 'BMS :: User-Request ที่ไม่ผ่านการอนุมัติ' //manager reject request email user
config.email.subject[cst.status.vpRejected] = 'BMS :: User-Request ที่ไม่ผ่านการอนุมัติ' //VP reject request email user & manager
config.email.subject[cst.status.vpApproved] = 'BMS :: User-Request ที่ผ่านการอนุมัติ รอดำเนินการต่อ' //VP approved email admin
config.email.subject[cst.status.adminRejected] = 'BMS :: User-Request ที่ไม่ผ่านการอนุมัติ' //admin reject email user & manager , cc VP
config.email.subject[cst.status.complete] = 'BMS :: User-Request ที่ดำเนินการสำเร็จแล้ว' //admin completed UR email user & manager , cc VP
config.email.transporter = nodemailer.createTransport({
    host: '10.252.160.41',
    port : 25,
    connectionTimeout : 10000 // 10 Sec
})
config.email.options = {
    from: 'bms_dev@corp.ais900dev.org', // sender address
    to: 'kittilau@corp.ais900dev.org', // uncomment when want to send to test email
    cc: 'siripoko@corp.ais900dev.org', // uncomment when want to send to test email
    // subject: 'BMS :: User-Request ที่ยังไม่ได้รับการดำเนินการ' // Subject line
    // html: fs.createReadStream('./config/content.html'), // html body
    html: fs.readFileSync('./config/content.html'), // html body
    attachments: [{
        filename: 'bmsLogo11.png',
        path: './config/bmsLogo11.png',
        cid: 'bmsLogo'
    }]
}

// Archiving
config.archiving = {}
config.archiving.authenURL = 'http://10.252.176.40:8002/services/ais_archive/get_s3_token'
config.archiving.downloadURL = 'http://10.252.176.40:8001/dj/en-us/ais_archive/tempcache/'
config.archiving.objectURL = 'https://10.252.161.38:8082/SOSD/SOSD/'
config.archiving.username = 'devuser4'
config.archiving.password = 'DevUser4!@#'
config.archiving.expireToken = '900' //second
config.archiving.clientIP = ip.address()
//config.archiving.clientIP = '127.0.0.1'

//SAML
config.sso = {}
config.sso.entryPoint = 'https://10.252.160.223:9443/samlsso'
config.sso.issuer = 'AppC'
config.sso.path = '/login/callback'
config.sso.passport = {
    strategy: 'saml',
    saml: {
        path: process.env.SAML_PATH || config.sso.path,
        entryPoint: process.env.SAML_ENTRY_POINT || config.sso.entryPoint,
        issuer: config.sso.issuer
        // cert: process.env.SAML_CERT || null,
        // identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        // protocol:'http://',
        // forceAuthn: 'false',
        // cert: 'MIICNTCCAZ6gAwIBAgIES343gjANBgkqhkiG9w0BAQUFADBVMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExFjAUBgNVBAcMDU1vdW50YWluIFZpZXcxDTALBgNVBAoMBFdTTzIxEjAQBgNVBAMMCWxvY2FsaG9zdDAeFw0xMDAyMTkwNzAyMjZaFw0zNTAyMTMwNzAyMjZaMFUxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEWMBQGA1UEBwwNTW91bnRhaW4gVmlldzENMAsGA1UECgwEV1NPMjESMBAGA1UEAwwJbG9jYWxob3N0MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCUp/oV1vWc8/TkQSiAvTousMzOM4asB2iltr2QKozni5aVFu818MpOLZIr8LMnTzWllJvvaA5RAAdpbECb+48FjbBe0hseUdN5HpwvnH/DW8ZccGvk53I6Orq7hLCv1ZHtuOCokghz/ATrhyPq+QktMfXnRS4HrKGJTzxaCcU7OQIDAQABoxIwEDAOBgNVHQ8BAf8EBAMCBPAwDQYJKoZIhvcNAQEFBQADgYEAW5wPR7cr1LAdq+IrR44iQlRG5ITCZXY9hI0PygLP2rHANh+PYfTmxbuOnykNGyhM6FjFLbW2uZHQTY1jMrPprjOrmyK5sjJRO4d1DeGHT/YnIjs9JogRKv4XHECwLtIVdAbIdWHEtVZJyMSktcyysFcvuhPQK8Qc/E/Wq8uHSCo='


        // path: process.env.SAML_PATH || '/login/callback',
        // entryPoint: process.env.SAML_ENTRY_POINT || 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        // issuer: 'passport-saml',
        // cert: process.env.SAML_CERT || null
    }
}
config.samlRedirect = 'http://localhost:3000'
