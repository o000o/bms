'use strict'

const soap = require('soap-ntlm-2')
const parser = require('xml2js').Parser()
const cfg = require('../config/config')
const util = require('./bmsUtils')
const logger = require('./logUtils')
const error = require('../config/error')

exports.callOm=(req, cb) => {
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
            // cmd = 'chkOmResult'
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
                  om.name=dataJsonStr.NewDataSet.Table[0].ENNAME[0]
                  om.surname=dataJsonStr.NewDataSet.Table[0].ENSURNAME[0]
                  om.managerUser=dataJsonStr.NewDataSet.Table[0].APPROVAL_USERNAME[0]
                  om.managerEmail=dataJsonStr.NewDataSet.Table[0].APPROVAL_EMAIL[0]
                  om.managerName=dataJsonStr.NewDataSet.Table[0].APPROVAL_ENNAME[0]
                  om.managerSurname=dataJsonStr.NewDataSet.Table[0].APPROVAL_ENSURNAME[0]
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