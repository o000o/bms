'use strict'

const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const ext = require('../utils/externalService')
// const jsUtil = require('util')
const logger = require('../utils/logUtils')
const error = require('../config/error')
const cst = require('../config/constant')
const mUR = require('../models/mUR')
const mUrWf = require('../models/mUrWorkFlow')
const mUser = require('../models/mUser')
const cfg = require('../config/config')
// const soap = require('soap-ntlm-2')
// const parser = require('xml2js').Parser()

const userRequest = {

  updateStatus: (req, res) => {
    let cmd = 'updateStatusUr'
    try{
      // logger.info(req,cmd+'|'+util.jsonToText(req.body.requestData))
      cmd = 'createWorkflow'
      mUrWf.create(req.body.requestData).then((succeed) => {
        logger.info(req,cmd+'|AddedWorkflow:'+util.jsonToText(succeed))
        const jWhere = {urId:req.body.requestData.urId}
        delete req.body.requestData.urId
        delete req.body.requestData.updateBy
        cmd = 'updateUR'
        logger.info(req,cmd+'|where:'+util.jsonToText(jWhere)+'|set:'+util.jsonToText(req.body.requestData))
        mUR.update(req.body.requestData,{where:jWhere}).then((succeed) => {
          logger.info(req,cmd+'|updated '+ succeed +' records')
          return resp.getSuccess(req,res,cmd)
        }).catch((err) => {
          logger.error(req,cmd+'|Error while update UR|'+err)
          logger.summary(req,cmd+'|'+error.desc_01001)
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
        })
      }).catch((err) => {
        logger.error(req,cmd+'|Error when create mUrWf|'+err)
        logger.summary(req,cmd+'|'+error.desc_01001)
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  },

  add: (req, res) => {
    let cmd = 'addUr'
    try{
      cmd = 'chkUrType_urStatus'
      if(req.body.requestData.urType && req.body.requestData.urStatus && req.header('x-userTokenId')){
        cmd = 'setUserRight'
        // admin group can create every type UR
        let userRight = (cst.userGroup.admin.indexOf(util.getUserType(req.header('x-userTokenId')))>=0) ? 1:0
        let upUser = {}
        cmd = 'selectUrType'
        switch(req.body.requestData.urType){
          case cst.urType.move: //everyone can
          case cst.urType.rental: //everyone can
          //insert UR add workflow query OM send email (manager)  query OM send email
            if(userRight) upUser.userType=cst.userType.managerAdmin
            else upUser.userType=cst.userType.manager
            userRight = 1
          case cst.urType.renewContract: //only admin group
          //insert UR add workflow(managerAdmin) query OM send email
          case cst.urType.cancelContract: //only admin group
          //insert UR add workflow(managerAdmin) query OM send email
            if(userRight && !util.isDataFound(upUser.userType)) upUser.userType=cst.userType.managerAdmin
            break
          case cst.urType.editContract://no need to add workflow just insert UR
            if(userRight){
              cmd = 'createEditContractUR'
              if(util.isDataFound(req.body.requestData.contractId)){
                mUR.create(req.body.requestData).then((succeed) => {
                  logger.info(req,cmd+'|'+util.jsonToText(succeed))
                  return resp.getSuccess(req,res,cmd,succeed)
                }).catch((err) =>{
                  logger.error(req,cmd+'|'+err)
                  logger.summary(req,cmd+'|'+error.desc_01001)
                  res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
                })
              }else{
                let err ='No contractId not add editContract UR'
                logger.info(req,cmd+'|'+err)
                return resp.getIncompleteParameter(req,res,cmd,err)
              }
              break
            }
          default: // response incomplete parameter if no urType match
            let err ='user has No Right or urType not match'
            logger.info(req,cmd+'|'+err)
            return resp.getIncompleteParameter(req,res,cmd,err)
            break
        }

        //call OM => save User & UR & Workflow => async.waterfall??
        if(userRight){
          cmd = 'callOM'
          ext.callOm(req,(err,result)=>{
            if(err){
              // logger.error(req,cmd+'|'+util.inspect(err))
              logger.error(req,cmd+'|'+util.jsonToText(err))
              logger.summary(req,cmd+'|'+err.desc)
              return res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
            }else{
              logger.info(req,cmd+'|OM result:'+util.jsonToText(result))
              upUser.userName = result.managerUser
              upUser.email = result.managerEmail
              upUser.name = result.managerName
              upUser.surname = result.managerSurname

              //Update Maneger data in table user don't care success or not just write log
              // cmd = 'updateUserManagement'
              logger.info(req,'prepareManagerData|'+util.jsonToText(upUser))
              // mUser.upsert({userName:dmUser, userType:'MANAGER', email:dmEmail, createBy:'system'})
              mUser.update(upUser,{where:{userName:upUser.userName}}).then((succeed) => {
                logger.info(req,'updateUserManagement|Updated '+ succeed +' records')
                if(succeed==0){  //Data not exist insert new
                  mUser.create(upUser).then((succeed) => {
                    logger.info(req,'updateUserManagement|Inserted:'+util.jsonToText(succeed))
                  }).catch((err) => {
                    logger.info(req,'updateUserManagement|InsertFailed|'+err)
                  })
                }
              }).catch((err) => {
                logger.info(req,'updateUserManagement|UpdateFailed|'+err)
              })}

              //Add UR & Workflow for real!!!
              cmd = 'prepareWorkflowData'
              req.body.requestData.urWorkflowList={urStatus:req.body.requestData.urStatus,
                updateBy:result.managerUser,department:result.department}
              logger.info(req,cmd+'|'+util.jsonToText(req.body.requestData.urWorkflowList))
              cmd = 'addUserEmail_Department'
              req.body.requestData.userDepartment = result.department
              req.body.requestData.userEmail = result.email
              req.body.requestData.userName = result.name
              req.body.requestData.userSurname = result.surname
              cmd = 'createUR_Workflow'
              mUR.create(req.body.requestData,{include:[{model: mUrWf, as:cst.models.urWorkflows}]})
              .then((succeed) => {
                logger.info(req,cmd+'|'+util.jsonToText(succeed))
                logger.info(req,'notifyEmail|'+cfg.email.notify)
                if(cfg.email.notify){ //Send Email?
                  ext.sendEmail(result.managerEmail,succeed,(result)=>{
                    logger.info(req,'notifyEmail|'+util.jsonToText(result))
                  })
                }
                return resp.getSuccess(req,res,cmd,succeed)
              }).catch((err) => {
                logger.error(req,cmd+'|'+err)
                logger.summary(req,cmd+'|'+error.desc_01001)
                res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
              })
          })
        }
      }else{
        let err ='No urType or urStatus'
        logger.info(req,cmd+'|'+err)
        return resp.getIncompleteParameter(req,res,cmd,err)
      }
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  },

  edit: (req, res) => {
    let cmd = 'editUr'
    try{
      // logger.info(req,cmd+'|'+util.jsonToText(req.body.requestData))
      const jWhere = {urId:req.body.requestData.urId}
      delete req.body.requestData.urId
      cmd = 'updateUR'
      logger.info(req,cmd+'|where:'+util.jsonToText(jWhere)+'|set:'+util.jsonToText(req.body.requestData))
      mUR.update(req.body.requestData,{where:jWhere}).then((succeed) => {
        logger.info(req,cmd+'|updated '+ succeed +' records')
        if(succeed>0) return resp.getSuccess(req,res,cmd)
        else{
          logger.summary(req,cmd+'|'+error.desc_01001)
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while update UR|'+err)
        logger.summary(req,cmd+'|'+error.desc_01001)
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  },

  delete: (req, res) => {
    let cmd = 'deleteUr'
    try{
      const jWhere = {urId:req.params.urId}
      logger.info(req,cmd+'|where:'+util.jsonToText(jWhere))
      cmd = 'destroyUR'
      mUR.destroy({where:jWhere}).then((succeed) => {
        logger.info(req,cmd+'|deleted '+ succeed +' records')
        return resp.getSuccess(req,res,cmd)
      }).catch((err) => {
        logger.error(req,cmd+'|Error while delete UR|'+err)
        logger.summary(req,cmd+'|'+error.desc_01001)
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  },

  query: (req, res) => {
    let cmd = 'queryUr'
    try{
      const jLimit={offset: null, limit: null}
      if(Object.keys(req.query).length !=0){
        cmd = 'chkPageCount'
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          jLimit.offset = (req.query.page -1)*req.query.count
          jLimit.limit = parseInt(req.query.count)
        }else{
          logger.info(req,cmd+'|page or count is wrong format')
          return resp.getIncompleteParameter(req,res,cmd)
        }
      }
      logger.info(req,cmd+'|'+util.jsonToText(jLimit))
      cmd = 'findUR'
      mUR.findAndCountAll(jLimit).then((db) => {
        cmd = 'chkUrData'
        logger.query(req,cmd+'|'+util.jsonToText(db))
        if(db.count>0) return resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"userRequestList":db.rows})
        else{
          logger.summary(req,cmd+'|Not Found UR')
          res.json(resp.getJsonError(error.code_01003,error.desc_01003,db))
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while check UR return|'+err)
        logger.summary(req,cmd+'|'+error.desc_01002)
        res.json(resp.getJsonError(error.code_01002,error.desc_01002,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  },


/*************
** "attributes": { "exclude": ["contractId","urDate","company"] },
{
    "requestData": {
        "urCriteria":{
          "attributes": ["urId", "urStatus"],
          "where":{
            "urType": "RENTAL",
            "company": "AIS",
            "urStatus":"ADMIN_ACCEPT",
            "urBy":"user"
          }
        },
        "workflowCriteria":{
          "attributes": ["urStatus"],
          "where":{
            "updateBy":"admin",
            "urStatus":"ADMIN_ACCEPT"
          }
        }
    }
}
*************/
  queryByCriteria: (req, res) => {
    let cmd = 'queryUrByCriteria'
    try{
      // logger.info(req,cmd+'|'+util.jsonToText(req.body.requestData))
      if(util.isDataFound(req.body)){
        let jWhere = {}
        cmd = 'genWhere'
        if(util.isDataFound(req.body.requestData.urCriteria)){
          logger.info(req,cmd+'|gen urCriteria')
          jWhere = req.body.requestData.urCriteria
        }else{
          logger.info(req,cmd+'|default UR with no criteria')
        }
        if(util.isDataFound(req.body.requestData.workflowCriteria)){
          logger.info(req,cmd+'|gen workflowCriteria')
          req.body.requestData.workflowCriteria.model=mUrWf
          req.body.requestData.workflowCriteria.as=cst.models.urWorkflows
          if(!util.isDataFound(req.body.requestData.workflowCriteria.attributes)&&util.jsonToText(req.body.requestData.workflowCriteria.attributes)!='[]'){
            logger.info(req,cmd+'|default workflow attributes')
            req.body.requestData.workflowCriteria.attributes={exclude:['urId'] } 
          }else{
            logger.info(req,cmd+'|selected workflow attributes')
          }
          jWhere.include = req.body.requestData.workflowCriteria
        }else{
          logger.info(req,cmd+'|default workflow with no criteria')
          jWhere.include = [{model:mUrWf, as:cst.models.urWorkflows,required: false,attributes: { exclude: ['urId'] }}]
        } 
        logger.info(req,cmd+'|searchOptions:'+util.jsonToText(jWhere))
        
        cmd = 'findUR'
        mUR.findAll(jWhere).then((db) => {
          cmd = 'chkUrData'
          logger.query(req,cmd+'|'+util.jsonToText(db))
          if(util.isDataFound(db)){
            logger.info(req,cmd+'|Found UR')
            return resp.getSuccess(req,res,cmd,{"userRequestList":db})
          }else{
            logger.summary(req,cmd+'|Not Found UR')
            res.json(resp.getJsonError(error.code_01003,error.desc_01003,db))
          }
        }).catch((err) => {
          logger.error(req,cmd+'|Error while check UR return|'+err)
          logger.summary(req,cmd+'|'+error.desc_01002)
          res.json(resp.getJsonError(error.code_01002,error.desc_01002,err))
        })
      }else{
        logger.info(req,cmd+'|Not Found requestData|')
        return resp.getIncompleteParameter(req,res,cmd)
      }
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  },

  queryById: (req, res) => {
    let cmd = 'queryUrById'
    try{
      const jWhere = {urId:req.params.urId}
      logger.info(req,cmd+'|where:'+util.jsonToText(jWhere))
      cmd = 'findUR'
      mUR.findOne({where:jWhere, 
        include:[{model:mUrWf, as:cst.models.urWorkflows,attributes:{exclude:['urId']}}]}).then((db) => {
        cmd = 'chkUrData'
        logger.query(req,cmd+'|'+util.jsonToText(db))
        if(util.isDataFound(db)){
          logger.info(req,cmd+'|Found UR')
          cmd = 'chk urWorkflowList'
          if(util.isDataFound(db.urWorkflowList)){
            return resp.getSuccess(req,res,cmd,db)
          }else{
            logger.info(req,cmd+'|Not Found UrWorkflow|Delete Empty List')
            let dbClone = JSON.parse(util.jsonToText(db))
            delete dbClone.urWorkflowList
            return resp.getSuccess(req,res,cmd,dbClone)
          }
        }else{
          logger.summary(req,cmd+'|Not Found UR')
          res.json(resp.getJsonError(error.code_01003,error.desc_01003))
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while rearrange data|'+err)
        logger.summary(req,cmd+'|'+error.desc_01002)
        res.json(resp.getJsonError(error.code_01002,error.desc_01002,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  }

}

module.exports = userRequest