'use strict'
const logger = require('../utils/logUtils')
const async = require('async')
const path = require('path')
const request = require('request')
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const jsUtil = require('util')
const error = require('../config/error')
const cfg = require('../config/config')
const cst = require('../config/constant')
const mDocument = require('../models/mDocument')
const mBuildingLocation = require('../models/mBuildingLocation')
const mBuildingArea = require('../models/mBuildingArea')
const mInsurance = require('../models/mInsurance')
const mContract = require('../models/mContract')
const mCfg = require('../config/modelCfg')
const document = {
    archivDownload: (req, res) => {
        let cmd = 'DownloadDocument'
        try {
            if (!req.query.documentPath) {
                logger.error(req, cmd + '|Error:' + error.desc_00005)
                return resp.getIncompleteParameter(req, res, cmd)
            }
            let split = req.query.documentPath.split("\\")
            if (split.length <= 0) {
                logger.error(req, cmd + '|Error:' + error.desc_00005)
                return resp.getIncompleteParameter(req, res, cmd)
            }
            let resMsg = {
                statusCode: null,
                errDesc: null,
                devMsg: null
            }
            async.waterfall([
                (callback) => {
                    let docData = {
                        archivingUrl: null,
                        originalName: null
                    }
                    cmd = 'GetArchivingURL'
                    mDocument.findOne({
                        where: {
                            documentRename: split[split.length - 1]
                        }
                    }).then((db) => {
                        logger.query(req, cmd + '|' + util.jsonToText(db))
                        if (util.isDataFound(db)) {
                            docData.archivingUrl = db.archivingUrl
                            docData.originalName = db.documentName
                            callback(null, docData)
                        } else {
                            logger.error(req, cmd + '|Not Found Document')
                            logger.summary(req, cmd + '|Not Found Document')
                            resMsg.statusCode = error.code_01003
                            resMsg.errDesc = error.desc_01003
                            resMsg.devMsg = db
                            callback(resMsg)
                        }
                    }).catch((err) => {
                        logger.error(req, cmd + '|' + err)
                        logger.summary(req, cmd + '|' + error.desc_01002)
                        resMsg.statusCode = error.code_01002
                        resMsg.errDesc = error.desc_01002
                        resMsg.devMsg = err
                        callback(resMsg)
                    })
                }, (docObj, callback) => {
                    let options = {
                        method: 'POST',
                        url: cfg.archiving.authenURL,
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            authorization: 'Basic ' + new Buffer(cfg.archiving.username + ":" + cfg.archiving.password).toString("base64")
                        },
                        form: {
                            object_url: encodeURI(docObj.archivingUrl),
                            expire: cfg.archiving.expireToken,
                            client_ip: cfg.archiving.clientIP
                        }
                    }
                    cmd = 'ArchivingAuthen'
                    logger.info(req, cmd + '|Request: ' + JSON.stringify(options))
                    request(options, (error, response, result) => {
                        if (error) {
                            logger.error(req, cmd + '|Error: ' + error)
                            logger.summary(req, cmd + '|' + error.desc_02001)
                            resMsg.statusCode = error.code_02001
                            resMsg.errDesc = error.desc_02001
                            resMsg.devMsg = error
                            callback(resMsg)
                        } else {
                            let json = JSON.parse(result)
                            if (json.status == 'success') {
                                callback(null, json.token, docObj)
                            } else {
                                logger.error(req, cmd + '|Error: ' + result.status)
                                logger.summary(req, cmd + '|' + error.desc_02002)
                                resMsg.statusCode = error.code_02002
                                resMsg.errDesc = error.desc_02002
                                resMsg.devMsg = result.status
                                callback(resMsg)
                            }
                        }
                    })
                }, (token, docObj, callback) => {
                    let options = {
                        method: 'GET',
                        url: cfg.archiving.downloadURL,
                        qs: {
                            file: encodeURI(docObj.archivingUrl),
                            token: token
                        },
                        headers: {
                            authorization: 'Basic ' + new Buffer(cfg.archiving.username + ":" + cfg.archiving.password).toString("base64")
                        }
                    }
                    let data = []
                    let header = {}
                    let bodyContent = {
                        data: [],
                        header: {}
                    }
                    cmd = 'Download'
                    logger.info(req, cmd + '|Request: ' + JSON.stringify(options))
                    request(options).on('response', function(response) {
                        logger.info(req, cmd + '|Response: ' + JSON.stringify(response))
                        header.statusCode = response.statusCode
                        header.contentType = response.headers['content-type']
                        header.contentDisposition = "attachment; filename=\"" + encodeURI(docObj.originalName) + "\""
                    }).on('error', function(err) {
                        logger.error(req, cmd + '|Error: ' + error)
                        logger.summary(req, cmd + '|' + error.desc_02003)
                        resMsg.statusCode = error.code_02003
                        resMsg.errDesc = error.desc_02003
                        resMsg.devMsg = err
                        callback(resMsg)
                    }).on('data', function(content) {
                        data.push(content);
                    }).on('end', function() {
                        logger.summary(req, cmd + '|Success')
                        data = Buffer.concat(data)
                        bodyContent.header = header
                        bodyContent.data = data
                        callback(null, bodyContent)
                    })
                }
            ], (err, resContent) => {
                if (err) {
                    res.json(resp.getJsonError(err.statusCode, err.errDesc, err.devMsg))
                } else {
                    res.writeHead(resContent.header.statusCode, {
                        'Content-Type': resContent.header.contentType,
                        'Content-Disposition': resContent.header.contentDisposition,
                        'Content-Length': resContent.data.length
                    });
                    res.end(resContent.data)
                }
            });
        } catch (err) {
            logger.error(req, cmd + '|Error:' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    add: (req, res) => {
        let cmd = 'AddDocument'
        try {
            if (req.body.requestData.documentName && req.body.requestData.documentVersion && req.body.requestData.documentType) {
                let jWhere = {
                    documentName: req.body.requestData.documentName,
                    documentVersion: req.body.requestData.documentVersion,
                    documentType: req.body.requestData.documentType
                }
                mDocument.findOrCreate({
                    where: jWhere,
                    defaults: req.body.requestData
                }).spread((db, succeed) => {
                    if (succeed) {
                        logger.info(req, cmd + '|Data:' + JSON.stringify(req.body.requestData) + '|Create complete')
                        return resp.getSuccess(req, res, cmd, db)
                    } else { //Document existed
                        logger.error(req, cmd + '|Error:' + error.desc_01004)
                        logger.summary(req, cmd + '|Error:' + error.desc_01004)
                        res.json(resp.getJsonError(error.code_01004, error.desc_01004, db))
                    }
                }).catch((err) => {
                    logger.error(req, cmd + '|Data:' + JSON.stringify(req.body.requestData) + '|Error:' + err)
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
    delete: (req, res) => {
        let cmd = 'DeleteDocument'
        try {
            if (req.params.documentId) {
                mDocument.destroy({
                    where: {
                        documentId: req.params.documentId
                    }
                }).then((succeed) => {
                    if (succeed > 0) {
                        logger.info(req, cmd + '|Data:\"documentId\": \"' + req.params.documentId + '\"|Deleted ' + succeed + ' records')
                        return resp.getSuccess(req, res, cmd)
                    } else {
                        logger.error(req, cmd + '|Not Found Document')
                        logger.summary(req, cmd + '|Not Found Document')
                        res.json(resp.getJsonError(error.code_01003, error.desc_01003, 'Not Found Document'))
                    }
                }).catch((err) => {
                    logger.error(req, cmd + '|Data:\"documentId\": \"' + req.params.documentId + '\"|Error:' + err)
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
        let cmd = 'QueryDocumentByCriteria'
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
            jWhere.include = []
            cmd = 'GenCriteria'
            if (util.isDataFound(req.body.requestData.documentCriteria)) {
                jWhere = req.body.requestData.documentCriteria
            }
            if (util.isDataFound(req.body.requestData.locationCriteria)) {
                req.body.requestData.locationCriteria.model = mBuildingLocation
                req.body.requestData.locationCriteria.as = cst.models.location
                if (util.isDataFound(req.body.requestData.locationCriteria.where)) {
                    req.body.requestData.locationCriteria.required = true
                }
                if (!util.isDataFound(req.body.requestData.locationCriteria.attributes) && JSON.stringify(req.body.requestData.locationCriteria.attributes) != '[]') {
                    req.body.requestData.locationCriteria.attributes = {
                        exclude: ['documentId']
                    }
                }
                jWhere.include.push(req.body.requestData.locationCriteria)
            }
            if (util.isDataFound(req.body.requestData.areaCriteria)) {
                req.body.requestData.areaCriteria.model = mBuildingArea
                req.body.requestData.areaCriteria.as = cst.models.locationArea
                if (util.isDataFound(req.body.requestData.areaCriteria.where)) {
                    req.body.requestData.areaCriteria.required = true
                }
                if (!util.isDataFound(req.body.requestData.areaCriteria.attributes) && JSON.stringify(req.body.requestData.areaCriteria.attributes) != '[]') {
                    req.body.requestData.areaCriteria.attributes = {
                        exclude: ['documentId']
                    }
                }
                jWhere.include.push(req.body.requestData.areaCriteria)
            }
            if (util.isDataFound(req.body.requestData.insuranceCriteria)) {
                req.body.requestData.insuranceCriteria.model = mInsurance
                req.body.requestData.insuranceCriteria.as = cst.models.insurance
                if (util.isDataFound(req.body.requestData.insuranceCriteria.where)) {
                    req.body.requestData.insuranceCriteria.required = true
                }
                if (!util.isDataFound(req.body.requestData.insuranceCriteria.attributes) && JSON.stringify(req.body.requestData.insuranceCriteria.attributes) != '[]') {
                    req.body.requestData.insuranceCriteria.attributes = {
                        exclude: ['documentId']
                    }
                }
                jWhere.include.push(req.body.requestData.insuranceCriteria)
            }
            if (util.isDataFound(req.body.requestData.contractCriteria)) {
                req.body.requestData.contractCriteria.model = mContract
                req.body.requestData.contractCriteria.as = cst.models.contract
                if (util.isDataFound(req.body.requestData.contractCriteria.where)) {
                    req.body.requestData.contractCriteria.required = true
                }
                if (!util.isDataFound(req.body.requestData.contractCriteria.attributes) && JSON.stringify(req.body.requestData.contractCriteria.attributes) != '[]') {
                    req.body.requestData.contractCriteria.attributes = {
                        exclude: ['documentId']
                    }
                }
                jWhere.include.push(req.body.requestData.contractCriteria)
            }
            if (jWhere) {
                jWhere.include = [{
                    model: mBuildingLocation,
                    as: cst.models.location,
                    required: false,
                    attributes: {
                        exclude: ['documentId']
                    }
                }, {
                    model: mBuildingArea,
                    as: cst.models.locationArea,
                    required: false,
                    attributes: {
                        exclude: ['documentId']
                    }
                }, {
                    model: mInsurance,
                    as: cst.models.insurance,
                    required: false,
                    attributes: {
                        exclude: ['documentId']
                    }
                }, {
                    model: mContract,
                    as: cst.models.contract,
                    required: false,
                    attributes: {
                        exclude: ['documentId']
                    }
                }]
            }
            // } else {
            //     jWhere.include = [{
            //         model: mVendorContact,
            //         as: cst.models.vendorContacts,
            //         required: false,
            //         attributes: {
            //             exclude: ['documentId']
            //         }
            //     }]
            // }
            //add paging in to jwhere
            jWhere.offset = jLimit.offset
            jWhere.limit = jLimit.limit
            logger.info(req, cmd + '|AllCriteria:' + jsUtil.inspect(jWhere, {
                showHidden: false,
                depth: null
            }))
            cmd = 'FindDocument'
            mDocument.findAndCountAll(jWhere).then((db) => {
                cmd = 'ChkDocumentData'
                logger.query(req, cmd + '|' + JSON.stringify(db))
                if (db.count > 0) {
                    return resp.getSuccess(req, res, cmd, {
                        "totalRecord": db.count,
                        "documentList": db.rows
                    })
                } else {
                    logger.error(req, cmd + '|Not Found Document')
                    logger.summary(req, cmd + '|Not Found Document')
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
    },
    updateULStatus: (req, res) => {
        let cmd = 'UpdateUploadStatus';
        try {
            // mDocument.bulkCreate(req.body.requestData.uploadStatusList, {
            //     validate: true
            // }).then((succeed) => {
            //     logger.info(req, cmd + '|' + JSON.stringify(succeed));
            //     return resp.getSuccess(req, res, cmd);
            // }).catch((err) => {
            //     logger.error(req, cmd + '|' + err);
            //     logger.summary(req, cmd + '|' + error.desc_01001);
            //     res.json(resp.getJsonError(error.code_01001, error.desc_01001, err));
            // })
            if (!util.isDataFound(req.body.requestData.uploadStatus) && !util.isDataFound(req.body.requestData.documentRename)) {
                logger.error(req, cmd + '|Error:Incomplete parameter')
                return resp.getIncompleteParameter(req, res, cmd)
            }
            logger.info(req, cmd + '|Data:' + jsUtil.inspect(req.body.requestData, {
                showHidden: false,
                depth: null
            }))
            mDocument.update({
                uploadStatus: req.body.requestData.uploadStatus,
                archivingUrl: req.body.requestData.archivingUrl
            }, {
                where: {
                    documentRename: req.body.requestData.documentRename
                }
            }).then((succeed) => {
                let updated = 'Update success ' + succeed + ' rows'
                if (succeed > 0) {
                    logger.info(req, cmd + '|' + updated)
                    resp.getSuccess(req, res, cmd)
                } else {
                    logger.error(req, cmd + '|Error:Data not found')
                    logger.summary(req, cmd + '|Data not found')
                    res.json(resp.getJsonError(error.code_01003, error.desc_01003, 'Data not found'))
                }
            }).catch((dberr) => {
                logger.error(req, cmd + '|Error while update upload status|' + dberr)
                return resp.getInternalError(req, res, cmd, dberr)
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err);
            return resp.getInternalError(req, res, cmd, err);
        }
    },
    distinctDocType:(req, res) => {
        let cmd='distinctObjective'
        let rawQ='select distinct doc_type as docType from dbo.document where doc_type is not null'
        mCfg.sequelize.query(rawQ, {type:mCfg.sequelize.QueryTypes.SELECT})
          .then((dbs) => {
            logger.info(req,cmd+'|SQL:'+rawQ+'|DBs:'+ util.jsonToText(dbs))
            if(util.isDataFound(dbs)) resp.getSuccess(req,res,cmd,dbs)
            else{
                logger.summary(req, cmd + '|' + error.desc_01003)
                res.json(resp.getJsonError(error.code_01003, error.desc_01003))
            }
          }).catch((err) => {
            logger.error(req,cmd+'|'+err)
            logger.summary(req, cmd + '|' + error.desc_01003)
            res.json(resp.getJsonError(error.code_01003, error.desc_01003))
          })
    }
}
module.exports = document