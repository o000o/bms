var nodemailer = require('nodemailer');
var fs = require('fs');
var replaceStream = require('replacestream')

var transporter = nodemailer.createTransport({
    host: '10.252.160.41',
    port : 25,
    connectionTimeout : 10000 // 10 Sec
});

// setup e-mail data with unicode symbols

var htmlstream = fs.createReadStream('./config/content.html');
htmlstream = htmlstream.pipe(replaceStream('{$urId}','ooo'))//.pipe(process.stdout)
var mailOptions = {
    from: 'bms_dev@corp.ais900dev.org', // sender address
    to: 'kittilau@corp.ais900dev.org;siripoko@corp.ais900dev.org;', // list of receivers
    // to: 'siripoko@corp.ais900dev.org',
    subject: 'BMS :: User-Request ที่ยังไม่ได้รับการดำเนินการ', // Subject line
    html: htmlstream // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

/*************************
Message sent: {"accepted":["kittilau@corp.ais900dev.org"],"rejected":[],
"response":"250 2.6.0 <befa6ae9-a188-e5bb-e096-d195e6e8e55b@corp.ais900dev.org> [InternalId=27927] 
Queued mail for delivery","envelope":{"from":"bms_dev@corp.ais900dev.org",
"to":["kittilau@corp.ais900dev.org"]},"messageId":"befa6ae9-a188-e5bb-e096-d195e6e8e55b@corp.ais900dev.org"}
*************************/