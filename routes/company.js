'use strict'
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const error = require('../config/error')
const cfg = require('../config/config')
const logger = require('../utils/logUtils')
const ext = require('../utils/externalService')

exports.searchOrgInfo=(req,res) => {
  let cmd = 'searchOrgInfo'
  try{
    if(req.params){
      ext.omSearchOrgInfo(req,req.params)
      .then(om=>{
        logger.debug(req,cmd+'|'+util.jsonToText(om))
        resp.getSuccess(req,res,cmd,om)
      }).catch(err=>{
        // logger.error(req,cmd+'|'+util.jsonToText(err))
        resp.getOmError(req,res,cmd,err)
      })
    }else{
      logger.summary(req,cmd+'|'+error.desc_00005+'|params:'+util.jsonToText(req.params))
      res.json(resp.getJsonError(error.code_00005,error.desc_00005))
    }
  }catch(err){
    logger.error(req,cmd+'|'+err)
    logger.summary(req,cmd+'|'+error.desc_03001)
    res.json(resp.getJsonError(error.code_03001,error.desc_03001,err))
  }
}

exports.listCompany=(req,res) => {
  let cmd = 'listCompany'
  try{
    ext.omListCompanyInWireless(req)
    .then(om=>{
      logger.debug(req,cmd+'|'+util.jsonToText(om))
      resp.getSuccess(req,res,cmd,om)
    }).catch(err=>{
      // logger.error(req,cmd+'|'+util.jsonToText(err))
      resp.getOmError(req,res,cmd,err)
    })
  }catch(err){
    logger.error(req,cmd+'|'+err)
    logger.summary(req,cmd+'|'+error.desc_03001)
    res.json(resp.getJsonError(error.code_03001,error.desc_03001,err))
  }
}

exports.listOrg=(req,res) => {
  let cmd = 'listOrg'
  try{
    if(req.params.companyId){
      ext.omListOrganizeLower(req,req.params.companyId)
      .then(om=>{
        logger.debug(req,cmd+'|'+util.jsonToText(om))
        resp.getSuccess(req,res,cmd,om)
      }).catch(err=>{
        // logger.error(req,cmd+'|'+util.jsonToText(err))
        resp.getOmError(req,res,cmd,err)
      })
    }else{
      logger.summary(req,cmd+'|'+error.desc_00005+'|companyId:'+(req.params.companyId))
      res.json(resp.getJsonError(error.code_00005,error.desc_00005))
    }
  }catch(err){
    logger.error(req,cmd+'|'+err)
    logger.summary(req,cmd+'|'+error.desc_03001)
    res.json(resp.getJsonError(error.code_03001,error.desc_03001,err))
  }
}

exports.getEmployeeAndManager=(req,res) => {
  let cmd = 'getManager'
  try{
    if(req.header('x-userTokenId')){
      ext.omListAllApprover(req).then(om=>{
        logger.debug(req,cmd+'|'+util.jsonToText(om))
        resp.getSuccess(req,res,cmd,om)
      }).catch(err=>{
        // logger.error(req,cmd+'|'+util.jsonToText(err))
        resp.getOmError(req,res,cmd,err)
      })
    }else{
      logger.summary(req,cmd+'|'+error.desc_00005)
      res.json(resp.getJsonError(error.code_00005,error.desc_00005))
    }
  }catch(err){
    logger.error(req,cmd+'|'+err)
    logger.summary(req,cmd+'|'+error.desc_03001)
    res.json(resp.getJsonError(error.code_03001,error.desc_03001,err))
  }
}