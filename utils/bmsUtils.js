'use strict'

const cfg = require('../config/config');
const shhh = require('../config/secret.js');
const util = require('../utils/bmsUtils');
const jwt = require('jwt-simple');

const utils = {

	// chkUserName: (strUserName) => {
 //    	(strUserName && cfg.regUserName.test(strUserName)) ? return true : return false;
	// },

	// chkDigit: (strDigit) => {
	// 	(strDigit && cfg.regDigit.test(strDigit)) ? return true : return false;
	// },

	// setTotalRecord: (resObj,strObjName) => {
	// 	      console.log('strObjName : '+(Object.keys(strObjName)));
 //      console.log('strObjName typeof : ' + (typeof strObjName));
	// 	return {totalRecord: resObj.count, strObjName: resObj.rows};

	// },

	chkDataFound: (resObj) => {
		// console.log('resObj: ' + resObj);
		if(resObj==null){
			return false;
		}else{
			// console.log('resObj.length: ' + resObj.length);
			// console.log('resObj JSON : '+JSON.stringify(resObj));
			// console.log('resObj JSON : '+JSON.stringify(resObj).length);
			if(resObj.length) return true;
			else {
				if (JSON.stringify(resObj).length>2) return true;
				else return false;
			}
		}
	},

	chkDigit: (strDigit) => {
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

	// getPassword: (token) => {
	// 	try {
	// 		const decoded = jwt.decode(token, shhh());
	// 	    return decoded.password;
	// 	}catch (err){
	// 		return err.message;
	// 	}
	// },

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