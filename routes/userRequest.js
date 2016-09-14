'use strict'

const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const ext = require('../utils/externalService')
const logger = require('../utils/logUtils')
const error = require('../config/error')
const cst = require('../config/constant')
const mUR = require('../models/mUR')
const mUrWf = require('../models/mUrWorkFlow')
const mUser = require('../models/mUser')
const cfg = require('../config/config')
const async = require('async')

const userRequest = {

  updateStatus: (req, res) => {
    let cmd = 'updateStatusUr'
    try{
      // insert workflow => update urStatus => send email
      let to = null
      cmd = 'startSeries'
      async.series([
        (callback)=>{ // check OM for VP information if dmApproved
          if(req.body.requestData.urStatus==cst.status.dmApproved){
            cmd = 'omGetVpUpByUser'
            ext.omGetVpUpByUser(req).then(om=>{
              // callback(null, om)

              logger.info(req,cmd+'|OM result:'+util.jsonToText(om))
              let upUser = {}
              upUser.userName = om.managerUser
              upUser.email = om.managerEmail
              upUser.name = om.managerName
              upUser.surname = om.managerSurname
              upUser.userType=cst.userType.vp
              to = om.managerEmail
              if(!om.department) om.department=req.body.requestData.department

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
              })

              //Add Workflow for VP!!!
              cmd = 'prepareWorkflowData'
              let workflow={urId:req.body.requestData.urId,urStatus:cst.status.wVpApproval,
                updateBy:om.managerUser,department:om.department}
              logger.info(req,cmd+'|'+util.jsonToText(workflow))

              cmd = 'createVpWorkflow'
              mUrWf.create(workflow).then((succeed) => {
                logger.info(req,cmd+'|AddedWorkflow:'+util.jsonToText(succeed))
                callback(null, succeed)
              }).catch((dberr) => {
                logger.error(req,cmd+'|'+dberr)
                logger.summary(req,cmd+'|'+error.desc_01001)
                callback(dberr,'Error when create mUrWf')
              })
            }).catch(oerr=>{
              // logger.error(req,cmd+'|'+util.jsonToText(oerr))
              // resp.getOmError(req,res,cmd,oerr)
              logger.error(req,cmd+'|'+util.jsonToText(oerr))
              logger.summary(req,cmd+'|'+oerr.desc)
              callback(oerr,'Error when call OM')
            })
          }else callback(null,'not insert VP')
        },
        (callback)=>{ // add workflow => config.adminDepartment = 'Admin Team' (front send this)
          cmd = 'createWorkflow'
          mUrWf.create(req.body.requestData).then((succeed) => {
            logger.info(req,cmd+'|AddedWorkflow:'+util.jsonToText(succeed))
            callback(null, succeed)
          }).catch((dberr) => {
            logger.error(req,cmd+'|'+dberr)
            logger.summary(req,cmd+'|'+error.desc_01001)
            callback(dberr,'Error when create mUrWf')
          })
        },
        (callback)=>{ // update UR
          cmd = 'setUrData'
          let jWhere = {urId:req.body.requestData.urId}
          let upStatus = {urStatus:req.body.requestData.urStatus}
          cmd = 'updateUR'
          logger.debug(req,cmd+'|where:'+util.jsonToText(jWhere)+'|set:'+util.jsonToText(upStatus))
          mUR.update(upStatus,{where:jWhere}).then((succeed) => {
            let updated = 'UR updated '+ succeed +' rows'
            logger.info(req,cmd+'|'+updated)
            if(succeed>0) callback(null, updated)
            else callback('No row update', updated)
          }).catch((dberr) => {
            logger.error(req,cmd+'|Error while update UR|'+dberr)
            logger.summary(req,cmd+'|'+error.desc_01001)
            callback(dberr,'Error while update UR')
          })
        },
        (callback)=>{ // send Email notification
      //manager approve => email admin <= query all admin in user for email and send them all
      //manager reject => email user <= email in UR
      //admin reject => email user & manager <= email in UR & user <= search manager from workflow
      //admin accept => don't email
      //admin complete => email user & manager <= email in UR & user <= search manager from workflow
          let wcmd = 'chkNotifyEmail'
          logger.debug(req,'notifyEmail|'+cfg.email.notify)
          if(cfg.email.notify){ //Send Email?
            wcmd = 'startWaterfall'
            async.waterfall([(wcallback)=>{ //gen To
                wcmd = 'chkUrStatus' //to know who to send email to
                let cc = null
                // let to = null
                switch(req.body.requestData.urStatus){
                  case cst.status.dmApproved: //email VP
                    //ooo  call OM to get VP Email and Save into DB user
                    if(to) wcallback(null,to,cc)
                    else wcallback('Emails Not Found', null)
                    break
                  case cst.status.vpApproved: //email Admin group query user_management
                    //search all admin emails from users table
                    wcmd = 'findAdminEmails'
                    mUser.findAll({where:{userType:cst.userType.centerAdmin},attributes:['email']})
                    .then((emails) => {
                      logger.debug(req,wcmd+'|'+util.jsonToText(emails))
                      if(util.isDataFound(emails)){
                        wcmd = 'genEmailTo'
                        to = ''
                        emails.forEach((value) => {if(util.isDataFound(value.email)) to=to+value.email+';'})
                        wcallback(null,to,cc)
                      }else wcallback('Emails Not Found', null)
                    }).catch((werr) => {
                      logger.error(req,wcmd+'|'+werr)
                      wcallback(werr,null)
                    })
                    break
                  case cst.status.dmRejected: //email User query UR
                    wcmd = 'genEmailTo'
                    wcallback(null, '{$userEmail}',cc) //replace after query UR
                    break
                  case cst.status.adminRejected: //email User & Manager & cc VP
                  case cst.status.complete: //email User & Manager & cc VP
                    to = '{$userEmail};' //replace after query UR
                    wcmd = 'findManagerAndVpName'
                    mUrWf.findAll({group:['update_by','ur_status'],attributes:['updateBy','urStatus'],
                      where:{urId:req.body.requestData.urId,$or:[{urStatus:cst.status.dmApproved},{urStatus:cst.status.vpApproved}]}
                    }).then((updateBy) => {
                      logger.debug(req,wcmd+'|'+util.jsonToText(updateBy))
                      if(util.isDataFound(updateBy)){
                        wcmd = 'genWhereUser'
                        let where = {$or:[]}
                        updateBy.forEach(value => {
                            where.$or.push({userName:value.updateBy})
                        })
                        logger.debug(req,wcmd+'|'+util.jsonToText(where))
                        wcmd = 'findManagerAndVpEmail'
                        mUser.findAll({where:where,attributes:['email','userType'],
                          group:['username','email','user_type']})
                        .then((email) => {
                          logger.debug(req,wcmd+'|'+util.jsonToText(email))
                          if(util.isDataFound(email)){
                            wcmd = 'genEmailTo'
                            email.forEach(value => {
                              if(cst.userGroup.manager.indexOf(value.userType)>=0) to=to+value.email+';'
                              if(cst.userGroup.vp.indexOf(value.userType)>=0){
                                if(cc) cc=cc+value.email+';'
                                else cc=value.email+';'
                              }
                            })
                            wcallback(null,to,cc)
                          }else{
                            logger.info(req,wcmd+'|Email Not Found')
                            wcallback(null,to,cc)
                          }
                        }).catch((werr) => { // can't find manager send email to user only
                          logger.error(req,wcmd+'|'+werr)
                          wcallback(null,to,cc)
                        })
                      }else{
                        logger.info(req,wcmd+'|Manager Not Found')
                        wcallback(null,to,cc)
                      }
                    }).catch((werr) => { // can't find manager send email to user only
                      logger.error(req,wcmd+'|'+werr)
                      wcallback(null,to,cc)
                    })
                    break
                  case cst.status.vpRejected: //email User & Manager
                    to = '{$userEmail};' //replace after query UR
                    wcmd = 'findManagerName'
                    mUrWf.findOne({attributes:['updateBy'],
                      where:{urId:req.body.requestData.urId,urStatus:cst.status.dmApproved}
                    }).then((updateBy) => {
                      logger.debug(req,wcmd+'|'+util.jsonToText(updateBy))
                      if(util.isDataFound(updateBy)){
                        wcmd = 'findManagerEmail'
                        mUser.findOne({where:{userName:updateBy.updateBy},attributes:['email']})
                        .then((email) => {
                          logger.debug(req,wcmd+'|'+util.jsonToText(email))
                          if(util.isDataFound(email.email)){
                            wcmd = 'genEmailTo'
                            to = to+email.email
                            wcallback(null,to,cc)
                          }else{
                            logger.info(req,wcmd+'|Manager Email Not Found')
                            wcallback(null,to,cc)
                          }
                        }).catch((werr) => { // can't find manager send email to user only
                          logger.error(req,wcmd+'|'+werr)
                          wcallback(null,to,cc)
                        })
                      }else{
                        logger.info(req,wcmd+'|Manager Not Found')
                        wcallback(null,to,cc)
                      }
                    }).catch((werr) => { // can't find manager send email to user only
                      logger.error(req,wcmd+'|'+werr)
                      wcallback(null,to,cc)
                    })
                    break
                  default:
                    callback(null,'DONE')
                    break                
                }
              },
              (to,cc,wcallback)=>{ //query UR
                wcmd = 'chkTo'
                logger.debug(req,wcmd+'|To:'+to+'|cc:'+cc)
                if(to){ //check if we have email to send
                  wcmd = 'findUR'
                  let jWhere = {urId:req.body.requestData.urId}
                  logger.debug(req,wcmd+'|'+util.jsonToText(jWhere))
                  mUR.findOne({where:jWhere}).then((db) => {
                    logger.debug(req,wcmd+'|'+util.jsonToText(db))
                    wcmd = 'chkUrReturn'
                    if(util.isDataFound(db)){
                      wcmd = 'replaceUserEmail'
                      to = to.replace('{$userEmail}', db.userEmail)
                      logger.debug(req,wcmd+'|'+to)
                      wcallback(null,to,cc,db)
                    }else{
                      wcallback('UR Not Found',null)
                    }
                    // resp.getSuccess(req,res,cmd)
                  }).catch((werr) => {
                    logger.error(req,wcmd+'|Query UR Error|'+werr)
                    wcallback(werr,null)
                  })
                }else{ // No one to send email
                  logger.info(req,wcmd+'|Not found email to send')
                  wcallback('Not found email to send',null)
                }
              },

              (to,cc,ur,wcallback)=>{ //Send Email
                wcmd = 'sendEmail'
                logger.info(req,wcmd+'|To:'+to+'|cc:'+cc) // Remove after use test email
                logger.debug(req,wcmd+'|To:'+to+'|cc:'+cc+'|UR:'+util.jsonToText(ur))
                ext.sendEmail(to,cc,ur).then(mresult=>{
                  logger.info(req,'notifyEmail|'+util.jsonToText(mresult))
                  wcallback(null,mresult)
                }).catch(merr=>{
                  logger.error(req,'notifyEmail|'+util.inspect(merr))
                  wcallback(null,merr)
                })
              }], (werr, wresult)=>{
                if(werr){ // email not sent
                  callback(null,'Did not email notification:'+werr)
                }else{ // email sent
                  callback(null,wresult)
                }
              }
            )
          }else callback(null,'notifyEmail:'+cfg.email.notify)
        }],
        // optional callback
        (err, results)=>{
          // final callback code
          if(err) {
            let errRes = {Error:util.inspect(err), Results:results}
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,errRes))
          }
          else resp.getSuccess(req,res,cmd,results)
        }
      )


//***********Old Flow**************
      // cmd = 'createWorkflow'
      // mUrWf.create(req.body.requestData).then((succeed) => {
      //   logger.info(req,cmd+'|AddedWorkflow:'+util.jsonToText(succeed))
      //   const jWhere = {urId:req.body.requestData.urId}
      //   delete req.body.requestData.urId
      //   delete req.body.requestData.updateBy
      //   cmd = 'updateUR'
      //   logger.info(req,cmd+'|where:'+util.jsonToText(jWhere)+'|set:'+util.jsonToText(req.body.requestData))
      //   mUR.update(req.body.requestData,{where:jWhere}).then((succeed) => {
      //     logger.info(req,cmd+'|updated '+ succeed +' records')
      //     resp.getSuccess(req,res,cmd)
      //   }).catch((err) => {
      //     logger.error(req,cmd+'|Error while update UR|'+err)
      //     logger.summary(req,cmd+'|'+error.desc_01001)
      //     res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      //   })
      // }).catch((err) => {
      //   logger.error(req,cmd+'|Error when create mUrWf|'+err)
      //   logger.summary(req,cmd+'|'+error.desc_01001)
      //   res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      // })
//***********Old Flow**************
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
    }
  },

  add: (req, res) => {
    let cmd = 'addUr'
    try{
      cmd = 'chkUrType_urStatus'
      if(req.body.requestData.urType && req.body.requestData.urStatus && req.header('x-userTokenId')){
        cmd = 'setUserRight'
        // admin group can create every type UR
        // console.log('oooooo1oooooo')
        let userRight = (cst.userGroup.admin.indexOf(util.getUserType(req.header('x-userTokenId')))>=0) ? 1:0
        let upUser = {}
        cmd = 'selectUrType'
        // console.log('oooooo2oooooo')
        switch(req.body.requestData.urType){
          case cst.urType.move: //everyone can
          case cst.urType.rental: //everyone can
          //insert UR add workflow query OM send email (manager)  query OM send email
            // if(userRight) upUser.userType=cst.userType.managerAdmin
            // else upUser.userType=cst.userType.manager
            // userRight = 1
          case cst.urType.renewContract: //only admin group
          //insert UR add workflow(managerAdmin) query OM send email
          case cst.urType.cancelContract: //only admin group
          //insert UR add workflow(managerAdmin) query OM send email
            if(userRight) upUser.userType=cst.userType.managerAdmin
            else upUser.userType=cst.userType.manager
            userRight = 1
            break
          //Old flow only amdin can renew and cancel
            // if(userRight && !util.isDataFound(upUser.userType)) upUser.userType=cst.userType.managerAdmin
            // break
          case cst.urType.editContract://no need to add workflow just insert UR
            if(userRight){
              userRight = 0
              cmd = 'createEditContractUR'
              if(util.isDataFound(req.body.requestData.contractId)){
                mUR.create(req.body.requestData).then((succeed) => {
                  logger.info(req,cmd+'|'+util.jsonToText(succeed))
                  resp.getSuccess(req,res,cmd,succeed)
                }).catch((err) =>{
                  logger.error(req,cmd+'|'+err)
                  logger.summary(req,cmd+'|'+error.desc_01001)
                  res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
                })
              }else{
                let err ='No contractId not add editContract UR'
                logger.info(req,cmd+'|'+err)
                resp.getIncompleteParameter(req,res,cmd,err)
              }
              break
            }
          default: // response incomplete parameter if no urType match
            userRight = 0
            let err ='user has No Right or urType not match'
            logger.info(req,cmd+'|'+err)
            resp.getIncompleteParameter(req,res,cmd,err)
            break
        }

// console.log('oooooo3oooooo'+userRight)//+'|'+util.jsonToText(req))
        //call OM => save User & UR & Workflow => async.waterfall??
        if(userRight){
          cmd = 'omGetEmployeeAndMgrByUser'
          ext.omGetEmployeeAndMgrByUser(req).then(om=>{
            logger.info(req,cmd+'|OM result:'+util.jsonToText(om))
            upUser.userName = om.managerUser
            upUser.email = om.managerEmail
            upUser.name = om.managerName
            upUser.surname = om.managerSurname

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
            })

            //Add UR & Workflow for real!!!
            cmd = 'prepareWorkflowData'
            req.body.requestData.urWorkflowList={urStatus:req.body.requestData.urStatus,
              updateBy:om.managerUser,department:om.department}
            logger.info(req,cmd+'|'+util.jsonToText(req.body.requestData.urWorkflowList))
            cmd = 'addUserEmail_Department'
            req.body.requestData.userDepartment = om.department
            req.body.requestData.userEmail = om.email
            req.body.requestData.userName = om.name
            req.body.requestData.userSurname = om.surname
            cmd = 'createUR_Workflow'
            mUR.create(req.body.requestData,{include:[{model: mUrWf, as:cst.models.urWorkflows}]})
            .then((succeed) => {
              logger.info(req,cmd+'|'+util.jsonToText(succeed))
              logger.info(req,'notifyEmail|'+cfg.email.notify)
              if(cfg.email.notify){ //Send Email?
                ext.sendEmail(om.managerEmail,succeed).then(mresult=>{
                  logger.info(req,'notifyEmail|'+util.jsonToText(mresult))
                }).catch(merr=>{
                  logger.error(req,'notifyEmail|'+util.jsonToText(merr))
                })
              }
              resp.getSuccess(req,res,cmd,succeed)
            }).catch((err) => {
              logger.error(req,cmd+'|'+err)
              logger.summary(req,cmd+'|'+error.desc_01001)
              res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
            })
          }).catch(err=>{
            // logger.error(req,cmd+'|'+util.jsonToText(err))
            resp.getOmError(req,res,cmd,err)
          })
        // }else{
        //   let err = 'Something is wrong.'
        //   logger.error(req,cmd+'|'+err)
        //   resp.getInternalError(req,res,cmd,err)
        }
      }else{
        let err ='No urType or urStatus'
        logger.info(req,cmd+'|'+err)
        resp.getIncompleteParameter(req,res,cmd,err)
      }
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
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
        if(succeed>0) resp.getSuccess(req,res,cmd)
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
      resp.getInternalError(req,res,cmd,err)
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
        resp.getSuccess(req,res,cmd)
      }).catch((err) => {
        logger.error(req,cmd+'|Error while delete UR|'+err)
        logger.summary(req,cmd+'|'+error.desc_01001)
        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
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
          resp.getIncompleteParameter(req,res,cmd)
        }
      }
      logger.info(req,cmd+'|'+util.jsonToText(jLimit))
      cmd = 'findUR'
      mUR.findAndCountAll(jLimit).then((db) => {
        cmd = 'chkUrData'
        logger.query(req,cmd+'|'+util.jsonToText(db))
        if(db.count>0) resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"userRequestList":db.rows})
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
      resp.getInternalError(req,res,cmd,err)
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
            resp.getSuccess(req,res,cmd,{"userRequestList":db})
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
        resp.getIncompleteParameter(req,res,cmd)
      }
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
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
            resp.getSuccess(req,res,cmd,db)
          }else{
            logger.info(req,cmd+'|Not Found UrWorkflow|Delete Empty List')
            let dbClone = JSON.parse(util.jsonToText(db))
            delete dbClone.urWorkflowList
            resp.getSuccess(req,res,cmd,dbClone)
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
      resp.getInternalError(req,res,cmd,err)
    }
  }

}

module.exports = userRequest