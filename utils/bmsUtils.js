'use strict'

const cfg = require('../config/config');
const shhh = require('../config/secret.js');
// const logger = require('./logUtils');
const jwt = require('jwt-simple');

const utils = {
	simpleStringify: (object) => { //not use
		try{
		    var simpleObject = {};
		    for (var prop in object ){
		        if (!object.hasOwnProperty(prop)){
		            continue;
		        }
		        if (typeof(object[prop]) == 'object'){
		            continue;
		        }
		        if (typeof(object[prop]) == 'function'){
		            continue;
		        }
		        simpleObject[prop] = object[prop];
		    }
		    return JSON.stringify(simpleObject); // returns cleaned up JSON
		}catch(err){
			// logger.error('bmsUtils|simpleStringify|'+err);
			return err.message;
		}
	},

	isDataFound: (resObj) => {
		// try{ //wrong result if check, let it error and send error response
			if(resObj==null || resObj=='undefined' || resObj=='') return false //[],undefined,'',0,000
			else{
				if(resObj.length) return true //[1,2,3] ,'a','1' ('a'.length = 1)
				else {
					if (JSON.stringify(resObj).length>2) return true //{......},123,
					else if(/[0-9]/.test(resObj)) return true //0-9 (It is digit)
					else return false //{}(1,12 if not check digit first)
				}
			}
		// }catch(err){ //undefined.length
		// 	// logger.error('bmsUtils|idDataFound|'+err);
		// 	return false;
		// }
	},

	isDigit: (strDigit) => {
		try{
	//(strDigit && cfg.regDigit.test(strDigit)) ? return true : return false;
			if(strDigit && cfg.regDigit.test(strDigit)){
			    return true;
			}else{
			    return false;
			}
		}catch(err){
			// logger.error('bmsUtils|isDigit|'+err);
			return false;
		}
	},

	getToken: (data) => {
		try {
			let dateObj = new Date();
			let expire = dateObj.setMinutes(dateObj.getMinutes() + cfg.expires);
		    let userTokenId = jwt.encode({
		      // userId: data._id,
		      userName: data.userName,
		      userType: data.userType,
		      // password: data.password,
		      // userGroupId: data.userGroupId,
		      exp: expire
		    }, shhh());
		    return userTokenId;
		}catch(err){
			// logger.note('bmsUtils|getToken|'+err);
			return err.message;
		}

	},

	getUserName: (token) => {
		try {
			const decoded = jwt.decode(token, shhh());
		    return decoded.userName;
		}catch(err){
			// logger.note('bmsUtils|getUserName|'+err);
			return err.message;
		}
	},

	getExpireTime: (token) => {
		try {
			const decoded = jwt.decode(token, shhh());
		    return decoded.exp;
		}catch(err){
			// logger.error('bmsUtils|getExpireTime|'+err);
			return err.message;
		}
	},

	extractToken: (token) => {
		try {
		    return jwt.decode(token, shhh());
		}catch(err){
			// logger.error('bmsUtils|extractToken|'+err);
			return err.message;
		}
	}
}


module.exports = utils;