'use strict'

const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require('util');
const error = require('../config/error');
const cst = require('../config/constant');
const logger = require('../utils/logUtils');
const mLocation = require('../models/mBuildingLocation');
const mArea = require('../models/mBuildingArea');
const mDetail = require('../models/mBuildingDetail');

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
    let cmd = 'queryLocationByCriteria';
    try{
      cmd = 'chkPaging';
      const jLimit={offset: null, limit: null};
      if(Object.keys(req.query).length !=0){
        cmd = 'chkPageCount';
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          jLimit.offset = (req.query.page -1)*req.query.count;
          jLimit.limit = parseInt(req.query.count);
        }else{
          logger.info(req,cmd+'|page or count is wrong format');
          return resp.getIncompleteParameter(req,res,cmd);
        }
      }
      logger.info(req,cmd+'|'+JSON.stringify(jLimit));

      cmd = 'chkRequestBody';
      if(util.isDataFound(req.body)){
        let jWhere = {};
        cmd = 'genLocationCriteria';
        if(util.isDataFound(req.body.requestData.locationCriteria)){
          logger.info(req,cmd+'|selected Location');
          jWhere = JSON.parse(JSON.stringify(req.body.requestData.locationCriteria));
        }else{
          logger.info(req,cmd+'|default Location with no criteria');
        }
        //add paging in to jwhere
        jWhere.offset = jLimit.offset;
        jWhere.limit = jLimit.limit;
        
        cmd = 'chkAreaCriteria';
        if(util.isDataFound(req.body.requestData.areaCriteria)){
          logger.info(req,cmd+'|selected Area');
          jWhere.include = JSON.parse(JSON.stringify(req.body.requestData.areaCriteria));
          if(!util.isDataFound(req.body.requestData.areaCriteria.attributes)&&JSON.stringify(req.body.requestData.areaCriteria.attributes)!='[]'){
            logger.info(req,cmd+'|default Area attributes');
            jWhere.include.attributes={exclude:['buildingId']}; 
          }else{
            logger.info(req,cmd+'|selected Area attributes');
          }
          
        }else{
          jWhere.include={};
          jWhere.include.attributes={exclude:['buildingId']};
          logger.info(req,cmd+'|default Area with no criteria');
        }
        
        //add include area into jWhere
        jWhere.include.model=mArea;
        jWhere.include.as=cst.models.locationAreas;
        jWhere.include.required=false;
        //add include Detail into jWhere
        cmd = 'genDetail';
        if(util.isDataFound(jWhere.include.attributes)){
          logger.info(req,cmd+'|add Area Detail');
          jWhere.include.include={};
          jWhere.include.include.model=mDetail;
          jWhere.include.include.as=cst.models.areaDetails;
          jWhere.include.include.required=false;
          jWhere.include.include.attributes={exclude:['buildingAreaId']};
        }
        logger.info(req,cmd+'|searchOptions:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null}));
/*****Note*****
Error:Converting circular structure to JSON 
When use JSON.stringify
With jWhere
Because model is an object but NOT JSON object 
*********/

        cmd = 'findLocation';
        mLocation.findAndCountAll(jWhere).then((db) => {//{include:[{all:true,nested:true}]}
          cmd = 'chkLocationData';
          logger.info(req,cmd+'|'+JSON.stringify(db));
          if(db.count>0) return resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"buildingLocationList":db.rows});
          else{
            logger.summary(req,cmd+'|Not Found Location');
            res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));
          }
        }).catch((err) => {
          logger.error(req,cmd+'|Error while check Location return|'+err);
          logger.summary(req,cmd+'|'+error.desc_01002);
          res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
        });
      }else{
        logger.info(req,cmd+'|Not Found requestData|');
        return resp.getIncompleteParameter(req,res,cmd);
      }
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
    }
  },

}

module.exports = location;