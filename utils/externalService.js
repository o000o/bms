'use strict'

const soap = require('soap-ntlm-2')
const parser = require('xml2js').Parser()
const cfg = require('../config/config')
const util = require('./bmsUtils')
const logger = require('./logUtils')
const error = require('../config/error')
const cst = require('../config/constant')
const replaceStream = require('replacestream')
const mCfg = require('../config/modelCfg')

exports.callOm=(req,cb) => {
  //Response format => {code:error.code_03001,desc:error.desc_03001,msg:err}
  let jErr = {code:error.code_03001,desc:error.desc_03001}
	try{
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
    soap.createClient(cfg.om.wsdlPath, cfg.om.options, (err, client, body)=>{
      if (err) {
        jErr.msg=err
        cb(jErr, null)
      }else{
        client.setSecurity(new soap.NtlmSecurity(cfg.om.options.wsdl_options))
        let args = {OmCode:cfg.om.OmCode,Username:util.getUserName(req.header('x-userTokenId'))}
        logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
        client.OM_WS_GetEmployeeAndMgrByUser(args, (err, result)=>{
          logger.debug(req,'omRawResponse|'+util.jsonToText(result))
          if(err){
            jErr.msg=err
            cb(jErr, null)
          }else{
            parser.parseString(result.OM_WS_GetEmployeeAndMgrByUserResult, (err, dataJsonStr)=>{
              logger.debug(req,'parserOmResult|'+util.jsonToText(dataJsonStr))
              if(err){
                jErr.msg=err
                cb(jErr, null)
              }else{
                if(dataJsonStr.NewDataSet.Permission[0].MsgDetail[0]=='Success' && util.isDataFound(dataJsonStr.NewDataSet.Table)){
                  let om = {}
                  om.user=dataJsonStr.NewDataSet.Table[0].USERNAME[0]
                  om.email=dataJsonStr.NewDataSet.Table[0].EMAIL[0]
                  om.name=dataJsonStr.NewDataSet.Table[0].THNAME[0]
                  om.surname=dataJsonStr.NewDataSet.Table[0].THSURNAME[0]
                  om.department=dataJsonStr.NewDataSet.Table[0].BUNAME[0]
                  om.managerUser=dataJsonStr.NewDataSet.Table[0].APPROVAL_USERNAME[0]
                  om.managerEmail=dataJsonStr.NewDataSet.Table[0].APPROVAL_EMAIL[0]
                  om.managerName=dataJsonStr.NewDataSet.Table[0].APPROVAL_THNAME[0]
                  om.managerSurname=dataJsonStr.NewDataSet.Table[0].APPROVAL_THSURNAME[0]
                  cb(null,om)
                }else{
                  jErr.code = error.code_03002
                  jErr.desc = error.desc_03002
                  err='No OM table found'
                  jErr.msg=err
                  cb(jErr, null)
                }
              }
            })
          }
        },{timeout:cfg.om.timeout})
      }
    })
	}catch(err){
    jErr.msg=err
    cb(jErr, null)
	}
}

/****Test Email****
URL: https://10.252.160.41/owa
user: kittilau
pass: Ais@09Jun
Email: 'kittilau@corp.ais900dev.org'
*******************/
exports.sendEmail=(to,ur,cb) => {
  //Response format => {code:error.code_03001,desc:error.desc_03001,msg:err}
  let jErr = {code:error.code_04001,desc:error.desc_04001}
  try{
    let urStatus = ur.urStatus
    let urType = ur.urType
    switch(ur.urStatus){
      case cst.status.wDmApproval: //email Manager
        cfg.email.options.subject = cfg.email.subject.wManagerApprove
        urStatus = 'รอการอนุมัติ'
        break
      case cst.status.dmApproved: //email Admin
        cfg.email.options.subject = cfg.email.subject.wAdminApprove
        urStatus = 'รอดำเนินการต่อ'
        break
      case cst.status.dmRejected: //email User
        cfg.email.options.subject = cfg.email.subject.managerReject
        urStatus = 'ไม่ผ่านการอนุมัติ'
        break
      case cst.status.adminRejected: //email User & Manager
        cfg.email.options.subject = cfg.email.subject.adminReject
        urStatus = 'ไม่ผ่านการอนุมัติ'
        break
      case cst.status.complete: //email User & Manager
        cfg.email.options.subject = cfg.email.subject.urComplete
        urStatus = 'ดำเนินการสำเร็จแล้ว'
        break
    }

    switch(ur.urType){
      case cst.urType.editContract: //email Manager
        urType = 'ขอแก้ไขสัญญา'
        break
      case cst.urType.renewContract: //email Admin
        urType = 'ขอต่อสัญญา'
        break
      case cst.urType.cancelContract: //email User
        urType = 'ขอยกเลิกสัญญา'
        break
      case cst.urType.rental: //email User & Manager
        urType = 'ขอใช้สถานที่'
        break
      case cst.urType.move: //email User & Manager
        urType = 'ขอเปลี่ยนสถานที่'
        break
    }
    if(!util.isDataFound(cfg.email.options.to)) cfg.email.options.to = to //set who to send email to
    //replace content variable
    cfg.email.options.html = cfg.email.options.html
      .pipe(replaceStream('{$urId}',ur.urId))
      .pipe(replaceStream('{$urType}',urType))
      .pipe(replaceStream('{$urDate}',mCfg.correctTime(ur.urDate)))
      .pipe(replaceStream('{$urStatus}',urStatus))
      .pipe(replaceStream('{$urBy}',ur.userName+' '+ur.userSurname))

    // send mail with defined transport object
    cfg.email.transporter.sendMail(cfg.email.options,(err, info)=>{
      if(err){
        jErr.msg=err
        logger.debug(null,'notifyEmail|Failed|'+err)
      }else{
        jErr.msg=info.response
        jErr.code=error.code_04000
        jErr.desc=error.desc_04000
      }
      logger.debug(null,'notifyEmail|Sent:'+info.response)
      cb(jErr)
    })
  }catch(err){
    jErr.msg=err
    cb(jErr)
  }
}