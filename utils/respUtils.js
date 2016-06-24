'use strict'
const error = require('../config/error');
const logger = require('./logUtils');
const cfg = require('../config/config');

exports.getJsonError = (errCode, errMsg, devMsg) => {
	if(cfg.devMsg) return { responseStatus: { responseCode: errCode, responseMessage: errMsg}, devMessage : devMsg};
	else return { responseStatus: { responseCode: errCode, responseMessage: errMsg}};
}

exports.getJsonSuccess = (errCode, errMsg, resObj) => {
	return { responseStatus: { responseCode: errCode, responseMessage: errMsg}, responseData : resObj};
}

exports.getInvalidToken = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Invalid Token');
	if(err!=null)res.status(err.status || 401);
	else res.status(401);
    res.json(this.getJsonError(error.code_00002, error.desc_00002, err.message));
}

exports.getInvalidUser = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Invalid User');
	if(err!=null)res.status(err.status || 401);
	else res.status(401);
    res.json(this.getJsonError(error.code_00001, error.desc_00001, err.message));
}

exports.getInternalError = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Undefined Internal Error');
	if(err!=null)res.status(err.status || 500);
	else res.status(500);
    res.json(this.getJsonError(error.code_00003, error.desc_00003, err.message));
}

exports.getIncompleteParameter = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Incomplete Parameter');
	if(err!=null)res.status(err.status || 400);
	else res.status(400);
    res.json(this.getJsonError(error.code_00005, error.desc_00005, err.message));
}

exports.getSuccess = (req,res,cmd,resObj) => {
	logger.summary(req,cmd+'|Success');
	// if(err!=null)res.status(err.status || 200);
	// else res.status(200);
    res.json(this.getJsonSuccess(error.code_00000, error.desc_00000, resObj));
}