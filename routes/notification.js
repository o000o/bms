'use strict'

const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const logger = require('../utils/logUtils')
const error = require('../config/error')
const cst = require('../config/constant')
const mUR = require('../models/mUR')
const mUrWf = require('../models/mUrWorkFlow')
const cfg = require('../config/config')
const mCfg = require('../config/modelCfg')
const async = require('async')

const notification = {

/***************************************
SELECT COUNT(*),'ooo',ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND (ur.UR_STATUS='DM_APPROVAL' OR (urw.UPDATE_BY='admin' and urw.UR_STATUS='ADMIN_ACCEPT'))
GROUP BY ur.UR_STATUS


##My request
SELECT COUNT(*),ur_status
FROM user_request
WHERE ur_by ='user1'
GROUP BY ur_status

#User Request
#DM
SELECT COUNT(*),ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND urw.UPDATE_BY='dm' AND urw.UR_STATUS='W_DM_APPROVAL'
GROUP BY ur.UR_STATUS

#ADMIN
SELECT COUNT(*),ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND (ur.UR_STATUS='DM_APPROVAL' 
OR (urw.UPDATE_BY='admin' and urw.UR_STATUS='ADMIN_ACCEPT'))
GROUP BY ur.UR_STATUS
#ADMIN  with complete
SELECT COUNT(*),ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND (ur.UR_STATUS='DM_APPROVAL' 
OR (urw.UPDATE_BY='admin' and (urw.UR_STATUS='ADMIN_ACCEPT' or urw.UR_STATUS='complete')))
GROUP BY ur.UR_STATUS
***************************************/

  ur: (req, res) => { //raw query
    let cmd = 'notification'
    try{
      let isVp=false
      logger.info(req,cmd+'|token:'+req.header('x-userTokenId'))
      cmd = 'extractToken'
      const decoded = util.extractToken(req.header('x-userTokenId'))
      logger.info(req,cmd+'|decoded:'+util.jsonToText(decoded))

      let rawQs = []
      rawQs.push("SELECT '" + cst.notification.myUr + "' as \"groupName\", ur_status as status, COUNT(*) as total "
      + "FROM user_request WHERE ur_by='" + decoded.userName + "' GROUP BY ur_status;")

      if(cst.userGroup.admin.indexOf(decoded.userType)>=0){ //admin
        rawQs.push("SELECT '" + cst.notification.Ur + "' as \"groupName\",ur.ur_status as status, COUNT(*) as total "
        + "FROM user_request ur "
        + "WHERE ur.UR_STATUS='" + cst.status.vpApproved + "' GROUP BY ur.UR_STATUS;")
        rawQs.push("SELECT '" + cst.notification.Ur + "' as \"groupName\",ur.ur_status as status, COUNT(*) as total "
        + "FROM user_request ur,ur_workflow urw "
        + "WHERE (ur.UR_ID = urw.UR_ID AND ur.ur_status = urw.ur_status) AND (urw.UPDATE_BY='" + decoded.userName
        + "' AND (urw.UR_STATUS='" + cst.status.adminAccept + "' or urw.UR_STATUS='" + cst.status.complete + "')) GROUP BY ur.UR_STATUS;")
        rawQs.push("SELECT DISTINCT '" + cst.notification.contractExpireHeader + "' as \"groupName\",'"
        + cst.notification.contractExpire + "' as status, COUNT(*) as total "
        + "FROM contract ct "
        + "WHERE ct.contract_status='ACTIVE' AND DATEDIFF(day,GETDATE(),ct.end_date)>=0 AND DATEDIFF(day,GETDATE(),ct.end_date)<="
        + cfg.notification.contractExpire + ";")
      }else if(cst.userGroup.manager.indexOf(decoded.userType)>=0){ //DM
        rawQs.push("SELECT '" + cst.notification.Ur + "' as \"groupName\",ur.ur_status as status, COUNT(*) as total "
        + "FROM user_request ur,ur_workflow urw "
        + "WHERE ur.UR_ID = urw.UR_ID AND urw.UPDATE_BY='" + decoded.userName 
        + "' AND urw.UR_STATUS='" + cst.status.wDmApproval + "' GROUP BY ur.UR_STATUS;")
      }else if(cst.userGroup.vp.indexOf(decoded.userType)>=0){ //VP
        rawQs.push("SELECT '" + cst.notification.Ur + "' as \"groupName\",ur.ur_status as status, COUNT(*) as total "
        + "FROM user_request ur,ur_workflow urw "
        + "WHERE (ur.UR_ID = urw.UR_ID AND urw.UPDATE_BY='" + decoded.userName 
        + "' AND (urw.UR_STATUS='" + cst.status.vpApproved 
        + "' OR (ur.UR_STATUS='" + cst.status.wVpApproval + "' OR ur.UR_STATUS='" + cst.status.wDmApproval
        + "'))) GROUP BY ur.UR_STATUS;")
        isVp=true
      }

      cmd = 'countUR'
      let resData = []
      async.each(rawQs,
        // 2nd param is the function that each item is passed to
        (rawQ, callback) => {
          // Call an asynchronous function, often a save() to DB
          logger.debug(req,cmd+'|SQL:'+rawQ)
          mCfg.sequelize.query(rawQ, {type:mCfg.sequelize.QueryTypes.SELECT})
          .then((dbs) => {
            logger.info(req,cmd+'|SQL:'+rawQ+'|DBs:'+ util.jsonToText(dbs))
            if(util.isDataFound(dbs)){
              let vpTmp = 0
              let valueTmp = {
                "groupName": "User Request",
                "status": cst.status.wVpApproval,
                "total": 0
              }
              dbs.forEach((value) => {
                if(isVp){
                  if(value.groupName=='User Request'&&(value.status==cst.status.wVpApproval || value.status==cst.status.wDmApproval)) valueTmp.total+=value.total
                  else resData.push(value)
                }else resData.push(value)
              })
        
              if(valueTmp.total){
                resData.push(valueTmp)
              }              
            }
            callback()
          }).catch((err) => {
            logger.error(req,cmd+'|Error while count UR|'+err)
            callback()
          })
        },
        // 3rd param is the function to call when everything's done
        (err) => {
          // All tasks are done now
          cmd = 'returnCount'
          // if(err) logger.error(req,cmd+'|Error when finish count DB|'+err)
          // logger.info(req,cmd+'|notification:'+ util.jsonToText(resData))
          return resp.getSuccess(req,res,cmd,resData)
        }
      )
    }catch(err){
      logger.error(req,cmd+'|'+err)
      return resp.getInternalError(req,res,cmd,err)
    }
  }
}

module.exports = notification