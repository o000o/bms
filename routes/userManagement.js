'use strict'
const logger = require('../utils/logUtils')
const async = require('async')
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const jsUtil = require('util')
const error = require('../config/error')
const cst = require('../config/constant')
const mUser = require('../models/mUser')

const userManagement = {
    add: (req, res) => {
        let cmd = 'AddUserManagement'
        try {
            let jWhere = {
                userName: req.body.requestData.userName,
            }
            mUser.findOrCreate({
                where: jWhere,
                defaults: req.body.requestData,
            }).spread((db, succeed) => {
                if (succeed) {
                    logger.info(req, cmd + '|Data:' + JSON.stringify(req.body.requestData) + '|Create complete')
                    return resp.getSuccess(req, res, cmd, db)
                } else { //vendor existed
                    logger.info(req, cmd + '|Error:' + error.desc_01004)
                    logger.summary(req, cmd + '|Error:' + error.desc_01004)
                    return res.json(resp.getJsonError(error.code_01004, error.desc_01004, db))
                }
            }).catch((err) => {
                logger.error(req, cmd + '|Data:' + JSON.stringify(req.body.requestData) + '|Error:' + err)
                logger.summary(req, cmd + '|' + error.desc_01001)
                return res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    edit: (req, res) => {
        let cmd = 'UpdateUserManagement'
        try {
            let requestData = JSON.parse(JSON.stringify(req.body.requestData));
            logger.info(req,cmd + '|ReqData:' + requestData)
            if (!util.isDataFound(req.body.requestData.userName)) {
              let err = 'userName can not null'
              logger.error(req, cmd + '|Error:' + err)
              logger.summary(req, cmd + '|' + error.code_00005)
              return res.json(resp.getJsonError(error.code_00005, error.desc_00005, err))
            }

            mUser.update(requestData, {
                  where: {
                      userName: requestData.userName
                  }
            }).then((succeed) => {
                logger.info(req, 'UpdateUserManagement|Data:' + JSON.stringify(requestData) + '|Update complete')
                return resp.getSuccess(req,res,cmd)
            }).catch((err) => {
                logger.error(req, 'UpdateUserManagement|Data:' + JSON.stringify(requestData) + '|Error:' + err)
                logger.summary(req,cmd+'|'+error.desc_01001)
                return res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    delete: (req, res) => {
        let cmd = 'DeleteUserManagement'
        try {
          logger.info(req, cmd + '|Data:\"userName\": \"' + req.params.userName )
            mUser.destroy({
                where: {
                    userName: req.params.userName
                }
            }).then((succeed) => {
              if (succeed > 0) {
                logger.info(req, cmd + '|Data:\"userName\": \"' + req.params.userName + '\"|Deleted ' + succeed + ' records')
                return resp.getSuccess(req, res, cmd)
              } else {
                let err = 'Not Found userName ' + req.params.userName
                logger.summary(req, cmd + '|Data:\"userName\": \"' + req.params.userName + '\"|' + err)
                return res.json(resp.getJsonError(error.code_01003, error.desc_01003, err))
              }
            }).catch((err) => {
                logger.error(req, cmd + '|Data:\"userName\": \"' + req.params.userName + '\"|Error:' + err)
                logger.summary(req, cmd + '|' + error.desc_01001)
                return res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    queryByCriteria: (req, res) => {
        let cmd = 'QueryUserManagement'
        try {
            cmd = 'ChkPaging'
            const jLimit = {
                offset: null,
                limit: null
            }
            if (Object.keys(req.query).length != 0) {
                cmd = 'ChkPageCount'
                if (util.isDigit(req.query.page) && util.isDigit(req.query.count)) {
                    jLimit.offset = (req.query.page - 1) * req.query.count
                    jLimit.limit = parseInt(req.query.count)
                    logger.info(req, cmd + '|PageCount:' + JSON.stringify(jLimit))
                } else {
                    logger.error(req, cmd + '|Error:page or count is wrong format')
                    return resp.getIncompleteParameter(req, res, cmd)
                }
            }
            let jWhere = {}
            cmd = 'GenCriteria'
            logger.info(req, cmd + '|userManagementCriteria:' + util.isDataFound(req.body.requestData.userManagementCriteria))
            if (util.isDataFound(req.body.requestData.userManagementCriteria)) {
                jWhere = req.body.requestData.userManagementCriteria
            }

            //add paging in to jwhere

            jWhere.offset = jLimit.offset
            jWhere.limit = jLimit.limit
            logger.info(req, cmd + '|AllCriteria:' + jsUtil.inspect(jWhere, {
                showHidden: false,
                depth: null
            }))

            cmd = 'FindUserManagement'
            mUser.findAndCountAll(jWhere).then((db) => {
                cmd = 'ChkUsermanagement'
                logger.query(req, cmd + '|' + JSON.stringify(db))
                if (db.count > 0) {
                    return resp.getSuccess(req, res, cmd, {
                        "totalRecord": db.count,
                        "userManagementList": db.rows
                    })
                } else {
                    logger.summary(req, cmd + '|Not Found userManagementList')
                    return res.json(resp.getJsonError(error.code_01003, error.desc_01003, db))
                }
            }).catch((err) => {
                logger.error(req, cmd + '|Error:' + err)
                logger.summary(req, cmd + '|' + error.desc_01002)
                return res.json(resp.getJsonError(error.code_01002, error.desc_01002, err))
            })

        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    }
}
module.exports = userManagement
