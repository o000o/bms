'use strict'

const jwt = require('jwt-simple');
const chalk = require('chalk');
// const mUser = require('../models/mUserModel');
const logger = require('../utils/logUtils');
const resp = require('../utils/respUtils');
const error = require('../config/error');
const cfg = require('../config/config');
const util = require('../utils/bizliveUtils');
const Sequelize = require('sequelize');
//const db = require('mongoose').connect(cfg.mongo.db).model('mUsers');

const auth = {

    login: (req, res) => {
try{
      console.log('=============Login=============');
      console.log('auth.login Headers : ' + chalk.blue(JSON.stringify(req.headers, undefined, 2)));
      console.log('auth.login Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      console.log('auth.login Body.requestData : ' + chalk.blue(JSON.stringify(req.body.requestData, undefined, 2)));
      logger.info('auth.login Headers : '+JSON.stringify(req.headers));
      logger.info('auth.login Body : '+JSON.stringify(req.body));
      console.log('oooooooooooooooooooooooooooooooo');

      console.log('=============CheckParamsLogin=============');
      if(checkParamsLogin(req)) {
        // Connect mySQL
        // const sequelize = new Sequelize('ooo', 'ooo', '000', {
          // dialect: 'mysql',
        //   host: '10.252.176.111',
        const sequelize = new Sequelize('BMSDB', 'bmsadmin', 'P@ssw0rd', {
          host: '10.252.163.130',
          port: 1433,

          protocol: 'tcp',
          dialect: 'mssql',
          // dialectOptions: {insecureAuth: true}, //Only need for pc connect

          pool: {
            max: 5,
            min: 0,
            idle: 10000,
          }

        });

        const User = sequelize.define('users', {
          userid: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
          userName: {type: Sequelize.STRING},//, field: 'login'},
          password: {type: Sequelize.STRING},//, field: 'passwd'},
          userType: {type: Sequelize.INTEGER, field: 'roleid'} //**Work**
          // roleid: {type:Sequelize.INTEGER, references:{model: Role, key:'roleid'}} //**Work**
        },{freezeTableName: true, timestamps: false});

        let jSearch = { userName: req.body.requestData.userName, password: req.body.requestData.password};
        console.log('jSearch typeof : ' + chalk.blue(typeof jSearch));
        console.log('jSearch : '+chalk.blue(JSON.stringify(jSearch)));

        User.findOne({where:jSearch}).then((user) => {
          console.log('user : '+chalk.blue(JSON.stringify(user)));
          if(user==null) {
            console.log('=============NULL=============');
            console.log(chalk.red('login & password mismatch]'));
            
            res.json(resp.getJsonError(error.err_bms00001,error.desc_bms00001));
          }else{
            console.log('=============NOT NULL=============');
            console.log('user typeof : ' + chalk.blue(typeof user));
            console.log('user.login : ' + chalk.blue(user.login));
            console.log('user.passwd : ' + chalk.blue(user.passwd));
            console.log('user.role : ' + chalk.blue(user.roleid));

            let json = resp.getJsonSuccess(error.err_00000,error.desc_00000,genLoginRespObj(user));
            console.log('auth.login response : ' + chalk.blue(JSON.stringify(json, undefined, 2)));
            res.json(json);

          }
        });

      }else{
        console.log(chalk.red('Summary loginUsers [Invalid Parameter]'));
        logger.error('Summary loginUsers [Invalid Parameter]');
        res.json(resp.getJsonError(error.err_biz00003,error.desc_biz00003));
      }

      }catch (err) {
        console.log(chalk.red(err));
      }

    },

    logout: (req, res) => {
      console.log('=============Logout=============');
      let tokenId = req.header('x-userTokenId');
      // let lang = req.header('x-biz-language');
      // let mobileNo = req.header('x-userMobileNo');

      console.log('tokenId : ' + chalk.blue(tokenId));
      // console.log('lang : ' + chalk.blue(lang));
      // console.log('mobileNo : ' + chalk.blue(mobileNo));

      if (tokenId) { // && mobileNo && lang) {
        res.json(resp.getJsonSuccess(error.err_00000,error.desc_00000));
      } else {
        res.json(resp.getJsonError(error.err_bms00002,error.desc_bms00002));
      }

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
  if(req.body.requestData.userName && req.body.requestData.password 
     && req.body.requestData.browser  && req.body.requestData.ipAddress 
     && req.body.requestData.logonTime){
    console.log('true');
		return true;
	}else{
    console.log('false');
		return false;
	}
}

module.exports = auth;
