'use strict'
// const response = require('../response/broadcastResponse.js');
const chalk = require('chalk');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const logger = require('../utils/logUtils');
const error = require('../config/error');
// const mContract = require('../models/mContract');
const mUR = require('../models/mUR');
const mUrWf = require('../models/mUrWorkFlow');
const cfg = require('../config/config');
// const mCfg = require('../config/modelCfg');

const userRequest = {

  updateStatus: (req, res) => {
    let cmd = 'updateStatusUr';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
      // console.log(chalk.green('=========== Approval UR ==========='));
      // console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      cmd = 'addWorkflow';
      mUrWf
        .build(req.body.requestData)
        .save()
        .then((succeed) => {
          // console.log('Save Result : ' + chalk.green(succeed));
          // console.log('Save Data : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
          const jWhere = {urId:req.body.requestData.urId};
          cmd = 'findUR';
          logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
          mUR.findOne({where:jWhere}).then((db) => {
            // console.log('UR => ' + chalk.blue(JSON.stringify(db)));
            cmd = 'chkUrData';
            if(util.chkDataFound(db)) {
              db
                .update(req.body.requestData)
                .then((succeed) => {
                  return resp.getSuccess(req,res,cmd);
                  // console.log('Save Result : ' + chalk.green(succeed));
                  // console.log('VendorProfile : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
                  // res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
                }).catch((err) => { //No use unless it has error under .then(succeed)
                  logger.error(req,cmd+'|Error when build or save|'+err);
                  logger.summary(req,cmd+'|'+error.desc_01001);
                  res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
                  // console.log('Error : ' + chalk.red(err));
                  // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
                })
            }else{
              logger.summary(req,cmd+'|Not Found UR');
              res.json(resp.getJsonError(error.code_01003,error.desc_01003));
            }
          }).catch((err) => {
            logger.error(req,cmd+'|Error when query or update mUR|'+err);
            return resp.getInternalError(req,res,cmd,err);
                // console.log('Error : ' + chalk.red(err));
                // res.json(resp.getJsonError(error.code_01002,error.desc_01002));
          });
        }).catch((err) => {
          logger.error(req,cmd+'|Error when build or save mUrWf|'+err);
          return resp.getInternalError(req,res,cmd,err);
          // console.log('Error : ' + chalk.red(err));
          // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
        })
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  add: (req, res) => {
    let cmd = 'addUr';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
      // console.log(chalk.green('=========== Add UR ==========='));
      // console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));

//*********query at DM then add UR then add Workflow
//****** Replace updateBy:system with DM data

      cmd = 'addUR';
      mUR
        .build(req.body.requestData)
        .save()
        .then((succeed) => {
          logger.info(req,cmd+'|AddedUR:'+JSON.stringify(succeed));
          cmd = 'addWorkflow';
          mUrWf
            .build({urId:"UR-20160624-01",urStatus:req.body.requestData.urStatus,updateBy: "system"})
            .save()
            .then((succeed) => {
              logger.info(req,cmd+'|AddedWF:'+JSON.stringify(succeed));
              return resp.getSuccess(req,res,cmd);
          }).catch((err) => {
            logger.error(req,cmd+'|Error when build or save mUrWf|'+err);
            logger.summary(req,cmd+'|'+error.desc_01001);
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
              // return resp.getInternalError(req,res,cmd,err);
              // console.log('Error : ' + chalk.red(err));
              // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
          })
          // return resp.getSuccess(req,res,cmd);
          // console.log('Save Result : ' + chalk.green(succeed));
          // console.log('Save Data : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
          // res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
        }).catch((err) => {
          logger.error(req,cmd+'|Error when build or save mUR|'+err);
          logger.summary(req,cmd+'|'+error.desc_01001);
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
          // return resp.getInternalError(req,res,cmd,err);
          // console.log('Error : ' + chalk.red(err));
          // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
        })
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  edit: (req, res) => {
    let cmd = 'editUr';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
      // console.log(chalk.green('=========== Edit UR ==========='));
      // console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      const jWhere = {urId:req.body.requestData.urId};
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      // console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
      // console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      cmd = 'findUR';
      mUR.findOne({where:jWhere}).then((db) => {
        // console.log('UR => ' + chalk.blue(JSON.stringify(db)));
        cmd = 'chkUrData';
        if(util.chkDataFound(db)) {
          cmd = 'updateUr';
          db
            .update(req.body.requestData)
            .then((succeed) => {
              return resp.getSuccess(req,res,cmd);
              // console.log('Save Result : ' + chalk.green(succeed));
              // console.log('VendorProfile : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
              // res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
            }).catch((err) => { //No use unless it has error under .then(succeed)
              // console.log('Error : ' + chalk.red(err));
              logger.error(req,cmd+'|Error when update|'+err);
              logger.summary(req,cmd+'|'+error.desc_01001);
              res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
            })
        }else{
          logger.summary(req,cmd+'|Not Found UR');
          res.json(resp.getJsonError(error.code_01003,error.desc_01003));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error when query or update|'+err);
        return resp.getInternalError(req,res,cmd,err);
            // console.log('Error : ' + chalk.red(err));
            // res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  delete: (req, res) => {
    let cmd = 'deleteUr';
    try{
      // console.log(chalk.green('=========== Delete UR ==========='));
      // console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      // const jWhere = { UR_ID: req.body.requestData.userid};
      const jWhere = {urId:req.params.urId};
      // console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
      // console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      cmd = 'findUR';
      mUR.findOne({where:jWhere}).then((db) => {
        // console.log('UR => ' + chalk.blue(JSON.stringify(db)));
        cmd = 'chkUrData';
        if(util.chkDataFound(db)) {
          cmd = 'deleteUr';
          db
            .destroy()
            .then((succeed) => {
              // console.log('Save Result : ' + chalk.green(succeed));
              return resp.getSuccess(req,res,cmd);
              // res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
            }).catch((err) => { //No use unless it has error under .then(succeed)
              logger.error(req,cmd+'|Error when delete|'+err);
              logger.summary(req,cmd+'|'+error.desc_01001);
              // return resp.getInternalError(req,res,cmd,err);
              // console.log('Error : ' + chalk.red(err));
              res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
            })
        } else {
          logger.summary(req,cmd+'|Not Found UR');
          res.json(resp.getJsonError(error.code_01003,error.desc_01003));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error when query or delete|'+err);
        return resp.getInternalError(req,res,cmd,err);
            // console.log('Error : ' + chalk.red(err));
            // res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  query: (req, res) => {
    let cmd = 'queryUr';
    try{
      // logger.info(req,cmd+'|'+req.query); //[object Object]
      // console.log(chalk.green('=========== Query UR with Paging ==========='));
      // console.log('Page : ' + chalk.blue(req.query.page));
      // console.log('Count : ' + chalk.blue(req.query.count));
      // console.log('query : ' + chalk.blue(req.query));
      // console.log('typeof query : ' + chalk.blue(typeof req.query));
      // const os=0, lm=0;
      const jLimit={offset: null, limit: null};
      // console.log('jLimit : '+chalk.blue(JSON.stringify(jLimit)));
      if(Object.keys(req.query).length !=0){
        cmd = 'chkPageCount';
        // console.log(chalk.green('=========== NOT NUll ==========='));
        if(util.chkDigit(req.query.page) && util.chkDigit(req.query.count)){
          // console.log(chalk.green('=========== chkDigit ==========='));
          jLimit.offset = (req.query.page -1)*req.query.count;
          jLimit.limit = parseInt(req.query.count);
        }else{
          logger.info(req,cmd+'|page or count is wrong format');
          return resp.getIncompleteParameter(req,res,cmd);
          // console.log(chalk.green('=========== Invalid ==========='));
          // return res.json(resp.getJsonError(error.code_00005,error.desc_00005));
        }
      }
      logger.info(req,cmd+'|'+JSON.stringify(jLimit));
      cmd = 'findUR';
      // console.log('jLimit : '+chalk.blue(JSON.stringify(jLimit)));
      // mUR.findAll({
      //   offset:os, limit:lm,
        // attributes: { include: [[cfg.sequelize.fn('COUNT', cfg.sequelize.col('*')), 'totalRecord']] }
        // attributes: [[cfg.sequelize.fn('COUNT', cfg.sequelize.col('UR_ID')), 'totalRecord']] 
      mUR.findAndCountAll(jLimit).then((db) => {
        // console.log('UR : '+chalk.blue(JSON.stringify(db)));
        // console.log('UR typeof : ' + chalk.blue(typeof db));
        // console.log('count: ' + chalk.blue(db.count));
        // console.log('rows: ' + chalk.blue(db.rows));
        // console.log('rows.count: ' + chalk.blue(db.rows.length));
        cmd = 'chkUrData';
        if(util.chkDataFound(db.count>0)) return resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"userRequestList":db.rows});
        else{
          logger.summary(req,cmd+'|Not Found UR');
          res.json(resp.getJsonError(error.code_01003,error.desc_01003));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while check UR return|'+err);
        return resp.getInternalError(req,res,cmd,err);
        // console.log('Error : ' + chalk.red(err));
        // res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
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
      if(util.chkDataFound(req.body)){
        // mUR.findAll({where:req.body.requestData,
        // include:[{model:mUrWf, as: 'urWorkflowList',attributes: { exclude: ['urId'] }}]
        // }).then((db) => {
        // let jwhere = req.body.requestData
        // req.body.requestData.urCriteria.include = [{model:mUrWf, as: 'urWorkflowList',attributes: { exclude: ['urId'] },
        //   where:req.body.requestData.urWorkflowList}];
        // delete req.body.requestData.urWorkflowList;
        let jWhere = {};
        cmd = 'genWhere';
        if(util.chkDataFound(req.body.requestData.urCriteria)){
          logger.info(req,cmd+'|gen urCriteria');
          jWhere = req.body.requestData.urCriteria;
        }else{
          logger.info(req,cmd+'|default UR attributes with no criteria');
        }
        if(util.chkDataFound(req.body.requestData.workflowCriteria)){
          logger.info(req,cmd+'|gen workflowCriteria');
          req.body.requestData.workflowCriteria.model=mUrWf;
          req.body.requestData.workflowCriteria.as='urWorkflowList';
          if(util.chkDataFound(req.body.requestData.workflowCriteria.attributes)){
            logger.info(req,cmd+'|selected workflow attributes');
            jWhere.include = req.body.requestData.workflowCriteria;
          }else{
            logger.info(req,cmd+'|default workflow attributes');
            req.body.requestData.workflowCriteria.attributes={ exclude: ['urId'] };
            jWhere.include = req.body.requestData.workflowCriteria;
          }
        }else{
          logger.info(req,cmd+'|default workflow attributes with no criteria');
          jWhere.include = [{model:mUrWf, as: 'urWorkflowList',attributes: { exclude: ['urId'] }}];
        }
        // console.log(jWhere); 

        cmd = 'findUR';
        mUR.findAll(jWhere).then((db) => {
          // console.log('rows.count: ' + chalk.blue(db.length));
          cmd = 'chkUrData';
          if(util.chkDataFound(db)) return resp.getSuccess(req,res,cmd,{"userRequestList":db});
          else{
            logger.summary(req,cmd+'|Not Found UR');
            res.json(resp.getJsonError(error.code_01003,error.desc_01003));
          }
        }).catch((err) => {
          logger.error(req,cmd+'|Error while check UR return|'+err);
          return resp.getInternalError(req,res,cmd,err);
          // console.log('Error : ' + chalk.red(err));
          // res.json(resp.getJsonError(error.code_01002,error.desc_01002));
        });
      }else{
        logger.info(req,cmd+'|Not Found requestData|');
        return resp.getIncompleteParameter(req,res,cmd);
        // res.json(resp.getJsonSuccess(error.code_00005,error.desc_00005));
      }
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  queryById: (req, res) => {
    let cmd = 'queryUrById';
    try{
      // console.log(chalk.green('=========== Query UR By Id ==========='));
      // console.log('Request URL : ' + chalk.blue(req.url)); // /userRequestById/UR_ID=111
      // console.log('req.params.urId : ' + chalk.blue(req.params.urId)); // /userRequestById/UR_ID=111

      const jWhere = {urId:req.params.urId};
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      cmd = 'findUR';
      // mUR.findOne({where:jWhere, include:[{model:mUrWf, where: { urStatus: 'DM_APPROVAL' }}]}).then((db) => {
      // mUR.findOne({where:jWhere, include:[{model:mUrWf,attributes:['wfId', 'urStatus','updateBy','updateTime','remark']}]}).then((db) => {
      // mUR.findOne({where:jWhere,attributes: [[mCfg.sequelize.fn('COUNT', mCfg.sequelize.col('UR_ID')), 'noUr']], 
      // mUR.findOne({where:jWhere,attributes: {include:[[mCfg.sequelize.fn('COUNT', mCfg.sequelize.col('UR_ID')), 'noUr']]}, 
      mUR.findOne({where:jWhere, 
        include:[{model:mUrWf, as: 'urWorkflowList',attributes: { exclude: ['urId'] }}]}).then((db) => {
        // console.log('UR : '+chalk.blue(JSON.stringify(db)));
        // console.log('UR count : '+chalk.blue(JSON.stringify(db)));
        cmd = 'chkUrData';
        if(util.chkDataFound(db)){
          logger.info(req,cmd+'|Found UR|'+JSON.stringify(db));
          
          // console.log('ur_workflows : '+chalk.blue(JSON.stringify(db.ur_workflows)));
          cmd = 'chk urWorkflowList';
          if(util.chkDataFound(db.urWorkflowList)){
            // logger.info(req,cmd+'|Found UrWorkflow|Change Name');
            // // console.log(chalk.green('=========== Yes ==========='));
            // dbClone.urWorkflowList = db.ur_workflows;
            // delete dbClone.ur_workflows;
            return resp.getSuccess(req,res,cmd,db);
          }else{
            logger.info(req,cmd+'|Not Found UrWorkflow|Delete Empty List');
            let dbClone = JSON.parse(JSON.stringify(db));
            // console.log(chalk.green('=========== No ==========='));
            delete dbClone.urWorkflowList;
            return resp.getSuccess(req,res,cmd,dbClone);
            // console.log('dbClone : '+chalk.blue(JSON.stringify(dbClone)));
          }
          // res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,dbClone));
        }else{
          // logger.info(req,cmd+'|Not Found UR');
          logger.summary(req,cmd+'|Not Found UR');
          res.json(resp.getJsonError(error.code_01003,error.desc_01003));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while rearrange data|'+err);
        return resp.getInternalError(req,res,cmd,err);
        // logger.summary(req,cmd+'|Rearrange Response Data Error');
        // // console.log('Error : ' + chalk.red(err));
        // res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
      });
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  }

};

module.exports = userRequest;