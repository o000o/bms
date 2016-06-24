'use strict'

// const jwt = require('jwt-simple');
const chalk = require('chalk');
const logger = require('../utils/logUtils');
const resp = require('../utils/respUtils');
const error = require('../config/error');
// const cfg = require('../config/config');
const util = require('../utils/bmsUtils');
const mUser = require('../models/mUser');
// const mRole = require('../db/role');

const auth = {

  login: (req, res) => {
    let cmd = 'checkParamsLogin';

try{
    // console.log('=============Login=============');
    // console.log('auth.login Headers : ' + chalk.blue(JSON.stringify(req.headers, undefined, 2)));
    // console.log('auth.login Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
    // console.log('auth.login Body.requestData : ' + chalk.blue(JSON.stringify(req.body.requestData, undefined, 2)));
    // logger.info('auth.login Headers : '+JSON.stringify(req.headers));
    // logger.info('auth.login Body : '+JSON.stringify(req.body));
    // console.log('oooooooooooooooooooooooooooooooo');

    // console.log('=============CheckParamsLogin=============');
    if(checkParamsLogin(req)) {
      logger.info(req,cmd+'|Pass');
      // const jWhere = { login: req.body.requestData.userName, passwd: req.body.requestData.password};
      const jWhere = { userName: req.body.requestData.userName, password: req.body.requestData.password};
      // console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
      // console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));
      cmd = 'chkUserAuth';
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      mUser.findOne({where:jWhere}).then((user) => {
        // console.log('user : '+chalk.blue(JSON.stringify(user)));
        if(util.chkDataFound(user)) {
          logger.info(req,cmd+'|Found User|'+JSON.stringify(user));
          return resp.getSuccess(req,res,cmd,genLoginRespObj(user));

          // console.log('=============NOT NULL=============');
          // console.log('user typeof : ' + chalk.blue(typeof user));
          // console.log('user.login : ' + chalk.blue(user.login));
          // console.log('user.passwd : ' + chalk.blue(user.passwd));
          // console.log('user.role : ' + chalk.blue(user.roleid));

          // let json = resp.getJsonSuccess(error.code_00000,error.desc_00000,genLoginRespObj(user));
          // console.log('auth.login response : ' + chalk.blue(JSON.stringify(json, undefined, 2)));
          // res.json(json);
        }else{
          logger.info(req,cmd+'|Not Found User');
          // logger.summary(req,cmd+'|Not Found User');
          return resp.getInvalidUser(req,res,cmd);
          // console.log('=============NULL=============');
          // console.log(chalk.red('login & password mismatch]'));
          
          // res.json(resp.getJsonError(error.code_00001,error.desc_00001));
        }
      }).catch((err) => {
        logger.error(req,cmd+'|Error while check return data from DB|'+err);
        // logger.error(req,cmd+'|'+err);
        // logger.summary(req,cmd+'|Error after query DB');
        return resp.getInvalidUser(req,res,cmd,err);
        // console.log('Error : ' + chalk.red(err));
        // res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });

    }else{
      logger.info(req,cmd+'|Not Pass');
      return resp.getIncompleteParameter(req,res,cmd);
      // logger.summary(req,cmd+'Invalid Parameter');
      // res.json(resp.getJsonError(error.code_00005,error.desc_00005));
    }


}catch (err) {
  logger.error(req,cmd+'|'+err);
  // logger.summary(req,cmd+'Undefined Internal Error');
  return resp.getInternalError(req,res,cmd,err);
  // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
}

},

  logout: (req, res) => {
      let cmd = 'logout';
      logger.info(req,cmd);
      // logger.summary(req,cmd+'|Logout Success');
      resp.getSuccess(req,res,cmd);
      // res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));

      // let tokenId = req.header('x-userTokenId');
      // // let lang = req.header('x-biz-language');
      // // let mobileNo = req.header('x-userMobileNo');

      // console.log('tokenId : ' + chalk.blue(tokenId));
      // // console.log('lang : ' + chalk.blue(lang));
      // // console.log('mobileNo : ' + chalk.blue(mobileNo));

      // if (tokenId) { // && mobileNo && lang) {
      //   res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
      // } else {
      //   res.json(resp.getJsonError(error.code_00002,error.desc_00002));
      // }
  }
}

function genLoginRespObj(data){
  //check userType
  // if(data.userType == 'CSOD' || data.userType == 'AISADMIN'){
  return {
    // login: data.login,
    // userType: data.userType,
    // mobileType: 'Postpaid', //Not use can hard code
    // userTokenId: genToken(data._id, data.userName, data.password),
    userTokenId: util.getToken(data),
    userType: data.userType
    // contactQuota: data.contactQuota, //not in user DB, don't know what it is.
    // userMobileNo: data.mobileNo,
    // operatorType: 'ais',
    // loginFlag: 'N'
  };
  // }
}

function checkParamsLogin(req) {
  try{
    if(req.body.requestData.userName && req.body.requestData.password 
       && req.body.requestData.browser  && req.body.requestData.ipAddress 
       && req.body.requestData.logonTime){
      // console.log('true');
      return true;
    }else{
      // console.log('false');
      return false;
    }
  }catch (err) {
    logger.error(req,'checkParamsLogin|'+err);
    // console.log(chalk.red(err));
    return false;
  }
}

module.exports = auth;
