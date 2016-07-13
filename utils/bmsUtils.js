'use strict'

const cfg = require('../config/config');
const shhh = require('../config/secret.js');
const util = require('../utils/bmsUtils');
const jwt = require('jwt-simple');

const utils = {
	simpleStringify: (object) => {
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
	},

	isDataFound: (resObj) => {
		if(resObj==null || resObj=='undefined'){
			return false;
		}else{
			if(resObj.length) return true;
			else {
				if (JSON.stringify(resObj).length>2) return true;
				else return false;
			}
		}
	},

	isDigit: (strDigit) => {
	//(strDigit && cfg.regDigit.test(strDigit)) ? return true : return false;
		if(strDigit && cfg.regDigit.test(strDigit)){
		    return true;
		}else{
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
		}catch (err){
			return err.message;
		}

	},

	getUserName: (token) => {
		try {
			const decoded = jwt.decode(token, shhh());
		    return decoded.userName;
		}catch (err){
			return err.message;
		}
	},

	getExpireTime: (token) => {
		try {
			const decoded = jwt.decode(token, shhh());
		    return decoded.exp;
		}catch (err){
			return err.message;
		}
	},

	extractToken: (token) => {
		try {
		    return jwt.decode(token, shhh());
		}catch (err){
			return err.message;
		}
	},
}


module.exports = utils;