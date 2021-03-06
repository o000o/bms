'use strict'
const chalk = require('chalk')
const util = require('./utils/bmsUtils')
const jwt = require('jwt-simple')
const cfg = require('./config/config')
const async = require('async')
const ext = require('./utils/externalService')
const mUrWf = require('./models/mUrWorkFlow')
const mUser = require('./models/mUser')
const cst = require('./config/constant')

try{
    
let count = 0
async.doUntil(
    
    (callback)=>{
        count++
        setTimeout(function() {
            callback(null, count)
        }, 1000)
    },
    ()=>{ return count < 5 },
    (err, n)=>{
        // 5 seconds have passed, n = 5
        console.log(chalk.green(err+':'+n))
    }
)


/********************
            let wcmd = 'findWorkFlow'
            let to = null
            let cc = null
                    mUrWf.findAll({group:['update_by','ur_status'],attributes:['updateBy','urStatus'],
                      where:{urId:'UR20160907019',$or:[{urStatus:'DM_APPROVAL'},{urStatus:'VP_APPROVAL'}]}
                    }).then((updateBy) => {
                      console.log(wcmd+'|'+util.jsonToText(updateBy))
                      if(util.isDataFound(updateBy)){
                        let where = {$or:[]}
                        updateBy.forEach(value => {
                            where.$or.push({userName:value.updateBy})
                        })
                        wcmd = 'findManagerEmail'
                        console.log(wcmd+'|'+util.jsonToText(where))
                        mUser.findAll({where:where,attributes:['email','userType'],group:['username','email','user_type']})
                        .then((email) => {
                            wcmd = 'genEmail'
                          console.log(wcmd+'|'+util.jsonToText(email))
                            email.forEach(value => {
                                if(cst.userGroup.manager.indexOf(value.userType)>=0) to=to+value.email+';'
                                if(cst.userGroup.vp.indexOf(value.userType)>=0) cc=cc+value.email+';'
                            })
                            console.log(wcmd+'|To:'+to+'|Cc:'+cc)
                        }).catch((werr) => { // can't find manager send email to user only
                          console.log(wcmd+'|'+werr)

                        })
                      }else{
                        console.log(wcmd+'|Manager Not Found')
                      }
                    }).catch((werr) => { // can't find manager send email to user only
                      console.log(wcmd+'|'+werr)
                    })
**************/

//             let constant={}
//             constant.urType = {}
// constant.urType.editContract = 'EDIT_CONTRACT'
// constant.urType.renewContract = 'RENEW_CONTRACT'
// constant.urType.cancelContract = 'CANCEL_CONTRACT'
// constant.urType.rental = 'RENTAL'
// constant.urType.move = 'MOVEMENT'
// constant.urType[constant.urType.editContract] = 'ขอแก้ไขสัญญา'
// constant.urType[constant.urType.renewContract] = 'ขอต่อสัญญา'
// constant.urType[constant.urType.cancelContract] = 'ขอยกเลิกสัญญา'
// constant.urType[constant.urType.rental] = 'ขอใช้สถานที่'
// constant.urType[constant.urType.move] = 'ขอเปลี่ยนสถานที่'

// console.log(constant)



// var p1 = Promise.resolve(3);
// var p2 = 1337;
// var p3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, "foo");
// }); 

// Promise.all([p1, p2, p3]).then(values => { 
//   console.log(values); // [3, 1337, "foo"] 
// });


//             let req1 = null
//             let req2 = null
//             // req1.header('x-userTokenId') = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6IndhdGNoYW1lIiwidXNlclR5cGUiOiJNQU5BR0VSIiwiZXhwIjoxNDcxODU4MjgzNzgzfQ.zZVxdcPr7D96FA8GZCy83aRWxF8uUOAUh2nATQ4W7Vw'
//             // req2.header('x-userTokenId') = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNpcmlwb2tvIiwidXNlclR5cGUiOiJVU0VSIiwiZXhwIjoxNDY4Mzk5MzU2Njk5fQ.hlzy-CPQEZ7ggTtesw5OFcLYQTXuhmG9KrWe9nRno54'
// // ext.callOm(0,(results)=>{console.log(chalk.green(results))})
// // Promise.all([
//     // asyncFunc1(),
//     // asyncFunc2(),
// // ext.soapCreateClient(),
// ext.omListCompanyInWireless()

// // ])
// .then((results) => {
//     console.log(chalk.green(util.jsonToText(results)))
//     // break
// })
// .catch(err => {
//     // Receives first rejection among the Promises
//     console.log(chalk.red(err))
//     // break
// });


            // async.waterfall([
            //   (callback)=>{ //query UR
            //     // code a
            //     callback(null, 'a', 'b')
            //   },
            //   (arg1, arg2, callback)=>{ //gen To
            //     // arg1 is equals 'a' and arg2 is 'b'
            //     // Code c
            //     callback(null, 'wwwww{$userEmail}bbbb')
            //   },
            //   (arg1, callback)=>{ //Send Email
            //     // arg1 is 'c'
            //     // code d
            //     if(arg1){ 
            //         arg1 = arg1.replace('{$userEmail}', "ooonaja")
            //         callback(null, arg1);
            //     }else callback('error',null)
            //   }], (err, result)=>{
            //    // result is 'd'    
            //    console.log(chalk.green(err+':'+result))
            //   }
            // )

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
