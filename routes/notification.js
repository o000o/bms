'use strict'
// const response = require('../response/broadcastResponse.js');
const chalk = require('chalk');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const logger = require('../utils/logUtils');
const error = require('../config/error');
const con = require('../config/constant');
// const mContract = require('../models/mContract');
const mUR = require('../models/mUR');
const mUrWf = require('../models/mUrWorkFlow');
const cfg = require('../config/config');
const mCfg = require('../config/modelCfg');
const async = require("async");

const notification = {

/***************************************
SELECT COUNT(*),'ooo',ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND (ur.UR_STATUS='DM_APPROVAL' OR (urw.UPDATE_BY='admin' and urw.UR_STATUS='ADMIN_ACCEPT'))
GROUP BY ur.UR_STATUS;


##My request
SELECT COUNT(*),ur_status
FROM user_request
WHERE ur_by ='user1'
GROUP BY ur_status;

#User Request
#DM
SELECT COUNT(*),ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND urw.UPDATE_BY='dm' AND urw.UR_STATUS='W_DM_APPROVAL'
GROUP BY ur.UR_STATUS;

#ADMIN
SELECT COUNT(*),ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND (ur.UR_STATUS='DM_APPROVAL' 
OR (urw.UPDATE_BY='admin' and urw.UR_STATUS='ADMIN_ACCEPT'))
GROUP BY ur.UR_STATUS;
#ADMIN  with complete
SELECT COUNT(*),ur.ur_by,ur.ur_status,urw.UPDATE_BY
FROM user_request ur,ur_workflow urw
WHERE ur.UR_ID = urw.UR_ID AND (ur.UR_STATUS='DM_APPROVAL' 
OR (urw.UPDATE_BY='admin' and (urw.UR_STATUS='ADMIN_ACCEPT' or urw.UR_STATUS='complete')))
GROUP BY ur.UR_STATUS;
***************************************/

  ur: (req, res) => { //raw query
    let cmd = 'notification';
    try{
      logger.info(req,cmd+'|token:'+req.header('x-userTokenId'));
      cmd = 'extractToken';
      const decoded = util.extractToken(req.header('x-userTokenId'));
      logger.info(req,cmd+'|decoded:'+JSON.stringify(decoded));

      let rawQs = [];
      rawQs.push("SELECT '" + con.myUr + "' as 'groupName', ur_status as status, COUNT(*) as total "
      + "FROM user_request WHERE ur_by = '" + decoded.userName + "' GROUP BY ur_status;");

      if(con.admin.indexOf(decoded.userType)>=0){
        rawQs.push("SELECT '" + con.Ur + "' as 'groupName',ur.ur_status as status, COUNT(*) as total "
        + "FROM user_request ur,ur_workflow urw "
        + "WHERE ur.UR_ID = urw.UR_ID AND (ur.UR_STATUS='" + con.dmApproved + "' OR (urw.UPDATE_BY= '" + decoded.userName
        + "' AND (urw.UR_STATUS='" + con.adminAccept + "' or urw.UR_STATUS='" + con.complete + "'))) GROUP BY ur.UR_STATUS;");
      }else if(con.dm.indexOf(decoded.userType)>=0){ 
        rawQs.push("SELECT '" + con.Ur + "' as 'groupName',ur.ur_status as status, COUNT(*) as total "
        + "FROM user_request ur,ur_workflow urw "
        + "WHERE ur.UR_ID = urw.UR_ID AND urw.UPDATE_BY= '" + decoded.userName 
        + "' AND urw.UR_STATUS= '" + con.dmApproved + "' GROUP BY ur.UR_STATUS;");
      }

      cmd = 'countUR';
      let resData = [];
      async.each(rawQs,
        // 2nd param is the function that each item is passed to
        (rawQ, callback) => {
          // Call an asynchronous function, often a save() to DB
          mCfg.sequelize.query(rawQ, {type:mCfg.sequelize.QueryTypes.SELECT}
          ).then((dbs) => {
            logger.info(req,cmd+'|SQL:'+rawQ+'|DBs:'+ JSON.stringify(dbs));
            if(util.isDataFound(dbs)) dbs.forEach((value) => {resData.push(value);});
            
            callback();
            // return resp.getSuccess(req,res,cmd,dbs);  
          }).catch((err) => {
            logger.error(req,cmd+'|Error while count UR|'+err);
            callback(err);
            // return resp.getInternalError(req,res,cmd,err);;
          })
              
        },
        // 3rd param is the function to call when everything's done
        (err) => {
          // All tasks are done now
          cmd = 'returnCount';
          if(err) logger.error(req,cmd+'|Error when finish count DB|'+err);
          // logger.info(req,cmd+'|notification:'+ JSON.stringify(resData));
          return resp.getSuccess(req,res,cmd,resData);
        }
      );

    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  }
};



//   ur: (req, res) => { //sequelize query
//     let cmd = 'urNotification';
//     try{
//       logger.info(req,cmd+'|token:'+req.header('x-userTokenId'));
//       cmd = 'extractToken';
//       const decoded = util.extractToken(req.header('x-userTokenId'));
//       logger.info(req,cmd+'|decoded:'+JSON.stringify(decoded));

// /**********count myUr*************/
//       // cmd = 'countMyUR';
//       // mUR.findAll({where:{urBy:decoded.userName},group: ['urStatus'],
//       //   attributes: ['urStatus',
//       //     [mCfg.sequelize.fn('count', mCfg.sequelize.col('*')),'count']]
//       // }).then((dbs) => {
//       //   logger.info(req,cmd+'|DBs:'+ JSON.stringify(dbs));
//       //   cmd = 'chkDB';
//       //   let dbClone = JSON.parse(JSON.stringify(dbs));
//       //   if(util.isDataFound(dbs)){
//       //     let i = 1;
//       //     cmd = 'addGroup';
//       //     dbClone.forEach((value) => {
//       //       value.group=con.myUr;
//       //     });

//       //   }
//       //   logger.info(req,cmd+'|DBs with group:'+ JSON.stringify(dbClone));
// // switch(expression) {
// //     case n:
// //         code block
// //         break;
// //     case n:
// //         code block
// //         break;
// //     default:
// //         default code block
// // } 
//       //   return resp.getSuccess(req,res,cmd,dbClone);
//       // }).catch((err) => {
//       //   logger.error(req,cmd+'|Error when findAll mUR|'+err);
//       //   return resp.getInternalError(req,res,cmd,err);
//       //   // console.log('Error : ' + chalk.red(err));
//       //   // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
//       // })


// /****************dmUR*************/
//       // cmd = 'countdmUR';
//       // mUR.findAll({group: ['urStatus'],
//       //   attributes: ['urStatus',
//       //     [mCfg.sequelize.fn('count', mCfg.sequelize.col('*')),'count']],
//       //   include:[{model:mUrWf, as: 'urWorkflowList',attributes: [],
//       //     where: {updateBy:decoded.userName, urStatus:con.wDmApproval}}]
//       // }).then((dbs) => {
//       //   logger.info(req,cmd+'|DBs:'+ JSON.stringify(dbs));
//       //   cmd = 'chkDB';
//       //   let dbClone = JSON.parse(JSON.stringify(dbs));
//       //   if(util.isDataFound(dbs)){
//       //     let i = 1;
//       //     cmd = 'addGroup';
//       //     dbClone.forEach((value) => {
//       //       value.group=con.Ur;
//       //     });

//       //   }
//       //   logger.info(req,cmd+'|DBs with group:'+ JSON.stringify(dbClone));

//       //   return resp.getSuccess(req,res,cmd,dbClone);
//       // }).catch((err) => {
//       //   logger.error(req,cmd+'|Error when findAll mUR|'+err);
//       //   return resp.getInternalError(req,res,cmd,err);
//       //   // console.log('Error : ' + chalk.red(err));
//       //   // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
//       // })


// /****************adminUR1*************/
//       // cmd = 'countAdminUR';
//       // mUR.findAll({group: ['urStatus'],
//       //   attributes: ['urStatus',
//       //     [mCfg.sequelize.fn('count', mCfg.sequelize.col('*')),'count']],
//       //   include:[{model:mUrWf, as: 'urWorkflowList',attributes: [],
//       //     // where: {$or: [{updateBy:decoded.userName, urStatus:con.adminAccept},mCfg.sequelize.col('user_request'.'urStatus'):{$like: con.dmApproved}]}}]
//       //     where: {updateBy:decoded.userName, $or:[{urStatus:con.adminAccept},{urStatus:con.complete}]}
//       //   }]
//       // }).then((dbs) => {
//       //   logger.info(req,cmd+'|DBs:'+ JSON.stringify(dbs));
//       //   cmd = 'chkDB';
//       //   let dbClone = JSON.parse(JSON.stringify(dbs));
//       //   if(util.isDataFound(dbs)){
//       //     let i = 1;
//       //     cmd = 'addGroup';
//       //     dbClone.forEach((value) => {
//       //       value.group=con.Ur;
//       //     });
//       //     mUR.count({where:{urStatus:con.dmApproved}}).then((dmApproved) => {
//       //       dbClone.push({'urStatus':'DM_APPROVAL','count':dmApproved,'group':con.Ur});
//       //       logger.info(req,cmd+'|DBs with group:'+ JSON.stringify(dbClone));
//       //       return resp.getSuccess(req,res,cmd,dbClone);
//       //     }).catch((err) => {
//       //       logger.error(req,cmd+'|Error when count dmApproved mUR|'+err);
//       //       return resp.getInternalError(req,res,cmd,err);
//       //     })
//       //   }else{
//       //     mUR.count({where:{urStatus:con.dmApproved}}).then((dmApproved) => {
//       //       dbClone.push({'urStatus':'DM_APPROVAL','count':dmApproved,'group':con.Ur});
//       //       logger.info(req,cmd+'|DBs with group:'+ JSON.stringify(dbClone));
//       //       return resp.getSuccess(req,res,cmd,dbClone);
//       //     }).catch((err) => {
//       //       logger.error(req,cmd+'|Error when count dmApproved mUR|'+err);
//       //       return resp.getInternalError(req,res,cmd,err);
//       //     })
//       //   }
//       // }).catch((err) => {
//       //   logger.error(req,cmd+'|Error when findAll mUR|'+err);
//       //   return resp.getInternalError(req,res,cmd,err);
//       //   // console.log('Error : ' + chalk.red(err));
//       //   // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
//       // })

// /****************adminUR*************/
//       cmd = 'countAdminUR';
//       mUR.findAll({group: ['urStatus'],
//         attributes: ['urStatus',
//           [mCfg.sequelize.fn('count', mCfg.sequelize.col('*')),'count']],
//         include:[{model:mUrWf, as: 'urWorkflowList',attributes: [],
//           // where: {$or: [{updateBy:decoded.userName, urStatus:con.adminAccept},mCfg.sequelize.col('user_request'.'urStatus'):{$like: con.dmApproved}]}}]
//           where: {updateBy:decoded.userName, $or:[{urStatus:con.adminAccept},{urStatus:con.complete}]}
//         }]

//       }).then((dbs) => {
//         logger.info(req,cmd+'|DBs:'+ JSON.stringify(dbs));
//         cmd = 'chkDB';
//         let dbClone = JSON.parse(JSON.stringify(dbs));
//         if(util.isDataFound(dbs)){
//           let i = 1;
//           cmd = 'addGroup';
//           dbClone.forEach((value) => {
//             value.group=con.Ur;
//           });
//           mUR.count({where:{urStatus:con.dmApproved}}).then((dmApproved) => {
//             dbClone.push({'urStatus':'DM_APPROVAL','count':dmApproved,'group':con.Ur});
//             logger.info(req,cmd+'|DBs with group:'+ JSON.stringify(dbClone));
//             return resp.getSuccess(req,res,cmd,dbClone);
//           }).catch((err) => {
//             logger.error(req,cmd+'|Error when count dmApproved mUR|'+err);
//             return resp.getInternalError(req,res,cmd,err);
//           })
//         }else{
//           mUR.count({where:{urStatus:con.dmApproved}}).then((dmApproved) => {
//             dbClone.push({'urStatus':'DM_APPROVAL','count':dmApproved,'group':con.Ur});
//             logger.info(req,cmd+'|DBs with group:'+ JSON.stringify(dbClone));
//             return resp.getSuccess(req,res,cmd,dbClone);
//           }).catch((err) => {
//             logger.error(req,cmd+'|Error when count dmApproved mUR|'+err);
//             return resp.getInternalError(req,res,cmd,err);
//           })
//         }
//       }).catch((err) => {
//         logger.error(req,cmd+'|Error when findAll mUR|'+err);
//         return resp.getInternalError(req,res,cmd,err);
//         // console.log('Error : ' + chalk.red(err));
//         // res.json(resp.getJsonError(error.code_01001,error.desc_01001));
//       })

//     }catch(err){
//       logger.error(req,cmd+'|'+err);
//       return resp.getInternalError(req,res,cmd,err);
//       // console.log('Error : ' + chalk.red(err));
//       // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
//     }
//   }
// };

module.exports = notification;