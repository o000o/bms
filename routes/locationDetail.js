'use strict'

const chalk = require('chalk');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require("util");
const error = require('../config/error');
const logger = require('../utils/logUtils');
// const mLocation = require('../models/mBuildingLocation');
// const mArea = require('../models/mBuildingArea');
const mDetail = require('../models/mBuildingDetail');

const locationDetail = {

  add: (req, res) => {
    let cmd = 'addLocationDetails';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
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
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
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
  }

}

module.exports = locationDetail;