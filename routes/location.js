'use strict'
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const jsUtil = require('util')
const error = require('../config/error')
const cst = require('../config/constant')
const logger = require('../utils/logUtils')
const mLocation = require('../models/mBuildingLocation')
const mArea = require('../models/mBuildingArea')
const mDetail = require('../models/mBuildingDetail')
const mUR = require('../models/mUR')
const mMovement = require('../models/mMovement')
const location = {
    /*************
    ** "attributes": { "exclude": ["contractId","urDate","company"] },
    {
        "requestData": {
            "locationCriteria":{
              "order": "\"buildingId\" DESC",
              "attributes": ["urId", "urStatus"],
              "where":{
                "urType": "RENTAL",
                "company": "AIS",
                "urStatus":"ADMIN_ACCEPT",
                "urBy":"user"
              }
            },
            "areaCriteria":{
              "attributes": ["urStatus"],
              "where":{
                "updateBy":"admin",
                "urStatus":"ADMIN_ACCEPT"
              }
            }
        }
    }
    *************/
    queryByCriteria: (req, res) => {
        let cmd = 'QueryLocationByCriteria'
        try {
            const jLimit = {
                offset: null,
                limit: null
            }
            if (Object.keys(req.query).length != 0) {
                cmd = 'ChkPageCount'
                if (util.isDigit(req.query.page) && util.isDigit(req.query.count)) {
                    jLimit.offset = (req.query.page - 1) * req.query.count
                    jLimit.limit = parseInt(req.query.count)
                } else {
                    logger.error(req, cmd + '|Error:page or count is wrong format')
                    return resp.getIncompleteParameter(req, res, cmd)
                }
            }
            let jWhere = {}
            cmd = 'GenCriteria'
            if (util.isDataFound(req.body.requestData.locationCriteria)) {
                jWhere = JSON.parse(JSON.stringify(req.body.requestData.locationCriteria))
            }
            //add paging in to jwhere
            jWhere.offset = jLimit.offset
            jWhere.limit = jLimit.limit
            let required = false
            if (util.isDataFound(req.body.requestData.areaCriteria)) {
                jWhere.include = JSON.parse(JSON.stringify(req.body.requestData.areaCriteria))
                if (util.isDataFound(req.body.requestData.areaCriteria.where)) {
                    required = true
                }
                if (!util.isDataFound(req.body.requestData.areaCriteria.attributes) && JSON.stringify(req.body.requestData.areaCriteria.attributes) != '[]') {
                    jWhere.include.attributes = {
                        exclude: ['buildingId']
                    }
                }
            } else {
                jWhere.include = {}
                jWhere.include.attributes = {
                    exclude: ['buildingId']
                }
            }
            //add include area into jWhere
            jWhere.include.model = mArea
            jWhere.include.as = cst.models.locationAreas
            jWhere.include.required = required
                //add include Detail into jWhere
            if (util.isDataFound(jWhere.include.attributes)) {
                required = false
                jWhere.include.include = {}
                if (util.isDataFound(req.body.requestData.detailCriteria)) {
                    jWhere.include.include = JSON.parse(JSON.stringify(req.body.requestData.detailCriteria))
                    if (util.isDataFound(req.body.requestData.detailCriteria.where)) {
                        required = true
                    }
                    if (!util.isDataFound(req.body.requestData.detailCriteria.attributes) && JSON.stringify(req.body.requestData.detailCriteria.attributes) != '[]') {
                        jWhere.include.include.attributes = {
                            exclude: ['buildingAreaId']
                        }
                    }
                }
                jWhere.include.include.model = mDetail
                jWhere.include.include.as = cst.models.areaDetails
                jWhere.include.include.required = required
            }
            logger.info(req, cmd + '|Criteria:' + jsUtil.inspect(jWhere, {
                    showHidden: false,
                    depth: null
                }))
                /*****Note*****
                Error:Converting circular structure to JSON 
                When use JSON.stringify
                With jWhere
                Because model is an object but NOT JSON object 
                *********/
            cmd = 'FindLocation'
            mLocation.findAndCountAll(jWhere).then((db) => { //{include:[{all:true,nested:true}]}
                cmd = 'chkLocationData'
                logger.query(req, cmd + '|QueryResponse:' + JSON.stringify(db))
                if (db.count > 0) return resp.getSuccess(req, res, cmd, {
                    "totalRecord": db.count,
                    "buildingLocationList": db.rows
                })
                else {
                    logger.summary(req, cmd + '|Error:Not Found Location')
                    res.json(resp.getJsonError(error.code_01003, error.desc_01003, db))
                }
            }).catch((err) => {
                logger.error(req, cmd + '|Error:' + err)
                logger.summary(req, cmd + '|Error:' + error.desc_01002)
                res.json(resp.getJsonError(error.code_01002, error.desc_01002, err))
            })
        } catch (err) {
            logger.error(req, cmd + '|Error:' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
    queryAreaByCriteria: (req, res) => {
        let cmd = 'QueryAreaByCriteria'
        try {
            const jLimit = {
                offset: null,
                limit: null
            }
            if (Object.keys(req.query).length != 0) {
                cmd = 'ChkPageCount'
                if (util.isDigit(req.query.page) && util.isDigit(req.query.count)) {
                    jLimit.offset = (req.query.page - 1) * req.query.count
                    jLimit.limit = parseInt(req.query.count)
                } else {
                    logger.error(req, cmd + '|Error:page or count is wrong format')
                    return resp.getIncompleteParameter(req, res, cmd)
                }
            }
            cmd = 'GenCriteria'
            let jWhere = {}
            let required = false
            if (util.isDataFound(req.body.requestData.areaCriteria)) {
                jWhere = JSON.parse(JSON.stringify(req.body.requestData.areaCriteria))
            }
            //add paging in to jwhere
            jWhere.offset = jLimit.offset
            jWhere.limit = jLimit.limit
            let where = {}
            if (util.isDataFound(req.body.requestData.locationCriteria)) {
                where = JSON.parse(JSON.stringify(req.body.requestData.locationCriteria))
                if (util.isDataFound(req.body.requestData.locationCriteria.where)) {
                    required = true
                }
            }
            jWhere.include = []
                //add include location
            where.model = mLocation
            where.as = cst.models.location
            where.required = required
            jWhere.include.push(where)
                //add include area detail
            where = {}
            required = false
            if (util.isDataFound(req.body.requestData.detailCriteria)) {
                where = JSON.parse(JSON.stringify(req.body.requestData.detailCriteria))
                if (util.isDataFound(req.body.requestData.detailCriteria.where)) {
                    required = true
                }
            }
            where.model = mDetail
            where.as = cst.models.areaDetails
            where.required = required
                //where.attributes = attributes
            jWhere.include.push(where)
                //add include Movement
            where = {}
            required = false
            if (util.isDataFound(req.body.requestData.movementCriteria)) {
                where = JSON.parse(JSON.stringify(req.body.requestData.movementCriteria))
                if (util.isDataFound(req.body.requestData.movementCriteria.where)) {
                    required = true
                }
            }
            where.model = mMovement
            where.as = cst.models.movements
            where.required = required
                // where.attributes = {
                //     exclude: ['buildingAreaId']
                // }
            jWhere.include.push(where)
                //add include UR
            where = {}
            required = false
            if (util.isDataFound(req.body.requestData.urCriteria)) {
                where = JSON.parse(JSON.stringify(req.body.requestData.urCriteria))
                if (util.isDataFound(req.body.requestData.urCriteria.where)) {
                    required = true
                }
            }
            where.through = {
                model: mMovement,
                as: cst.models.movements,
                attributes: []
            }
            where.model = mUR
            where.as = cst.models.urs
            where.required = required
                // where.attributes = {
                //     exclude: ['buildingAreaId']
                // }
            jWhere.include.push(where)
            logger.info(req, cmd + '|Criteria:' + jsUtil.inspect(jWhere, {
                    showHidden: false,
                    depth: null
                }))
                /*****Note*****
                Error:Converting circular structure to JSON 
                When use JSON.stringify
                With jWhere
                Because model is an object but NOT JSON object 
                *********/
            cmd = 'FindArea'
            mArea.findAndCountAll(jWhere).then((db) => { //{include:[{all:true,nested:true}]}
                cmd = 'ChkAreaData'
                logger.query(req, cmd + '|QueryResponse:' + JSON.stringify(db))
                if (db.count > 0) return resp.getSuccess(req, res, cmd, {
                    "totalRecord": db.count,
                    "buildingAreaList": db.rows
                })
                else {
                    logger.summary(req, cmd + '|Error:Not Found Area')
                    res.json(resp.getJsonError(error.code_01003, error.desc_01003, db))
                }
            }).catch((err) => {
                logger.error(req, cmd + '|Error:' + err)
                logger.summary(req, cmd + '|Error:' + error.desc_01002)
                res.json(resp.getJsonError(error.code_01002, error.desc_01002, err))
            })
        } catch (err) {
            logger.error(req, cmd + '|Error:' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    },
}
module.exports = location