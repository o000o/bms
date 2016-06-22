'use strict'
const error = require('../config/error');
const logger = require('./logUtils');

exports.getJsonError = (errCode, errMsg, devMsg) => {
	return { responseStatus: { responseCode: errCode, responseMessage: errMsg}, devMessage : devMsg};
}

/*exports.getJsonError = (errCode) => {
	return { responseStatus: { responseCode: errCode}};
}*/

exports.getJsonSuccess = (errCode, errMsg, resObj) => {
	return { responseStatus: { responseCode: errCode, responseMessage: errMsg}, responseData : resObj};
}

exports.getInvalidToken = (reqObj,resObj,cmd,err) => {
	logger.summary(reqObj,cmd+'|'+'Invalid Token');
	if(err!=null)resObj.status(err.status || 401);
	else resObj.status(401);
    resObj.json(this.getJsonError(error.code_00002, error.desc_00002, err));
}

exports.getInvalidUser = (resObj, err) => {
	if(err!=null)resObj.status(err.status || 401);
	else resObj.status(401);
    resObj.json(this.getJsonError(error.code_00001, error.desc_00001, err));
}

exports.getInternalError = (reqObj,resObj,cmd,err) => {
	logger.summary(reqObj,cmd+'|'+'Undefined Internal Error');
	if(err!=null)resObj.status(err.status || 500);
	else resObj.status(500);
    resObj.json(this.getJsonError(error.code_00003, error.desc_00003, err));
}

exports.getIncompleteParameter = (reqObj,resObj,cmd,err) => {
	logger.summary(reqObj,cmd+'|'+'Incomplete Parameter');
	if(err!=null)resObj.status(err.status || 400);
	else resObj.status(400);
    resObj.json(this.getJsonError(error.code_00005, error.desc_00005, err));
}

exports.getSuccess = (reqObj,resObj,cmd,err) => {
	logger.summary(reqObj,cmd+'|'+'Success');
	if(err!=null)resObj.status(err.status || 200);
	else resObj.status(200);
    resObj.json(this.getJsonSuccess(error.code_00000, error.desc_00000, err));
}