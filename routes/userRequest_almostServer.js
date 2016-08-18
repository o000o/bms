'use strict'

const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require('util');
const logger = require('../utils/logUtils');
const error = require('../config/error');
const cst = require('../config/constant');
const mUR = require('../models/mUR');
const mUrWf = require('../models/mUrWorkFlow');
const mUser = require('../models/mUser');
const cfg = require('../config/config');
const soap = require('soap-ntlm-2');
const parser = require('xml2js').Parser();

const userRequest = {

  updateStatus: (req, res) => {
    let cmd = 'updateStatusUr';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
      cmd = 'createWorkflow';
      mUrWf.create(req.body.requestData).then((succeed) => {
          logger.info(req,cmd+'|AddedWorkflow:'+JSON.stringify(succeed));
          const jWhere = {urId:req.body.requestData.urId};
          delete req.body.requestData.urId;
          delete req.body.requestData.updateBy
          cmd = 'updateUR';
          logger.info(req,cmd+'|where:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null})+'|set:'+jsUtil.inspect(req.body.requestData, {showHidden: false, depth: null}));
          mUR.update(req.body.requestData,{where:jWhere}).then((succeed) => {
            logger.info(req,cmd+'|updated '+ succeed +' records');
            return resp.getSuccess(req,res,cmd);
          }).catch((err) => {
            logger.error(req,cmd+'|Error while update UR|'+err);
            logger.summary(req,cmd+'|'+error.desc_01001);
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
          });
        }).catch((err) => {
          logger.error(req,cmd+'|Error when create mUrWf|'+err);
          logger.summary(req,cmd+'|'+error.desc_01001);
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
        })
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },

  add: (req, res) => {
    let cmd = 'addUr';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));

      if(req.body.requestData.urType!='EDITCONTRACT'){
//*********query at DM then add UR then add Workflow if not EDITCONTRACT
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
        cmd = 'callOM';
        soap.createClient(cfg.om.wsdlPath, cfg.om.options, (err, client, body)=>{
          if (err) {
            logger.error(req,cmd+'|'+err);
            logger.summary(req,cmd+'|'+error.desc_01001);
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
          }else{
            client.setSecurity(new soap.NtlmSecurity(cfg.om.options.wsdl_options));
            let args = {OmCode:cfg.om.OmCode,Username:util.getUserName(req.header('x-userTokenId'))}
            logger.info(req,cmd+'|'+JSON.stringify(args));
            client.OM_WS_GetEmployeeAndMgrByUser(args, (err, result)=>{
              logger.info(req,cmd+'|'+JSON.stringify(result));
              if(err){
                logger.error(req,cmd+'|'+err);
                logger.summary(req,cmd+'|'+error.desc_03001);
                res.json(resp.getJsonError(error.code_03001,error.desc_03001,err));
              }else{
                cmd = 'chkOmResult';
                parser.parseString(result.OM_WS_GetEmployeeAndMgrByUserResult, (err, dataJsonStr)=>{
                  logger.info(req,cmd+'|'+JSON.stringify(dataJsonStr));
                  if(err){
                    logger.error(req,cmd+'|'+err);
                    logger.summary(req,cmd+'|'+error.desc_03001);
                    res.json(resp.getJsonError(error.code_03001,error.desc_03001,err));
                  }else{
                    //if(dataJsonStr.NewDataSet.Permission[0].MsgDetail[0]=='Success' && util.isDataFound(dataJsonStr.NewDataSet.Table)){
					if(true){ //Bigboss modify
                      //Bigboss modify let dmUser = dataJsonStr.NewDataSet.Table[0].APPROVAL_USERNAME[0];
                      //Bigboss modify let dmEmail = dataJsonStr.NewDataSet.Table[0].APPROVAL_EMAIL[0];
					  let dmUser = 'watcharin'; //Bigboss modify
					  let dmEmail = 'kittilau@corp.ais900dev.org';//Bigboss modify
                      logger.info(req,cmd+'|dmUser:'+dmUser+'|dmEmail:'+dmEmail);
                      // cmd = 'updateUserManagement';
                      // mUser.upsert({userName:dmUser, userType:'DM', createBy:'system'})
                      // mUser.upsert({userName:dmUser, userType:'DM'})
                      // .then((succeed) => {
                      //   if(succeed) logger.info(req,'updateUserManagement|Inserted');
                      //   else logger.info(req,'updateUserManagement|Updated');
                      // }).catch((err) => {
                      //   logger.info(req,'updateUserManagement|failed');
                      //   logger.error(req,'updateUserManagement|'+err);
                      // })

                      cmd = 'addWorkflowData';
                      req.body.requestData.urWorkflowList={urStatus:req.body.requestData.urStatus,updateBy:dmUser};
                      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData.urWorkflowList));
                      cmd = 'createUR&Workflow';
                      mUR.create(req.body.requestData, {include: [{model: mUrWf, as:cst.models.urWorkflows}]})
                      .then((succeed) => {
                        //Send Email here!!!!
                        logger.info(req,'notifyEmail|'+cfg.email.notify);
                        if(cfg.email.notify){
                          cfg.email.options.to = dmEmail;
                          // cfg.email.options.to = 'kittilau@corp.ais900dev.org';
                          /****
                          URL: https://10.252.160.41/owa
                          user: kittilau
                          pass: Ais@09Jun
                          *****/
                          // send mail with defined transport object
                          cfg.email.transporter.sendMail(cfg.email.options, (error, info)=>{
                            if(error){
                              logger.info(req,'notifyEmail|failed');
                              logger.error(req,'notifyEmail|'+error);
                            }
                            logger.info(req,'notifyEmail|Sent:'+info.response);
                          });
                        }
                        logger.info(req,cmd+'|'+JSON.stringify(succeed));
                        return resp.getSuccess(req,res,cmd,succeed);
                      }).catch((err) => {
                        logger.error(req,cmd+'|'+err);
                        logger.summary(req,cmd+'|'+error.desc_01001);
                        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
                      })
                    }else{
                      err='No OM table found'
                      logger.error(req,cmd+'|'+err);
                      logger.summary(req,cmd+'|'+error.desc_03002);
                      res.json(resp.getJsonError(error.code_03002,error.desc_03002,err));
                    }
                  }
                })
              }
            }, {timeout:cfg.om.timeout}) //10 Sec
          }
        })
      }else{ //EDITCONTRACT don't add workflow
        cmd = 'createEditContractUR';
        if(util.isDataFound(req.body.requestData.contractId)){
          mUR.create(req.body.requestData).then((succeed) => {
            logger.info(req,cmd+'|'+JSON.stringify(succeed));
            return resp.getSuccess(req,res,cmd,succeed);
          }).catch((err) =>{
            logger.error(req,cmd+'|'+err);
            logger.summary(req,cmd+'|'+error.desc_01001);
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
          })
        }else{
          logger.info(req,cmd+'|No contractId not add editContract UR');
          return resp.getIncompleteParameter(req,res,cmd);
        }
      }
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },

  edit: (req, res) => {
    let cmd = 'editUr';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
      const jWhere = {urId:req.body.requestData.urId};
      delete req.body.requestData.urId;
      cmd = 'updateUR';
      logger.info(req,cmd+'|where:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null})+'|set:'+jsUtil.inspect(req.body.requestData, {showHidden: false, depth: null}));
      mUR.update(req.body.requestData, { where: jWhere }).then((succeed) => {
        logger.info(req,cmd+'|updated '+ succeed +' records');
        return resp.getSuccess(req,res,cmd);
      }).catch((err) => {
        logger.error(req,cmd+'|Error while update UR|'+err);
        logger.summary(req,cmd+'|'+error.desc_01001);
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },

  delete: (req, res) => {
    let cmd = 'deleteUr';
    try{
      const jWhere = {urId:req.params.urId};
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      cmd = 'destroyUR';
      mUR.destroy({where:jWhere}).then((succeed) => {
        logger.info(req,cmd+'|deleted '+ succeed +' records');
        return resp.getSuccess(req,res,cmd);
      }).catch((err) => {
        logger.error(req,cmd+'|Error while delete UR|'+err);
        logger.summary(req,cmd+'|'+error.desc_01001);
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },

  query: (req, res) => {
    let cmd = 'queryUr';
    try{
      const jLimit={offset: null, limit: null};
      if(Object.keys(req.query).length !=0){
        cmd = 'chkPageCount';
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          jLimit.offset = (req.query.page -1)*req.query.count;
          jLimit.limit = parseInt(req.query.count);
        }else{
          logger.info(req,cmd+'|page or count is wrong format');
          return resp.getIncompleteParameter(req,res,cmd);
        }
      }
      logger.info(req,cmd+'|'+JSON.stringify(jLimit));
      cmd = 'findUR';
      mUR.findAndCountAll(jLimit).then((db) => {
        cmd = 'chkUrData';
        logger.info(req,cmd+'|'+JSON.stringify(db));
        if(db.count>0) return resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"userRequestList":db.rows});
        else{
          logger.summary(req,cmd+'|Not Found UR');
          res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while check UR return|'+err);
        logger.summary(req,cmd+'|'+error.desc_01002);
        res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
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
    let cmd = 'queryUrByCriteria';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
      if(util.isDataFound(req.body)){
        let jWhere = {};
        cmd = 'genWhere';
        if(util.isDataFound(req.body.requestData.urCriteria)){
          logger.info(req,cmd+'|gen urCriteria');
          jWhere = req.body.requestData.urCriteria;
        }else{
          logger.info(req,cmd+'|default UR with no criteria');
        }
        if(util.isDataFound(req.body.requestData.workflowCriteria)){
          logger.info(req,cmd+'|gen workflowCriteria');
          req.body.requestData.workflowCriteria.model=mUrWf;
          req.body.requestData.workflowCriteria.as=cst.models.urWorkflows;
          if(!util.isDataFound(req.body.requestData.workflowCriteria.attributes)&&JSON.stringify(req.body.requestData.workflowCriteria.attributes)!='[]'){
            logger.info(req,cmd+'|default workflow attributes');
            req.body.requestData.workflowCriteria.attributes={exclude:['urId'] }; 
          }else{
            logger.info(req,cmd+'|selected workflow attributes');
          }
          jWhere.include = req.body.requestData.workflowCriteria;
        }else{
          logger.info(req,cmd+'|default workflow with no criteria');
          jWhere.include = [{model:mUrWf, as:cst.models.urWorkflows,required: false,attributes: { exclude: ['urId'] }}];
        } 
        logger.info(req,cmd+'|searchOptions:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null}));
        
        cmd = 'findUR';
        mUR.findAll(jWhere).then((db) => {
          cmd = 'chkUrData';
          logger.info(req,cmd+'|'+JSON.stringify(db));
          if(util.isDataFound(db)){
            logger.info(req,cmd+'|Found UR');
            return resp.getSuccess(req,res,cmd,{"userRequestList":db});
          }else{
            logger.summary(req,cmd+'|Not Found UR');
            res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));
          }
        }).catch((err) => {
          logger.error(req,cmd+'|Error while check UR return|'+err);
          logger.summary(req,cmd+'|'+error.desc_01002);
          res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
        });
      }else{
        logger.info(req,cmd+'|Not Found requestData|');
        return resp.getIncompleteParameter(req,res,cmd);
      }
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },

  queryById: (req, res) => {
    let cmd = 'queryUrById';
    try{
      const jWhere = {urId:req.params.urId};
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      cmd = 'findUR';
      mUR.findOne({where:jWhere, 
        include:[{model:mUrWf, as:cst.models.urWorkflows,attributes:{exclude:['urId']}}]}).then((db) => {
        cmd = 'chkUrData';
        logger.info(req,cmd+'|'+JSON.stringify(db));
        if(util.isDataFound(db)){
          logger.info(req,cmd+'|Found UR');
          cmd = 'chk urWorkflowList';
          if(util.isDataFound(db.urWorkflowList)){
            return resp.getSuccess(req,res,cmd,db);
          }else{
            logger.info(req,cmd+'|Not Found UrWorkflow|Delete Empty List');
            let dbClone = JSON.parse(JSON.stringify(db));
            delete dbClone.urWorkflowList;
            return resp.getSuccess(req,res,cmd,dbClone);
          }
        }else{
          logger.summary(req,cmd+'|Not Found UR');
          res.json(resp.getJsonError(error.code_01003,error.desc_01003));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while rearrange data|'+err);
        logger.summary(req,cmd+'|'+error.desc_01002);
        res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  }

};

module.exports = userRequest;
