'use strict'
const logger = require('../utils/logUtils')
const async = require('async')
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const jsUtil = require('util')
const error = require('../config/error')
const cst = require('../config/constant')
const mMovement = require('../models/mMovement')
const mBuildingArea = require('../models/mBuildingArea')

exports.validateData = (req) => {
//    let ret = JSON.parse('{\"status\": ' +false +',\"err\":\"\"}')
    let  ret= {"status": false, "err":""}
    if (!util.isDataFound(req.body.requestData.assignLocationList)) {
      ret= {"status": true, "err":"assignLocationList not Found"}
    } else {
      req.body.requestData.assignLocationList.forEach(function(value){
        if (value.urId == null || value.builgingAreaId == null || value.createBy == null ||
          value.movementType == null || value.movementDate ==null || value.builgingAreaRemain == null) {
          ret= {"status": true, "err":"Madatory parameter Missing"}
        }
      })
    }

    return ret
}

const assignLocation = {

    add: (req, res) => {
        let cmd = 'addAssignLocation'
        try {

          logger.info(req,cmd + '|validateData:' + JSON.stringify(this.validateData(req)) + '|status:' + this.validateData(req).status)
          if(this.validateData(req).status) {
              cmd = 'validateData'
              logger.error(req, cmd + "|status:" + this.validateData(req).status+ '|Error:' + this.validateData(req).err)
              logger.summary(req, cmd + '|' + error.desc_00005)
              return res.json(resp.getJsonError(error.code_00005, error.desc_00005, this.validateData(req).err))
          }

          mMovement.bulkCreate(req.body.requestData.assignLocationList, {validate:true})
          .then((succeed) => {
            logger.info(req,cmd+'|succeed:'+JSON.stringify(succeed)+ '|Create complete');
            cmd = 'updateBuildingArea'
            let edit = {}
            let asyncTasks = [] // Array to hold async tasks
          //  edit.contractId = req.body.requestData.contractId
            edit.countPush = 0
            edit.countSuccess = 0
            edit.countError = 0
            //edit.editResults = []
            //delete req.body.requestData.builgingAreaRemain
            //logger.info(req,+'|delete:'+JSON.stringify(req.body.requestData))
            req.body.requestData.assignLocationList.forEach((item)=>{ // Loop through some items
              edit.countPush = edit.countPush + 1
              asyncTasks.push((callback)=>{
                cmd = 'pushUpdateBuildingAreaTask'
                let tmWhere = {buildingAreaId:item.builgingAreaId}
                mBuildingArea.update({
                    builgingAreaRemain: item.builgingAreaRemain
                }, {
                    where: tmWhere
                }).then((succeed) => {
                    edit.countSuccess = edit.countSuccess + 1
                    logger.info(req,cmd + '|Data:{\"builgingAreaId\":\"' + item.builgingAreaId +'|\"builgingAreaRemain\":\"' + item.builgingAreaRemain + '\"}|Update complete ' + succeed + ' row')
                    callback(null, succeed)
                }).catch((err) => {
                    edit.countError = edit.countError + 1
                    logger.error(req,cmd + '|Data:{\"builgingAreaId\": \"' + item.builgingAreaId +'|\"builgingAreaRemain\":\"' + item.builgingAreaRemain + '\"}|Error:' + err)
                    callback(err, null)
                })
              } )
            })
            //cmd = 'RunParallelTask'
            async.parallel(asyncTasks, (err, result) => {
                if (err) {
                  cmd = 'RunParallelTask'
                    logger.summary(req, cmd + '|' + error.desc_01001)
                    res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
                } else {
                  cmd = 'RunParallelTask'
                  if(edit.countError > 0) {
                    logger.error(req,cmd + '|Data:{\"CountPush:\"' +edit.countPush +',\"PushSuccuss\":' + edit.countSuccess + ',\"PushError\":' + edit.countError+'}')
                    logger.summary(req, cmd + '|' + error.desc_01001)
                    res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
                  } else {
                    resp.getSuccess(req, res, cmd)
                  }
                }
            })

          })
          .catch((err) => {
            logger.error(req,cmd+'|Error:'+err);
            logger.summary(req,cmd+'|'+error.desc_01001);
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
          })

        } catch (err) {
            logger.error(req, cmd + '|Error:' + err)
            return resp.getInternalError(req, res, cmd, err)
        }

    }
}
module.exports = assignLocation
