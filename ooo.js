'use strict'
const chalk = require('chalk')
const util = require('./utils/bmsUtils')
const jwt = require('jwt-simple')
const cfg = require('./config/config')

        try{
console.log(chalk.green(util.jsonToText(cfg.email.options.html)))


        // let newBody = {}
        //     // const decoded = jwt.decode(
        //     //       'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNpcmlwb2tvIiwidXNlclR5cGUiOiJVU0VSIiwiZXhwIjoxNDcwODA4MDQxMjM0fQ.7jPL4ltbA_da66GlYUDswqFJQKJz1uihys5ssGz3ds',
        //     //        require('./config/secret.js')())
        //     const decoded = util.extractToken(
        //           'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNpcmlwb2tvIiwidXNlclR5cGUiOiJVU0VSIiwiZXhwIjoxNDcwODA4MDQxMjM0fQ.7jPL4ltbA_da66GlYUDswqFJQKJz1uihys5ssGz3ds'
        //            )

        //       newBody.responseStatus.userTokenId=util.getToken(decoded)
        //       console.log(chalk.green('interceptor|New Token:'+newBody.responseStatus.userTokenId))
            


            // var body = 002
            // if(body) console.log('T')
            // else console.log('F')
            // var body = {}
            // if(util.isDataFound(body.requestData.contractPaymentList)) console.log('T')
            // else console.log('F')
            // // var buildingId = 1
            // // var tbuildingId = util.isDataFound(buildingId) ? buildingId : null
            // // console.log(tbuildingId)
            // var regDigit=/[0-9]/
            // var resObj=10
            // if(resObj) console.log('T')
            // else console.log('F')
            // console.log(resObj.length)
            // if(resObj==null || resObj=='undefined' || resObj==''){
            //     console.log('first false')
            // }else{
            //     if(resObj.length) console.log('length true')
            //     else {
            //         if (JSON.stringify(resObj).length>2) console.log('stringify length>2 true')
            //         else if(/[0-9]/.test(resObj)) console.log('regDigit true')
            //         else if(/[a-z],[A-Z]/.test(resObj)) console.log('alphabet true')
            //         else console.log('stringify length>2 false')
            //     }
            // }
        }catch(err){
            // logger.error('bmsUtils|idDataFound|'+err)
            // return false
            console.log(chalk.red('catch false:' + err))
            // if (JSON.stringify(resObj).length>2) console.log('true')
            // else console.log('stringify length>2 false')
        }
