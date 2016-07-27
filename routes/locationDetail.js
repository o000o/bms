'use strict'

const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require('util');
const error = require('../config/error');
const logger = require('../utils/logUtils');
const mDetail = require('../models/mBuildingDetail');

const locationDetail = {

  add: (req, res) => {
    let cmd = 'addLocationDetails';
    try{
      mDetail.bulkCreate(req.body.requestData.buildingDetailList, {validate:true})
      .then((succeed) => {
        logger.info(req,cmd+'|'+JSON.stringify(succeed));
        return resp.getSuccess(req,res,cmd); })
      .catch((err) => {
        logger.error(req,cmd+'|'+err);
        logger.summary(req,cmd+'|'+error.desc_01001);
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      })
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },

  edit: (req, res) => {
    let cmd = 'editLocationDetail';
    try{
      mDetail.update(req.body.requestData, {where:{buildingDetailId:req.body.requestData.buildingDetailId}})
      .then((succeed) => {
        logger.info(req,cmd+'|updated '+ succeed +' rows');
        return resp.getSuccess(req,res,cmd)
      }).catch((err) => {
        logger.error(req,cmd+'|'+err);
        logger.summary(req,cmd+'|'+error.desc_01001);
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },


  delete: (req, res) => {
    let cmd = 'deleteLocationDetail';
    try{
      const jWhere = {buildingDetailId:req.params.buildingDetailId};
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      cmd = 'destroyLocationDetail';
      mDetail.destroy({where:jWhere}).then((succeed) => {
        logger.info(req,cmd+'|deleted '+ succeed +' records');
        return resp.getSuccess(req,res,cmd);
      }).catch((err) => {
        logger.error(req,cmd+'|Error while delete LocationDetail|'+err);
        logger.summary(req,cmd+'|'+error.desc_01001);
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  }
}

module.exports = locationDetail;