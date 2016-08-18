'use strict'

const express     = require('express')
const interceptor = require('express-interceptor')
// const cheerio     = require('cheerio')
const logger = require('../utils/logUtils')
const util = require('../utils/bmsUtils')
const cfg = require('../config/config')

module.exports = interceptor((req, res) => {
  try {
    return {
      
      isInterceptable:()=>{
        // return /text\/html/.test(res.get('Content-Type')) // Only HTML responses will be intercepted 
        // return true //intercepted all
        
        // application/json responses and have "x-userTokenId" in header will be intercepted
        // return ((req.header('Content-Type')=='application/json')&&(req.header('x-userTokenId')))

        // Only have "x-userTokenId" in header will be intercepted
        return (req.header('x-userTokenId'))
      },
      
      intercept:(body, send) => {
        // var $document = cheerio.load(body)
        // $document('body').append('<p>From interceptor!</p>') // Appends a paragraph at the end of the response body 
        // send($document)

        let newBody = JSON.parse(body)
        if (cfg.interceptRespCode.indexOf(newBody.responseStatus.responseCode)>=0) {
            const decoded = util.extractToken(req.header('x-userTokenId'))
            logger.debug(req,'interceptor|Token Decoded:'+util.jsonToText(decoded))
            let dateObj = new Date()
            let expire = dateObj.setMinutes(dateObj.getMinutes() + cfg.renewTokenTime)
            logger.debug(req,'interceptor|Token Expire:'+(decoded.exp <= expire))
            if(decoded.exp <= expire){
              newBody.responseStatus.userTokenId=util.getToken(decoded)
              logger.info(req,'interceptor|New Token:'+newBody.responseStatus.userTokenId)
            }
        }
        send(JSON.stringify(newBody))
      },
      
      afterSend:(oldBody, newBody) => {
        // console.log('***afterSend***')
        logger.debug(req,'interceptor|afterSend|newBody:'+newBody+'|oldBody:'+oldBody)
      }
    }
  } catch (err) { //never get in here
    logger.error(req,'interceptor|'+err)
    return resp.getInternalError(req,res,'interceptor|',err)
  }

})
