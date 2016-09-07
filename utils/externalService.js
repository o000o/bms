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
const resp = require('./respUtils')
const chalk = require('chalk')

exports.soapCreateClient=() => {
  return new Promise((resolve, reject) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
    soap.createClient(cfg.om.wsdlPath, cfg.om.options, (err, client, body)=>{
      if(err){
        reject({code:error.code_03003,desc:err}) // failure
      }else{
        client.setSecurity(new soap.NtlmSecurity(cfg.om.options.wsdl_options))
        resolve(client)
      }
    })
  })
}

exports.omParseString=(omResult) => {
  return new Promise((resolve, reject) => {
    try{
      logger.debug(null,'omParseString|'+util.jsonToText(omResult))
      parser.parseString(omResult, (err, dataJsonStr)=>{
        if(err){
          logger.debug(null,'omParseString|'+util.jsonToText(err))
          reject({code:error.code_03005,desc:err}) // failure
        }else{
          logger.debug(null,'omParseString|'+util.jsonToText(dataJsonStr))
          if(dataJsonStr.NewDataSet.Permission[0].MsgDetail[0]=='Success' && util.isDataFound(dataJsonStr.NewDataSet.Table)){
            resolve(dataJsonStr.NewDataSet.Table)
          }else if(dataJsonStr.NewDataSet.Permission[0].MsgDetail[0]=='Success'){
            reject({code:error.code_03002,desc:dataJsonStr})
          }else{
            reject({code:error.code_03006,desc:dataJsonStr.NewDataSet.Permission[0].MsgDetail[0]}) 
          }
        }
      })
    }catch(err){
      logger.debug(null,'omParseStringCatch|'+util.jsonToText(err))
      reject({code:error.code_03005,desc:err})
    }
  })
}

exports.omSearchOrgInfo=(req,params) => {
  return new Promise((resolve, reject) => {
    try{
      this.soapCreateClient().then(client=>{
        let jErr = {code:error.code_03001}
        let args = {OmCode:cfg.om.OmCode,CompanyCode:params.companyCode,OrgDescOrOrgCode:params.orgDesc}
        logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
        client.OM_WS_SearchOrgInfo(args, (err, result)=>{
          logger.debug(req,'omRawResponse|'+util.jsonToText(result))
          if(err){
            jErr.code = error.code_03004
            jErr.desc = err
            reject(jErr)
          }else{
            this.omParseString(result.OM_WS_SearchOrgInfoResult).then(table=>{
              let om = []

              logger.debug(req,'parserOmResult|'+util.jsonToText(om))
              resolve(om)
            }).catch(err=>{
              if(err.code) reject(err)
              else{
                jErr.desc = err
                reject(jErr)
              }
            })
          }
        },{timeout:cfg.om.timeout})
      }).catch(err=>{
        if(err.code) reject(err)
        else{
          jErr.desc = err
          reject(jErr)
        }
      })
    }catch(err){
      jErr.desc = err
      reject(jErr)
    }
  })
}

exports.omListOrganizeLower=(req,companyId) => {
  return new Promise((resolve, reject) => {
    try{
      this.soapCreateClient().then(client=>{
        let jErr = {code:error.code_03001}
        let args = {OmCode:cfg.om.OmCode,OrgCode:companyId,Level:''}
        logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
        client.OM_WS_ListOrganizeLower(args, (err, result)=>{
          logger.debug(req,'omRawResponse|'+util.jsonToText(result))
          if(err){
            jErr.code = error.code_03004
            jErr.desc = err
            reject(jErr)
          }else{
            this.omParseString(result.OM_WS_ListOrganizeLowerResult).then(table=>{
              let om = []
              table.forEach(value => {
                om.push({orgCode:value.ORGCODE[0],orgName:value.ORGNAME[0],
                  orgDesc:value.ORGDESC[0],orgLevel:value.ORGLEVEL[0],
                  orgHigherOrg:value.HIGHERORG[0],higherOrgName:value.HIGHERORGNAME[0],
                  orgHigherOrgDesc:value.HIGHERORGDESC[0],higherOrgLevel:value.HIGHERORGLEVEL[0],
                  displayLevel:value.DISPLAYLEVEL[0]})
              })
              logger.debug(req,'parserOmResult|'+util.jsonToText(om))
              resolve(om)
            }).catch(err=>{
              if(err.code) reject(err)
              else{
                jErr.desc = err
                reject(jErr)
              }
            })
          }
        },{timeout:cfg.om.timeout})
      }).catch(err=>{
        if(err.code) reject(err)
        else{
          jErr.desc = err
          reject(jErr)
        }
      })
    }catch(err){
      jErr.desc = err
      reject(jErr)
    }
  })
}

exports.omListCompanyInWireless=(req) => {
  return new Promise((resolve, reject) => {
    try{
      this.soapCreateClient().then(client=>{
        let jErr = {code:error.code_03001}
        let args = {OmCode:cfg.om.OmCode}
        logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
        client.OM_WS_ListCompanyInWireless(args, (err, result)=>{
          logger.debug(req,'omRawResponse|'+util.jsonToText(result))
          if(err){
            jErr.code = error.code_03004
            jErr.desc = err
            reject(jErr)
          }else{
            this.omParseString(result.OM_WS_ListCompanyInWirelessResult).then(table=>{
              let om = []
              table.forEach(value => {
                om.push({objectId:value.OBJECTID[0],companyCode:value.COMPANYCODE[0],
                  descriptionEn:value.DESCRIPTION_EN[0],descriptionTh:value.DESCRIPTION_TH[0]})
              })
              logger.debug(req,'parserOmResult|'+util.jsonToText(om))
              resolve(om)
            }).catch(err=>{
              if(err.code) reject(err)
              else{
                jErr.desc = err
                reject(jErr)
              }
            })
          }
        },{timeout:cfg.om.timeout})
      }).catch(err=>{
        if(err.code) reject(err)
        else{
          jErr.desc = err
          reject(jErr)
        }
      })
    }catch(err){
      jErr.desc = err
      reject(jErr)
    }
  })
}

exports.omGetEmployeeAndMgrByUser=(req) => {
  return new Promise((resolve, reject) => {
    try{
      this.soapCreateClient().then(client=>{
        let jErr = {code:error.code_03001}
        let args = {OmCode:cfg.om.OmCode,Username:util.getUserName(req.header('x-userTokenId'))}
        logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
        client.OM_WS_GetEmployeeAndMgrByUser(args, (err, result)=>{
          logger.debug(req,'omRawResponse|'+util.jsonToText(result))
          if(err){
            jErr.code = error.code_03004
            jErr.desc = err
            reject(jErr)
          }else{
            this.omParseString(result.OM_WS_GetEmployeeAndMgrByUserResult).then(table=>{
              let om = {}
              om.user=table[0].USERNAME[0]
              om.email=table[0].EMAIL[0]
              om.name=table[0].THNAME[0]
              om.surname=table[0].THSURNAME[0]
              om.department=table[0].BUNAME[0]
              om.managerUser=table[0].APPROVAL_USERNAME[0]
              om.managerEmail=table[0].APPROVAL_EMAIL[0]
              om.managerName=table[0].APPROVAL_THNAME[0]
              om.managerSurname=table[0].APPROVAL_THSURNAME[0]

              logger.debug(req,'parserOmResult|'+util.jsonToText(om))
              resolve(om)
            }).catch(err=>{
              if(err.code) reject(err)
              else{
                jErr.desc = err
                reject(jErr)
              }
            })
          }
        },{timeout:cfg.om.timeout})
      }).catch(err=>{
        if(err.code) reject(err)
        else{
          jErr.desc = err
          reject(jErr)
        }
      })
    }catch(err){
      jErr.desc = err
      reject(jErr)
    }
  })
}

/****Test Email****
URL: https://10.252.160.41/owa
user: kittilau
pass: Ais@09Jun
Email: 'kittilau@corp.ais900dev.org'
*******************/
exports.sendEmail=(to,ur) => {
  return new Promise((resolve, reject) => {
    try{
      let jErr = {code:error.code_04001,desc:error.desc_04001}
      let urStatus = ur.urStatus
      let urType = ur.urType
      switch(ur.urStatus){
        case cst.status.wDmApproval: //email Manager
          cfg.email.options.subject = cfg.email.subject.wManagerApprove
          urStatus = cst.status.wDmApprovalTh
          break
        case cst.status.dmApproved: //email Admin
          cfg.email.options.subject = cfg.email.subject.wAdminApprove
          urStatus = cst.status.dmApprovedTh
          break
        case cst.status.dmRejected: //email User
          cfg.email.options.subject = cfg.email.subject.managerReject
          urStatus = cst.status.dmRejectedTh
          break
        case cst.status.adminRejected: //email User & Manager
          cfg.email.options.subject = cfg.email.subject.adminReject
          urStatus = cst.status.adminRejectedTh
          break
        case cst.status.complete: //email User & Manager
          cfg.email.options.subject = cfg.email.subject.urComplete
          urStatus = cst.status.completeTh
          break
        default:
          cfg.email.options.subject = cfg.email.subject.default
          break
      }

      switch(ur.urType){
        case cst.urType.editContract: //email Manager
          urType = cst.urType.editContractTh
          break
        case cst.urType.renewContract: //email Admin
          urType = cst.urType.renewContractTh
          break
        case cst.urType.cancelContract: //email User
          urType = cst.urType.cancelContractTh
          break
        case cst.urType.rental: //email User & Manager
          urType = cst.urType.rentalTh
          break
        case cst.urType.move: //email User & Manager
          urType = cst.urType.moveTh
          break
      }

      if(!util.isDataFound(cfg.email.options.to)) cfg.email.options.to = to //set who to send email to
      logger.debug(null,'notifyEmail|To:'+cfg.email.options.to)
      jErr.to=cfg.email.options.to
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
        resolve(jErr)
      })
    }catch(err){
      jErr.msg = err
      reject(jErr)
    }
  })
}

// exports.sendEmail=(to,ur,cb) => {
//   //Response format => {code:error.code_03001,desc:error.desc_03001,msg:err}
//   let jErr = {code:error.code_04001,desc:error.desc_04001}
//   try{
//     let urStatus = ur.urStatus
//     let urType = ur.urType
//     switch(ur.urStatus){
//       case cst.status.wDmApproval: //email Manager
//         cfg.email.options.subject = cfg.email.subject.wManagerApprove
//         urStatus = cst.status.wDmApprovalTh
//         break
//       case cst.status.dmApproved: //email Admin
//         cfg.email.options.subject = cfg.email.subject.wAdminApprove
//         urStatus = cst.status.dmApprovedTh
//         break
//       case cst.status.dmRejected: //email User
//         cfg.email.options.subject = cfg.email.subject.managerReject
//         urStatus = cst.status.dmRejectedTh
//         break
//       case cst.status.adminRejected: //email User & Manager
//         cfg.email.options.subject = cfg.email.subject.adminReject
//         urStatus = cst.status.adminRejectedTh
//         break
//       case cst.status.complete: //email User & Manager
//         cfg.email.options.subject = cfg.email.subject.urComplete
//         urStatus = cst.status.completeTh
//         break
//       default:
//         cfg.email.options.subject = cfg.email.subject.default
//         break
//     }

//     switch(ur.urType){
//       case cst.urType.editContract: //email Manager
//         urType = cst.urType.editContractTh
//         break
//       case cst.urType.renewContract: //email Admin
//         urType = cst.urType.renewContractTh
//         break
//       case cst.urType.cancelContract: //email User
//         urType = cst.urType.cancelContractTh
//         break
//       case cst.urType.rental: //email User & Manager
//         urType = cst.urType.rentalTh
//         break
//       case cst.urType.move: //email User & Manager
//         urType = cst.urType.moveTh
//         break
//     }

//     if(!util.isDataFound(cfg.email.options.to)) cfg.email.options.to = to //set who to send email to
//     logger.debug(null,'notifyEmail|To:'+cfg.email.options.to)
//     jErr.to=cfg.email.options.to
//     //replace content variable
//     cfg.email.options.html = cfg.email.options.html
//       .pipe(replaceStream('{$urId}',ur.urId))
//       .pipe(replaceStream('{$urType}',urType))
//       .pipe(replaceStream('{$urDate}',mCfg.correctTime(ur.urDate)))
//       .pipe(replaceStream('{$urStatus}',urStatus))
//       .pipe(replaceStream('{$urBy}',ur.userName+' '+ur.userSurname))

//     // send mail with defined transport object
//     cfg.email.transporter.sendMail(cfg.email.options,(err, info)=>{
//       if(err){
//         jErr.msg=err
//         logger.debug(null,'notifyEmail|Failed|'+err)
//       }else{
//         jErr.msg=info.response
//         jErr.code=error.code_04000
//         jErr.desc=error.desc_04000
//       }
//       logger.debug(null,'notifyEmail|Sent:'+info.response)
//       cb(jErr)
//     })
//   }catch(err){
//     jErr.msg=err
//     cb(jErr)
//   }
// }