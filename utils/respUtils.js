'use strict'
const error = require('../config/error')
const logger = require('./logUtils')
const cfg = require('../config/config')

exports.getJsonError = (errCode, errMsg, devMsg,userMsg) => {
	if(cfg.devMsg){
		if(devMsg!=null && devMsg.message) devMsg=devMsg.message
		return {responseStatus:{responseCode:errCode, responseMessage:errMsg}, devMessage:devMsg}
	}else return {responseStatus:{responseCode:errCode, responseMessage:errMsg}}
}

exports.getJsonSuccess = (errCode, errMsg, resObj) => {
	return {responseStatus: {responseCode: errCode, responseMessage: errMsg}, responseData : resObj}
}

exports.getInvalidToken = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Invalid Token')
	if(err!=null)res.status(err.status || 401)
	else res.status(401)
    res.json(this.getJsonError(error.code_00002, error.desc_00002, err))
}

exports.getInvalidUser = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Invalid User')
	if(err!=null)res.status(err.status || 401)
	else res.status(401)
	res.json(this.getJsonError(error.code_00001, error.desc_00001, err))
}

exports.getInternalError = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Undefined Internal Error')
	if(err!=null)res.status(err.status || 500)
	else res.status(500)
	res.json(this.getJsonError(error.code_00003, error.desc_00003, err))
}

exports.getIncompleteParameter = (req,res,cmd,err) => {
	logger.summary(req,cmd+'|Incomplete Parameter')
	if(err!=null)res.status(err.status || 400)
	else res.status(400)
	res.json(this.getJsonError(error.code_00005, error.desc_00005, err))
}

exports.getSuccess = (req,res,cmd,resObj) => {
	logger.summary(req,cmd+'|Success')
	// if(err!=null)res.status(err.status || 200)
	// else res.status(200)
    res.json(this.getJsonSuccess(error.code_00000, error.desc_00000, resObj))
}

exports.getOmError = (req,res,cmd,err) => {
	switch(err.code){
		case error.code_03002:
			logger.summary(req,cmd+'|'+error.desc_03002+'|'+err.desc)
			res.json(this.getJsonError(error.code_03002, error.desc_03002, err.desc))
			break
		case error.code_03003:
			logger.summary(req,cmd+'|'+error.desc_03003+'|'+err.desc)
			res.json(this.getJsonError(error.code_03003, error.desc_03003, err.desc))
			break
		case error.code_03004:
			logger.summary(req,cmd+'|'+error.desc_03004+'|'+err.desc)
			res.json(this.getJsonError(error.code_03004, error.desc_03004, err.desc))
			break
		case error.code_03005:
			logger.summary(req,cmd+'|'+error.desc_03005+'|'+err.desc)
			res.json(this.getJsonError(error.code_03005, error.desc_03005, err.desc))
			break
		case error.code_03006:
			logger.summary(req,cmd+'|'+error.desc_03006+'|'+err.desc)
			res.json(this.getJsonError(error.code_03006, error.desc_03006, err.desc))
			break
		default:
			logger.summary(req,cmd+'|'+error.desc_03001+'|'+err.desc)
			res.json(this.getJsonError(error.code_03001, error.desc_03001, err.desc))
            break  
	}
}