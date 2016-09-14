'use strict'

const Sequelize = require('sequelize')
const mUser = require('../models/mUser')
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const logger = require('../utils/logUtils')
const error = require('../config/error')

module.exports = (req, res, next) => {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next()

  // var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token']
  // var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-userTokenId']
  // var token =  req.headers('x-userTokenId')
  let flagT = 0
  let cmd = 'chkRequestData'
  try {
    if(req.body && (req.body.requestData == undefined)&&(req.method=="POST"||req.method=="PUT")){
      let err ='Incomplete requestData'
      logger.info(req,cmd+'|'+err)
      return resp.getIncompleteParameter(req,res,cmd,err)
    }
    cmd = 'chkToken'
    let token = req.header('x-userTokenId')
    logger.info(req,cmd+'|Token:'+token)
    if (token) {
      flagT = 1
      const decoded = util.extractToken(token)
      cmd = 'checkExpire'
      logger.info(req,cmd+'|ExpireTime:'+decoded.exp+'|NOW:'+Date.now())
      if (decoded.exp <= Date.now()) {
        //Token Expired
        logger.summary(req,cmd+'|Token Expired')
        res.status(401)
        res.json(resp.getJsonError(error.code_00006, error.desc_00006))
        return
        // return resp.getTokenExpire(res)
      }
      next()
      // // Authorize the user to see if s/he can access our resources
      // const jWhere = {userName: decoded.userName}
      // cmd = 'chkUserValidate'
      // logger.info(req,cmd+'|where:'+JSON.stringify(jWhere))

      // mUser.findOne({where:jWhere}).then((user) => {
      //   if(util.isDataFound(user)){
      //     logger.info(req,cmd+'|Found User')
      //     next() // To move to next middleware    
      //   }else{
      //     //Wrong Token lead to wrong user
      //     logger.info(req,cmd+'|Not Found User')
      //     return resp.getInvalidToken(req,res,cmd)
      //   }
      // }).catch((err) => {
      //   logger.error(req,cmd+'|Error while check return data from DB|'+err)
      //   //Wrong Token lead to wrong user
      //   return resp.getInvalidToken(req,res,cmd,err)
      // })
    } else {
      if(req.method == "OPTIONS" || req.url == "/bms/login/user"){
        logger.info(req,cmd+'|No need Token')
        next() // To move to next middleware
      }else{
        return resp.getInvalidToken(req,res,cmd)
      }
    }
  } catch (err) {
    logger.error(req,'validateRequest|'+err)
    if (flagT) return resp.getInvalidToken(req,res,cmd,err)
    else return resp.getInternalError(req,res,'validateRequest|',err)
  }

}
