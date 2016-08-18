'use strict'

const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require('util');
const error = require('../config/error');
const logger = require('../utils/logUtils');
const cst = require('../config/constant')
const mInsurance = require('../models/mInsurance');
const mDocument = require('../models/mDocument');

const Insurance = {

  add: (req, res) => {
    let cmd = 'addInsurance';
    try{
      /*
      mInsurance.bulkCreate(req.body.requestData.insuranceNo, {validate:true})
      .then((succeed) => {
        logger.info(req,cmd+'|'+JSON.stringify(succeed));
        return resp.getSuccess(req,res,cmd); })
      .catch((err) => {
        logger.error(req,cmd+'|'+err);
        logger.summary(req,cmd+'|'+error.desc_01001);
        return res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      })

      let cloneLocation = (util.isDataFound(req.body.requestData.buildingLocation))?JSON.parse(JSON.stringify(req.body.requestData.buildingLocation)):null
      if(util.isDataFound(cloneLocation)) delete req.body.requestData.buildingLocation //delete Location
*/
      let clonedocument = []
      if(util.isDataFound(req.body.requestData.documentList)){
        cmd = 'checkDocumentList'
        clonedocument = JSON.parse(JSON.stringify(req.body.requestData.documentList))
        //req.body.requestData.documentList.forEach((value) => {clonedocument.push({insuranceId:value})})
        logger.info(req,cmd + '|' + req.body.requestData.documentList)
        delete req.body.requestData.documentList //delete documentList
        //let loData = JSON.parse(JSON.stringify(req.body.requestData.documentList))

      }

        cmd = 'addInsurance';
        let jWhere = {
            buildingId:req.body.requestData.buildingId,
            insuranceNo:req.body.requestData.insuranceNo
        };
        logger.info(req,cmd + '|where:'+JSON.stringify(jWhere));

        mInsurance.findOrCreate({
            where:jWhere, defaults:req.body.requestData,
      //      include:[
        //        {model: mDocument, as:cst.models.documents}
          //  ]
          })
        .spread((db,succeed) => {
          logger.info(req,cmd+'|Inserted:'+succeed+'|'+JSON.stringify(db))
          if(succeed){ // inserted
            //check and add agent here!!!
            cmd = 'addDocumentList'
            if(util.isDataFound(clonedocument)){
              clonedocument.forEach((value) => {
                value.insuranceId=db.insuranceId
                value.buildingId=db.buildingId
              }

            )
             //return resp.getSuccess(req,res,cmd,clonedocument)

                mDocument.bulkCreate(clonedocument, {validate:true})
                .then((succeed) => {
                  logger.info(req,'insertDocumentList|'+JSON.stringify(succeed))

                   return resp.getSuccess(req,res,cmd)
                }).catch((err) => {
                   logger.error(req,'insertDocumentList|'+err)
                   logger.summary(req,'insertDocumentList|'+error.desc_01001)
                   res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
                })

            }

          } else { //contract existed don't add
            logger.info(req,cmd+'|'+error.desc_01004);
            logger.summary(req,cmd+'|'+error.desc_01004);
            res.json(resp.getJsonError(error.code_01004,error.desc_01004,db));
          }
        }).catch((err) => {
            logger.error(req,cmd+'|Error:'+err);
            logger.summary(req,cmd+'|'+error.desc_01001);
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
        })
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  }
/*
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

  */
}

module.exports = Insurance;
