var nodemailer = require('nodemailer');
var fs = require('fs');

var transporter = nodemailer.createTransport({
    host: '10.252.160.41',
    port : 25,
    connectionTimeout : 10000 // 10 Sec
});

// setup e-mail data with unicode symbols

var htmlstream = fs.createReadStream('./config/content.html');
var mailOptions = {
    from: 'bms_dev@corp.ais900dev.org', // sender address
    to: 'kittilau@corp.ais900dev.org', // list of receivers
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