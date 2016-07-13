'use strict'

const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require("util");
const logger = require('../utils/logUtils');
const error = require('../config/error');
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
            // logger.error(req,cmd+'|Error when query or delete|'+err);
            // return resp.getInternalError(req,res,cmd,err);
          });
        }).catch((err) => {
          logger.error(req,cmd+'|Error when create mUrWf|'+err);
          // return resp.getInternalError(req,res,cmd,err);
          logger.summary(req,cmd+'|'+error.desc_01001);
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
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

//*********query at DM then add UR then add Workflow
//****** Replace updateBy:system with DM name
      cmd = 'callOM';
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      let args = {OmCode:cfg.om.OmCode,Username:util.getUserName(req.header('x-userTokenId'))}
      soap.createClient(cfg.om.wsdlPath, cfg.om.options, (err, client, body)=>{
        if (err) {
          logger.error(req,cmd+'|'+err);
          logger.summary(req,cmd+'|'+error.desc_01001);
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
        }else{
          client.setSecurity(new soap.NtlmSecurity(cfg.om.options.wsdl_options));
          client.OM_WS_GetEmployeeAndMgrByUser(args, (err, result)=>{
            if(err){
              logger.error(req,cmd+'|'+err);
              logger.summary(req,cmd+'|'+error.desc_01001);
              res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
            }else{
              cmd = 'chkOmResult';
              parser.parseString(result.OM_WS_GetEmployeeAndMgrByUserResult, (err, dataJsonStr)=>{
                if(!err && dataJsonStr.NewDataSet.Permission[0].MsgDetail[0]=='Success' && util.isDataFound(dataJsonStr.NewDataSet.Table)){
                // console.log(dataJsonStr.NewDataSet.Table[0].APPROVAL_EMAIL[0]); // Get Email
/******************
//No need because don't care success or not when update user_management table
                  cmd = 'asyncTasks';
                  // Array to hold async tasks
                  let asyncTasks = [];
                   
                  // Loop through some items
                  items.forEach((item)=>{
                    // We don't actually execute the async action here
                    // We add a function containing it to an array of "tasks"
                    asyncTasks.push((callback)=>{
                      // Call an async function, often a save() to DB
                      item.someAsyncCall(()=>{
                        // Async call is done, alert via callback
                        callback();
                      });
                    });
                  });

                  // To move beyond the iteration example, let's add
                  // another (different) async task for proof of concept
                  asyncTasks.push((callback)=>{
                    // Set a timeout for 3 seconds
                    setTimeout(()=>{
                      // It's been 3 seconds, alert via callback
                      callback();
                    }, 3000);
                  });
                   
                  // Now we have an array of functions doing async tasks
                  // Execute all async tasks in the asyncTasks array
                  async.parallel(asyncTasks, function(){
                    // All tasks are done now
                    doSomethingOnceAllAreDone();
                  });
*********/
                  let dmUser = dataJsonStr.NewDataSet.Table[0].APPROVAL_USERNAME[0];
                  let dmEmail = dataJsonStr.NewDataSet.Table[0].APPROVAL_EMAIL[0];
                  logger.info(req,cmd+'|dmUser:'+dmUser+'|dmEmail:'+dmEmail);
                  // cmd = 'updateUserManagement';
                  mUser.upsert({userName:dmUser, userType:'DM', createBy:'system'})
                  .then((succeed) => {
                    if(succeed) logger.info(req,'updateUserManagement|Inserted');
                    else logger.info(req,'updateUserManagement|Updated');
                  }).catch((err) => {
                    logger.info(req,'updateUserManagement|failed');
                    logger.error(req,'updateUserManagement|'+err);
                  })

                  cmd = 'addWorkflowData';
                  req.body.requestData.urWorkflowList={urStatus:req.body.requestData.urStatus,updateBy:dmUser};
                  logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData.urWorkflowList));
                  cmd = 'createUR&Workflow';
                  mUR.create(req.body.requestData, {include: [{model: mUrWf, as:'urWorkflowList'}]})
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
                  logger.summary(req,cmd+'|'+error.desc_01001);
                  res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
                }
              });
            }
          }, {timeout: 10000}); //10 Sec
        }
      });

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
      const jWhere = {urId:req.body.requestData.urId};
      delete req.body.requestData.urId;
      cmd = 'updateUR';
      logger.info(req,cmd+'|where:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null})+'|set:'+jsUtil.inspect(req.body.requestData, {showHidden: false, depth: null}));
      mUR.update(req.body.requestData, { where: jWhere }).then((succeed) => {
        logger.info(req,cmd+'|updated '+ succeed +' rows');
        return resp.getSuccess(req,res,cmd);
      }).catch((err) => {
        logger.error(req,cmd+'|Error while update UR|'+err);
        logger.summary(req,cmd+'|'+error.desc_01001);
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
        // logger.error(req,cmd+'|Error when query or delete|'+err);
        // return resp.getInternalError(req,res,cmd,err);
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
        // logger.error(req,cmd+'|Error when query or delete|'+err);
        // return resp.getInternalError(req,res,cmd,err);
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
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          // console.log(chalk.green('=========== isDigit ==========='));
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
      mUR.findAndCountAll(jLimit).then((db) => {
        cmd = 'chkUrData';
        // logger.info(req,cmd+'|'+JSON.stringify(db.rows));
        if(db.count>0) return resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"userRequestList":db.rows});
        else{
          logger.summary(req,cmd+'|Not Found UR');
          res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while check UR return|'+err);
        // return resp.getInternalError(req,res,cmd,err);

        logger.summary(req,cmd+'|'+error.desc_01002);
        res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
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
      if(util.isDataFound(req.body)){
        // mUR.findAll({where:req.body.requestData,
        // include:[{model:mUrWf, as: 'urWorkflowList',attributes: { exclude: ['urId'] }}]
        // }).then((db) => {
        // let jwhere = req.body.requestData
        // req.body.requestData.urCriteria.include = [{model:mUrWf, as: 'urWorkflowList',attributes: { exclude: ['urId'] },
        //   where:req.body.requestData.urWorkflowList}];
        // delete req.body.requestData.urWorkflowList;
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
          req.body.requestData.workflowCriteria.as='urWorkflowList';
          if(!util.isDataFound(req.body.requestData.workflowCriteria.attributes)&&JSON.stringify(req.body.requestData.workflowCriteria.attributes)!='[]'){
            logger.info(req,cmd+'|default workflow attributes');
            req.body.requestData.workflowCriteria.attributes={exclude:['urId'] }; 
          }else{
            logger.info(req,cmd+'|selected workflow attributes');
          }
          jWhere.include = req.body.requestData.workflowCriteria;
        }else{
          logger.info(req,cmd+'|default workflow with no criteria');
          jWhere.include = [{model:mUrWf, as: 'urWorkflowList',required: false,attributes: { exclude: ['urId'] }}];
        } 
        logger.info(req,cmd+'|searchOptions:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null}));
        
        cmd = 'findUR';
        mUR.findAll(jWhere).then((db) => {
          // console.log('rows.count: ' + chalk.blue(db.length));
          cmd = 'chkUrData';
          if(util.isDataFound(db)){
            // logger.info(req,cmd+'|Found db|'+JSON.stringify(db));
            logger.info(req,cmd+'|Found UR');
            return resp.getSuccess(req,res,cmd,{"userRequestList":db});
          }else{
            logger.summary(req,cmd+'|Not Found UR');
            res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));
            // mUR.findAll().then((db) => {res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));})
          }
        }).catch((err) => {
          logger.error(req,cmd+'|Error while check UR return|'+err);
          // return resp.getInternalError(req,res,cmd,err);
          logger.summary(req,cmd+'|'+error.desc_01002);
          res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
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
        if(util.isDataFound(db)){
          logger.info(req,cmd+'|Found UR|'+JSON.stringify(db));
          
          // console.log('ur_workflows : '+chalk.blue(JSON.stringify(db.ur_workflows)));
          cmd = 'chk urWorkflowList';
          if(util.isDataFound(db.urWorkflowList)){
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
        // return resp.getInternalError(req,res,cmd,err);
        logger.summary(req,cmd+'|'+error.desc_01002);
        res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
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