'use strict'

const fs = require('fs');
const os = require("os");
const logCfg = require('../config/config');
const util = require('../utils/bmsUtils');
const moment = require('moment-timezone');

var exports = module.exports = {};

function getDateTimeFormat ()
{
    var dates = new Date();
    var years = dates.getFullYear();
    var months = dates.getMonth()+1;
    var day = dates.getDate();
    var hours = dates.getHours();
    var mins = dates.getMinutes();
    var monthFormatted = months < 10 ? "0" + months : months;
    var dayFormatted = day < 10 ? "0" + day : day;
    var hourFormatted = hours < 10 ? "0" + hours : hours;
    var result = "";
    var minFormatted = null;
    var div = null;

    if ( ( mins % logCfg.log.logTime ) > 0 )
    {
        minFormatted = ((Math.floor(mins / logCfg.log.logTime))*logCfg.log.logTime);
    }
    else
    {
        minFormatted = mins;
    }
    minFormatted = minFormatted < 10 ? "0" + minFormatted : minFormatted;
    result = ''+years+monthFormatted+dayFormatted+hourFormatted+minFormatted;
    return result;
}

function getDateTimeLogFormat()
{
    var dates = new Date()
    var years = dates.getFullYear()
    var months = dates.getMonth()+1
    var day = dates.getDate()
    var hours = dates.getHours()
    var minutes = dates.getMinutes()
    var second = new Date().getSeconds()
    var millisecs = dates.getMilliseconds()
    var monthFormatted = months < 10 ? "0" + months : months
    var dayFormatted = day < 10 ? "0" + day : day
    var hourFormatted = hours < 10 ? "0" + hours : hours
    var minFormatted = minutes < 10 ? "0" + minutes : minutes
    var secFormatted = second < 10 ? "0" + second : second
    var milliFormatted = null

    if ( millisecs < 10 )
    {
        milliFormatted = "00" + millisecs
    }
    else if ( millisecs < 100 )
    {
        milliFormatted = "0" + millisecs
    }
    else
    {
        milliFormatted = millisecs
    }

    return '['+years+'-'+monthFormatted+'-'+dayFormatted+' '+hourFormatted+':'+minFormatted+':'+secFormatted+':'+milliFormatted+']'
}

function getLogFileName()
{
    return os.hostname()+'_'+logCfg.log.projectName+'_'+getDateTimeFormat()+'.log'
}

function getLogHeader(logStatus,reqData) //${LogTime}|${hostname}|${appname}|INCOMING|Token|COMMAMD|Data|...
{
    let headTime = moment(new Date()).tz('Asia/Bangkok').format('YYYYMMDDHHmmss')
    // let strHead = getDateTimeLogFormat()+'|'+os.hostname()+logCfg.log.projectName+'|'+logStatus;
    let strHead = headTime+'|'+os.hostname()+logCfg.log.projectName+'|'+logStatus
    
    if(reqData!=null && reqData!=''){
        // strHead = strHead + '|'+reqData.path+ '|IP:'+reqData.ip+'|'+reqData.originalUrl;
        strHead = strHead + '|'+reqData.method +'|API:'+reqData.url+'|USER:' + util.getUserName(reqData.header('x-userTokenId'))
    }
    return strHead
}

function writeLog(namePath,logMessage) //${LogTime}|${hostname}|${appname}|INCOMING|Token|COMMAMD|Data|...
{
    var stream = fs.createWriteStream(namePath, {'flags': 'a'})
    stream.once('open', (fd) => {
        stream.write(logMessage+'\n')
        stream.end()
    });
}

exports.info = (reqData, errMsg) =>
{//${LogTime}|${hostname}|${appname}|INFO|Token|COMMAMD|Data|...
    if(logCfg.log.process){
        let error = ''
        if(errMsg != null && errMsg != '' && errMsg != 'undefined') error = '|'+errMsg
        let logMsg = getLogHeader('INFO',reqData)+error
        writeLog(logCfg.log.logPath+'/'+getLogFileName(),logMsg)
    }
}

exports.error = (reqData, errMsg) =>
{//${LogTime}|${hostname}|${appname}|ERROR|Token|COMMAMD|Data|...
    if(logCfg.log.process){
        let error = ''
        if(errMsg != null && errMsg != '' && errMsg != 'undefined') error = '|'+errMsg
        let logMsg = getLogHeader('ERROR',reqData)+error
        writeLog(logCfg.log.logPath+'/'+getLogFileName(),logMsg)
    }
}

exports.incoming = (reqData, errMsg) =>
{//${LogTime}|${hostname}|${appname}|INCOMING|Token|COMMAMD|Data|...
    let error = ''
    if(errMsg != null && errMsg != '' && errMsg != 'undefined') error = '|ERROR:'+errMsg
    let logMsg = getLogHeader('INCOMING',reqData)+'|Body:'+JSON.stringify(reqData.body)+error
    writeLog(logCfg.log.logPath+'/'+getLogFileName(),logMsg)
}

exports.summary = (reqData, errMsg) =>
{//${LogTime}|${hostname}|${appname}|SUMMARY|Token|InTime|OutTime|DiffTime|INPUT|OUTPUT|STATUS|ResultCode|ResultDesc
    let error = ''
    if(errMsg != null && errMsg != '' && errMsg != 'undefined') error = '|'+errMsg
    let logMsg = getLogHeader('SUMMARY',reqData)+error
    writeLog(logCfg.log.logPath+'/'+getLogFileName(),logMsg)
}

exports.db = (reqData) =>
{
    writeLog(logCfg.log.logDbPath+'/'+getLogFileName(),getLogHeader('DB')+'|'+reqData)
}

exports.query = (reqData, errMsg) =>
{
    if(logCfg.log.queryResult){
        let error = ''
        if(errMsg != null && errMsg != '' && errMsg != 'undefined') error = '|'+errMsg
        let logMsg = getLogHeader('QUERY',reqData)+error
        writeLog(logCfg.log.logPath+'/query/'+getLogFileName(),logMsg)
    }
}

