'use strict'

const jwt = require('jwt-simple');
const chalk = require('chalk');
const Sequelize = require('sequelize');
const mUser = require('../models/mUser');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const logger = require('../utils/logUtils');
const error = require('../config/error');

module.exports = (req, res, next) => {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  // var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  // var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-userTokenId'];
  // var token =  req.headers('x-userTokenId');
  let flagT = 0;
  let cmd = 'chkToken';
  try {
    let token = req.header('x-userTokenId');
    // console.log('Token : '+chalk.blue(token));
    logger.info(req,cmd+'|Token:'+token);
    // if (token || key) {
    if (token) {
      flagT = 1;
      const decoded = jwt.decode(token, require('../config/secret.js')());
      cmd = 'checkExpire';
      logger.info(req,cmd+'|ExpireTime:'+decoded.exp+'|NOW:'+Date.now());
      if (decoded.exp <= Date.now()) {
        //Token Expired
        logger.summary(req,cmd+'|Token Expired');
        res.status(401);
        res.json(resp.getJsonError(error.code_00006, error.desc_00006));
        return;
        // return resp.getTokenExpire(res);
      }

      // Authorize the user to see if s/he can access our resources
      const jWhere = {userName: decoded.userName};
      cmd = 'chkUser';
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
        // console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));
      mUser.findOne({where:jWhere}).then((user) => {
        if(util.chkDataFound(user)){
          logger.info(req,cmd+'|Found User');
          next(); // To move to next middleware    
        }else{
          logger.summary(req,cmd+'|Not Found User');
          return resp.getInvalidUser(res); //Invalid User
        }
      }).catch((err) => {
        // console.log('Error : ' + chalk.red(err));
        logger.error(req,cmd+'|'+err);
        logger.summary(req,cmd+'|Error after query DB');
        //Invalid User
        return resp.getInvalidUser(res,err);
      });
    } else {
      if(req.method == "OPTIONS" || req.url == "/bms/login/user"){
        logger.info(req,cmd+'|No need Token');
        // console.log(chalk.blue('Goto auth'));
        next(); // To move to next middleware
      }else{
        // console.log(chalk.blue('Invalid Token'));
        // logger.info(req,'chkToken|False Token');
        // logger.summary(req,'chkToken|Invalid Token');
        return resp.getInvalidToken(req,res,cmd);
      }
    }
  } catch (err) {
    // console.log('catch err : '+chalk.red(err.message));
    // console.log('flag Token : '+chalk.blue(flagT));
    logger.error(req,'validateRequest|'+err);
    // logger.summary(req,'validateRequest|Undefined Internal Error');
    if (flagT)  resp.getInvalidToken(req,res,cmd);
    else return resp.getInternalError(req,res,'validateRequest|',err);
  }

};
