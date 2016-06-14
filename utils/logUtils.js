var fs = require('fs');
var os = require("os");
var logCfg = require('../config/config');

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
    var dates = new Date();
    var years = dates.getFullYear();
    var months = dates.getMonth()+1;
    var day = dates.getDate();
    var hours = dates.getHours();
    var minutes = dates.getMinutes();
    var second = new Date().getSeconds();
    var millisecs = dates.getMilliseconds();
    var monthFormatted = months < 10 ? "0" + months : months;
    var dayFormatted = day < 10 ? "0" + day : day;
    var hourFormatted = hours < 10 ? "0" + hours : hours;
    var minFormatted = minutes < 10 ? "0" + minutes : minutes;
    var secFormatted = second < 10 ? "0" + second : second;
    var milliFormatted = null;

    if ( millisecs < 10 )
    {
        milliFormatted = "00" + millisecs;
    }
    else if ( millisecs < 100 )
    {
        milliFormatted = "0" + millisecs;
    }
    else
    {
        milliFormatted = millisecs;
    }

    return '['+years+'-'+monthFormatted+'-'+dayFormatted+' '+hourFormatted+':'+minFormatted+':'+secFormatted+':'+milliFormatted+']';
}

function getLogFileName()
{
    return os.hostname()+'_'+logCfg.log.projectName+'_'+getDateTimeFormat()+'.log';
}

exports.info = function (logMessage)
{
    var stream = fs.createWriteStream(logCfg.log.logPath+'/'+getLogFileName(), {'flags': 'a'});
    stream.once('open', function(fd) {
        stream.write(getDateTimeLogFormat()+' - info: '+logMessage+'\n');
        stream.end();
    });
};

exports.error = function(logMessage)
{
    var stream = fs.createWriteStream(logCfg.log.logPath+'/'+getLogFileName(), {'flags': 'a'});

    stream.once('open', function(fd) {
        stream.write(getDateTimeLogFormat()+' - error: '+logMessage+'\n');
                stream.end();
    });
};

