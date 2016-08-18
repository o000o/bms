'use strict'
const logger = require('../utils/logUtils')
const async = require('async')
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const jsUtil = require('util')
const error = require('../config/error')
const cst = require('../config/constant')
const mVendorProfile = require('../models/mVendorProfile')
const mVendorContact = require('../models/mVendorProfileContact')
const vendorProfile = {
    add: (req, res) => {
        let cmd = 'AddVendorProfile'
        try {
            let jWhere = {
                vendorType: req.body.requestData.vendorType,
                vendorName1: req.body.requestData.vendorName1
            }
            mVendorProfile.findOrCreate({
                where: jWhere,
                defaults: req.body.requestData,
                include: [{
                    model: mVendorContact,
                    as: 'vendorContactList'
                }]
            }).spread((db, succeed) => {
                if (succeed) {
                    logger.info(req, cmd + '|Data:' + JSON.stringify(req.body.requestData) + '|Create complete')
                    return resp.getSuccess(req, res, cmd, db)
                } else { //vendor existed
                    logger.error(req, cmd + '|Error:' + error.desc_01004)
                    logger.summary(req, cmd + '|Error:' + error.desc_01004)
                    res.json(resp.getJsonError(error.code_01004, error.desc_01004, db))
                }
            }).catch((err) => {
                logger.error(req, cmd + '|Data:' + JSON.stringify(req.body.requestData) + '|Error:' + err)
                logger.summary(req, cmd + '|' + error.desc_01001)
                res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    edit: (req, res) => {
        let cmd = 'UpdateVendorProfile'
        try {
            let asyncTasks = []
            let requestData = JSON.parse(JSON.stringify(req.body.requestData));
            if (util.isDataFound(requestData.vendorContactList)) {
                delete requestData.vendorContactList
            }
            asyncTasks.push((callback) => {
                if (requestData.vendorId) {
                    mVendorProfile.update(requestData, {
                        where: {
                            vendorId: requestData.vendorId
                        }
                    }).then((succeed) => {
                        if (succeed > 0) {
                            logger.info(req, 'UpdateVendorProfile|Data:' + JSON.stringify(requestData) + '|Update complete')
                            callback(null, succeed)
                        } else {
                            logger.error(req, 'UpdateVendorProfile|Data:' + JSON.stringify(requestData) + '|Error:Not found Vendor Profile')
                            callback('Not found Vendor Profile', null)
                        }
                    }).catch((err) => {
                        logger.error(req, 'UpdateVendorProfile|Data:' + JSON.stringify(requestData) + '|Error:' + err)
                        callback(err, null)
                    })
                } else {
                    logger.error(req, 'UpdateVendorProfile|Data:' + JSON.stringify(requestData) + '|Error:' + error.desc_00005)
                    callback(error.desc_00005, null)
                }
            })
            logger.info(req, 'UpdateVendorProfile|ReqData:' + JSON.stringify(req.body.requestData))
            if (util.isDataFound(req.body.requestData.vendorContactList)) {
                req.body.requestData.vendorContactList.forEach((vendorContact) => {
                    if (vendorContact.editAction == "E") {
                        vendorContact.vendorId = req.body.requestData.vendorId
                        delete vendorContact.editAction
                        asyncTasks.push((callback) => {
                            mVendorContact.update(vendorContact, {
                                where: {
                                    vendorContactId: vendorContact.vendorContactId
                                }
                            }).then((succeed) => {
                                if (succeed > 0) {
                                    logger.info(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Update complete')
                                    callback(null, succeed)
                                } else {
                                    logger.error(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Error:Not found Vendor Profile Contact')
                                    callback('Not found Vendor Profile Contact', null)
                                }
                            }).catch((err) => {
                                logger.error(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Error:' + err)
                                callback(err, null)
                            })
                        })
                    } else if (vendorContact.editAction == "A") {
                        vendorContact.vendorId = req.body.requestData.vendorId
                        delete vendorContact.editAction
                        asyncTasks.push((callback) => {
                            mVendorContact.create(vendorContact).then((succeed) => {
                                logger.info(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Create complete')
                                callback(null, succeed)
                            }).catch((err) => {
                                logger.error(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Error:' + err)
                                callback(err, null)
                            })
                        })
                    } else if (vendorContact.editAction == "D") {
                        delete vendorContact.editAction
                        logger.info(req, cmd + '|where:' + JSON.stringify(JWhere))
                        asyncTasks.push((callback) => {
                            if (vendorContact.vendorContactId) {
                                mVendorContact.destroy({
                                    where: {
                                        vendorContactId: vendorContact.vendorContactId
                                    }
                                }).then((succeed) => {
                                    if (succeed > 0) {
                                        logger.info(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Deleted ' + succeed + ' records')
                                        callback(null, succeed)
                                    } else {
                                        logger.error(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Error:Not found Vendor Profile Contact')
                                        callback('Not found Vendor Profile Contact', null)
                                    }
                                }).catch((err) => {
                                    logger.error(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Error:' + err)
                                    callback(err, null)
                                })
                            } else {
                                logger.error(req, 'UpdateVendorContact|Data:' + JSON.stringify(vendorContact) + '|Error:' + error.desc_00005)
                                callback(error.desc_00005, null)
                            }
                        })
                    }
                })
            }
            async.parallel(asyncTasks, (err, result) => {
                if (err) {
                    logger.summary(req, cmd + '|' + error.desc_01001)
                    res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
                } else {
                    resp.getSuccess(req, res, cmd)
                }
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    delete: (req, res) => {
        let cmd = 'DeleteVendorProfile'
        try {
            if (req.params.vendorId) {
                mVendorProfile.destroy({
                    where: {
                        vendorId: req.params.vendorId
                    }
                }).then((succeed) => {
                    if (succeed > 0) {
                        logger.info(req, cmd + '|Data:\"vendorId\": \"' + req.params.vendorId + '\"|Deleted ' + succeed + ' records')
                        return resp.getSuccess(req, res, cmd)
                    } else {
                        logger.error(req, cmd + '|Not Found VendorProfile')
                        logger.summary(req, cmd + '|Not Found VendorProfile')
                        res.json(resp.getJsonError(error.code_01003, error.desc_01003, 'Not Found VendorProfile'))
                    }
                }).catch((err) => {
                    logger.error(req, cmd + '|Data:\"vendorId\": \"' + req.params.vendorId + '\"|Error:' + err)
                    logger.summary(req, cmd + '|' + error.desc_01001)
                    res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
                })
            } else {
                logger.error(req, cmd + '|Error:' + error.desc_00005)
                return resp.getIncompleteParameter(req, res, cmd)
            }
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    queryByCriteria: (req, res) => {
        let cmd = 'QueryVendorProfileByCriteria'
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
            if (util.isDataFound(req.body.requestData.vendorCriteria)) {
                jWhere = req.body.requestData.vendorCriteria
            }
            if (util.isDataFound(req.body.requestData.vendorContactCriteria)) {
                req.body.requestData.vendorContactCriteria.model = mVendorContact
                req.body.requestData.vendorContactCriteria.as = cst.models.vendorContacts
                if (!util.isDataFound(req.body.requestData.vendorContactCriteria.attributes) && JSON.stringify(req.body.requestData.vendorContactCriteria.attributes) != '[]') {
                    req.body.requestData.vendorContactCriteria.attributes = {
                        exclude: ['vendorId']
                    }
                }
                jWhere.include = req.body.requestData.vendorContactCriteria
            } else {
                jWhere.include = [{
                    model: mVendorContact,
                    as: cst.models.vendorContacts,
                    required: false,
                    attributes: {
                        exclude: ['vendorId']
                    }
                }]
            }
            //add paging in to jwhere
            jWhere.offset = jLimit.offset
            jWhere.limit = jLimit.limit
            logger.info(req, cmd + '|AllCriteria:' + jsUtil.inspect(jWhere, {
                showHidden: false,
                depth: null
            }))
            cmd = 'FindVendorProfile'
            mVendorProfile.findAndCountAll(jWhere).then((db) => {
                cmd = 'ChkVendorProfileData'
                logger.query(req, cmd + '|' + JSON.stringify(db))
                if (db.count > 0) {
                    return resp.getSuccess(req, res, cmd, {
                        "totalRecord": db.count,
                        "vendorProfileList": db.rows
                    })
                } else {
                    logger.error(req, cmd + '|Not Found VendorProfile')
                    logger.summary(req, cmd + '|Not Found VendorProfile')
                    res.json(resp.getJsonError(error.code_01003, error.desc_01003, db))
                }
            }).catch((err) => {
                logger.error(req, cmd + '|Error:' + err)
                logger.summary(req, cmd + '|' + error.desc_01002)
                res.json(resp.getJsonError(error.code_01002, error.desc_01002, err))
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    }
}
module.exports = vendorProfile