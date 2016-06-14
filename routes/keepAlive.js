'use strict'

var chalk = require('chalk');
var response = require('../response/csodResponse.js');
const jwt = require('jwt-simple');
var csod = {

  register: function(req, res) {
 	console.log('csod.register Headers : ' + chalk.blue(JSON.stringify(req.headers, undefined, 2)));
 	console.log('csod.register Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
 	console.log('csod.register Token : ' + chalk.blue(req.header('x-userTokenId')));

 	// decode
 	var decoded = jwt.decode(req.header('x-userTokenId'), require('../config/secret.js')());
	// var decoded = jwt.decode(req.header('x-userTokenId'), secret);
	console.log('csod.register Token docode : ' + chalk.blue(JSON.stringify(decoded)));

    console.log(chalk.green('BIZ00053 : Corporate Register'));

    console.log('requestData : ' + JSON.stringify(req.body.requestData, undefined, 2));
   	let json = response.success
    console.log('auth.login response : ' + chalk.green(JSON.stringify(json, undefined, 2)));

    res.json(json);
  }

};

module.exports = csod;
