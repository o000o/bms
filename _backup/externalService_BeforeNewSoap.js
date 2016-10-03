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
const cheerio = require('cheerio')
const async = require('async')

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
    let jErr = {code:error.code_03001}
    try{
      this.soapCreateClient().then(client=>{
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
              table.forEach(value => {
                om.push({orgCode:value.ORGCODE[0],orgName:value.ORGNAME[0],
                  orgDesc:value.ORGDESC[0],orgLevel:value.ORGLEVEL[0]})
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

exports.omListOrganizeLower=(req,companyId) => {
  return new Promise((resolve, reject) => {
    let jErr = {code:error.code_03001}
    try{
      this.soapCreateClient().then(client=>{
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
                  orgDesc:value.ORGDESC[0],orgLevel:value.ORGLEVEL[0]})
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
    let jErr = {code:error.code_03001}
    try{
      this.soapCreateClient().then(client=>{
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
    let jErr = {code:error.code_03001}
    try{
      this.soapCreateClient().then(client=>{
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
              om.position=table[0].POSITION[0]
              om.department=table[0].BUNAME[0]
              om.managerUser=table[0].APPROVAL_USERNAME[0]
              om.managerEmail=table[0].APPROVAL_EMAIL[0]
              om.managerName=table[0].APPROVAL_THNAME[0]
              om.managerSurname=table[0].APPROVAL_THSURNAME[0]
              om.managerPosition=table[0].APPROVAL_POSITION[0]

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

exports.omGetVpUpByUser=(req) => {
  return new Promise((resolve, reject) => {
    let jErr = {code:error.code_03001}
    try{
      let om = {}
      om.managerUser = util.getUserName(req.header('x-userTokenId')) //'duangpoj' //
      this.soapCreateClient().then(client=>{
        async.doUntil(
          (callback)=>{
            let args = {OmCode:cfg.om.OmCode,Username:om.managerUser}
            logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
            client.OM_WS_GetEmployeeAndMgrByUser(args, (err, result)=>{
              logger.debug(req,'omRawResponse|'+util.jsonToText(result))
              if(err){
                jErr.code = error.code_03004
                jErr.desc = err
                callback(jErr,om)
              }else{
                this.omParseString(result.OM_WS_GetEmployeeAndMgrByUserResult).then(table=>{
                  om.user=table[0].USERNAME[0]
                  om.email=table[0].EMAIL[0]
                  om.name=table[0].THNAME[0]
                  om.surname=table[0].THSURNAME[0]
                  om.position=table[0].POSITION[0]
                  om.department=table[0].BUNAME[0]
                  om.managerUser=table[0].APPROVAL_USERNAME[0]
                  om.managerEmail=table[0].APPROVAL_EMAIL[0]
                  om.managerName=table[0].APPROVAL_THNAME[0]
                  om.managerSurname=table[0].APPROVAL_THSURNAME[0]
                  om.managerPosition=table[0].APPROVAL_POSITION[0]

                  logger.debug(req,'parserOmResult|'+util.jsonToText(om))
                  // resolve(om)
                  if(table[0].APPROVAL_USERNAME[0]==''){
                    jErr.code = error.code_03007
                    jErr.desc = error.desc_03007
                    logger.debug(req,'checkManager|'+util.jsonToText(jErr))
                    // console.log('mmmmmmmmm'+util.jsonToText(jErr) )
                    callback(jErr,om)
                  }else callback(null, om)
                }).catch(err=>{
                  if(err.code) callback(err,om)
                  else{
                    jErr.desc = err
                    callback(jErr,om)
                  }
                })
              }
            },{timeout:cfg.om.timeout})
          },
          ()=>{
            // return ((om.managerPosition.indexOf('VP')>=0)&&(om.managerPosition.indexOf('AVP')<0)) 
            let r=false
            cfg.om.approvalPosition.some(value => {
              // console.log('ooooooooo'+value+':'+(om.managerPosition.indexOf(value)>=0) )
              if(om.managerPosition.indexOf(value)>=0 && (value!='VP' ||
               (value=='VP' && om.managerPosition.indexOf('AVP')<0&&om.managerPosition.indexOf('SVP')<0
                &&om.managerPosition.indexOf('EVP')<0&&om.managerPosition.indexOf('SEVP')<0))) r=true

              logger.debug(req,'checkPosition|'+value+':'+r)
            })
            return r
          },
          (err, n)=>{
            // 5 seconds have passed, n = 5
            // console.log(('result>>>>>>>'+util.jsonToText(err)+':'+util.jsonToText(n)))
            logger.debug(req,'returnVp|'+util.jsonToText(n)+'|'+util.jsonToText(err))
            if(err) reject(err)
            else resolve(n)
          }
        )
      }).catch(err=>{
        if(err.code) reject(err)
        else{
          jErr.desc = err
          reject(jErr)
        }
      })

      // //ooo
      // this.soapCreateClient().then(client=>{
      //   let args = {OmCode:cfg.om.OmCode,Username:util.getUserName(req.header('x-userTokenId'))}
      //   logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
      //   client.OM_WS_GetEmployeeAndMgrByUser(args, (err, result)=>{
      //     logger.debug(req,'omRawResponse|'+util.jsonToText(result))
      //     if(err){
      //       jErr.code = error.code_03004
      //       jErr.desc = err
      //       reject(jErr)
      //     }else{
      //       this.omParseString(result.OM_WS_GetEmployeeAndMgrByUserResult).then(table=>{
      //         let om = {}
      //         om.user=table[0].USERNAME[0]
      //         om.email=table[0].EMAIL[0]
      //         om.name=table[0].THNAME[0]
      //         om.surname=table[0].THSURNAME[0]
      //         om.department=table[0].BUNAME[0]
      //         om.managerUser=table[0].APPROVAL_USERNAME[0]
      //         om.managerEmail=table[0].APPROVAL_EMAIL[0]
      //         om.managerName=table[0].APPROVAL_THNAME[0]
      //         om.managerSurname=table[0].APPROVAL_THSURNAME[0]
      //         om.managerPosition=table[0].APPROVAL_POSITION[0]

      //         logger.debug(req,'parserOmResult|'+util.jsonToText(om))
      //         resolve(om)
      //       }).catch(err=>{
      //         if(err.code) reject(err)
      //         else{
      //           jErr.desc = err
      //           reject(jErr)
      //         }
      //       })
      //     }
      //   },{timeout:cfg.om.timeout})
      // }).catch(err=>{
      //   if(err.code) reject(err)
      //   else{
      //     jErr.desc = err
      //     reject(jErr)
      //   }
      // })
    }catch(err){
      jErr.desc = err
      reject(jErr)
    }
  })
}

exports.omListAllApprover=(req) => {
  return new Promise((resolve, reject) => {
    let jErr = {code:error.code_03001}
    try{
      this.soapCreateClient().then(client=>{
        let args = {OmCode:cfg.om.OmCode,Pin:'00031596',position:'50078848'}
        console.log(args)
        logger.debug(req,'prepareOMrequest|'+util.jsonToText(args))
        client.OM_WS_ListAllApprover(args, (err, result)=>{
          console.log(result)
          logger.debug(req,'omRawResponse|'+util.jsonToText(result))
          if(err){
            jErr.code = error.code_03004
            jErr.desc = err
            reject(jErr)
          }else{
            console.log(result.OM_WS_ListAllApproverResult)
            this.omParseString(result.OM_WS_ListAllApproverResult).then(table=>{
              let om = {}
              // om.user=table[0].USERNAME[0]
              // om.email=table[0].EMAIL[0]
              // om.name=table[0].THNAME[0]
              // om.surname=table[0].THSURNAME[0]
              // om.department=table[0].BUNAME[0]
              // om.managerUser=table[0].APPROVAL_USERNAME[0]
              // om.managerEmail=table[0].APPROVAL_EMAIL[0]
              // om.managerName=table[0].APPROVAL_THNAME[0]
              // om.managerSurname=table[0].APPROVAL_THSURNAME[0]

              logger.debug(req,'parserOmResult|'+util.jsonToText(om))
              resolve(table)
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
exports.sendEmail=(to,cc,ur) => {
  return new Promise((resolve, reject) => {
    let jErr = {code:error.code_04001,desc:error.desc_04001}
    try{
      // let urStatus = ur.urStatus
      // let urType = ur.urType
      let urType = cst.urType[ur.urType] ? cst.urType[ur.urType]:ur.urType
      let urStatus = cst.status[ur.urStatus] ? cst.status[ur.urStatus]:ur.urStatus
      let rentalObj = cst.rentalObj[ur.rentalObjective] ? cst.rentalObj[ur.rentalObjective]:ur.rentalObjective
      let emailOptions = cfg.email.options
      emailOptions.subject = cfg.email.subject[ur.urStatus] ? cfg.email.subject[ur.urStatus]:null

      if(util.isDataFound(cc)&&!util.isDataFound(emailOptions.cc)){
        emailOptions.cc = cc //set who to send cc email to
        jErr.cc = emailOptions.cc
      }
      if(!util.isDataFound(emailOptions.to)) emailOptions.to = to //set who to send email to
      logger.debug(null,'notifyEmail|To:'+emailOptions.to)
      jErr.to = emailOptions.to
      //replace content variable [createReadStream] **Have lost body problem when send second mail.
      // emailOptions.html = emailOptions.html
      //   .pipe(replaceStream('{$urId}',ur.urId))
      //   .pipe(replaceStream('{$urType}',urType))
      //   .pipe(replaceStream('{$rentalObj}',rentalObj))
      //   .pipe(replaceStream('{$urDate}',mCfg.correctTime(ur.urDate)))
      //   .pipe(replaceStream('{$urStatus}',urStatus))
      //   .pipe(replaceStream('{$urBy}',ur.userName+' '+ur.userSurname))

      //replace content variable [readFileSync]
      let $document = cheerio.load(emailOptions.html)
      $document('td.urId').text(ur.urId)
      $document('td.urType').text(urType)
      $document('td.rentalObj').text(rentalObj)
      $document('td.urDate').text(mCfg.correctTime(ur.urDate))
      $document('td.urStatus').text(urStatus)
      $document('td.urBy').text(ur.userName+' '+ur.userSurname)

      emailOptions.html = $document.html()
      logger.debug(null,'notifyEmail|HTML:'+emailOptions.html)

      // send mail with defined transport object
      if(emailOptions.html && emailOptions.to && emailOptions.subject){
        cfg.email.transporter.sendMail(emailOptions,(err, info)=>{
          if(err){
            jErr.msg=err
            logger.debug(null,'notifyEmail|Failed|'+err)
          }else{
            jErr.msg=info//.response
            jErr.code=error.code_04000
            jErr.desc=error.desc_04000
            logger.debug(null,'notifyEmail|Sent:'+util.jsonToText(info))//.response)
          }
          resolve(jErr)
        })
      }else{
        jErr.msg='Incomplete Email Data'
        logger.debug(null,'notifyEmail|'+jErr.msg)
        reject(jErr)
      }
    }catch(err){
      logger.debug(null,'notifyEmail|catch|'+err)
      jErr.msg = err
      reject(jErr)
    }
  })
}