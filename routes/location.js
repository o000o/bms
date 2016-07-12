'use strict'

const chalk = require('chalk');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require("util");
const error = require('../config/error');
const logger = require('../utils/logUtils');
const mLocation = require('../models/mBuildingLocation');
const mArea = require('../models/mBuildingArea');
const mDetail = require('../models/mBuildingDetail');

const location = {

  add: (req, res) => {
    let cmd = 'addLocation';
    try{
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));
      // // console.log(chalk.green('=========== Add Location ==========='));
      // // console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      // const jWhere = {buildingNo: req.body.requestData.buildingNo, buildingName: req.body.requestData.buildingName};
      // // console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));
      // logger.info(req,cmd+'|'+JSON.stringify(jWhere));
      // mLocation
      //   .findOrCreate({where:jWhere, defaults:req.body.requestData})
      //   .spread((db,succeed) => {
      //     console.log('Save Result : ' + chalk.green(succeed));
      //     console.log('Save Data : ' + chalk.blue(JSON.stringify(db, undefined, 2)));
      //     if(succeed) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,db));
      //     else res.json(resp.getJsonSuccess(error.code_01004,error.desc_01004,db));
      //   }).catch((err) => {
      //     console.log('Error : ' + chalk.red(err));
      //     res.json(resp.getJsonError(error.code_01001,error.desc_01001));
      //   })

    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err);
      // console.log('Error : ' + chalk.red(err));
      // res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  edit: (req, res) => {
    try{
      console.log(chalk.green('=========== Edit Location ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      const jWhere = { buildingId: req.body.requestData.buildingId};
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mLocation.findOne({where:jWhere}).then((db) => {
        console.log('Location => ' + chalk.blue(JSON.stringify(db)));
        if(util.isDataFound(db)) {
          db
            .update(req.body.requestData)
            .then((succeed) => {
              console.log('Save Result : ' + chalk.green(succeed));
              console.log('Location : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
              res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
            }).catch((err) => { //No use unless it has error under .then(succeed)
              console.log('Error : ' + chalk.red(err));
              res.json(resp.getJsonError(error.code_01001,error.desc_01001));
            })
        }else{
          res.json(resp.getJsonSuccess(error.code_01003,error.desc_01003));
        }
      }).catch((err) => {
            console.log('Error : ' + chalk.red(err));
            res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });
    }catch(err){
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  delete: (req, res) => {
    try{
      console.log(chalk.green('=========== Delete Location ==========='));
      const jWhere = { BUILDING_ID: req.params.buildingId};
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mLocation.findOne({where:jWhere}).then((db) => {
        console.log('Location => ' + chalk.blue(JSON.stringify(db)));
        if(util.isDataFound(db)) {
          db
            .destroy()
            .then((succeed) => {
              console.log('Save Result : ' + chalk.green(succeed));
              res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
            }).catch((err) => { //No use unless it has error under .then(succeed)
              console.log('Error : ' + chalk.red(err));
              res.json(resp.getJsonError(error.code_01001,error.desc_01001));
            })
        } else {
          res.json(resp.getJsonSuccess(error.code_01003,error.desc_01003));
        }
      }).catch((err) => {
            console.log('Error : ' + chalk.red(err));
            res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });
    }catch(err){
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  query: (req, res) => {
    try{
      console.log(chalk.green('=========== Query Location with Paging ==========='));
      console.log('Page : ' + chalk.blue(req.query.page));
      console.log('Count : ' + chalk.blue(req.query.count));
      const jLimit={offset: null, limit: null};
      if(Object.keys(req.query).length !=0){
        console.log(chalk.green('=========== NOT NUll ==========='));
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          console.log(chalk.green('=========== isDigit ==========='));
          jLimit.offset = (req.query.page -1)*req.query.count;
          jLimit.limit = parseInt(req.query.count);
        }else{
          console.log(chalk.green('=========== Invalid ==========='));
          return res.json(resp.getJsonError(error.code_00005,error.desc_00005));
        }
      }
      console.log('jLimit : '+chalk.blue(JSON.stringify(jLimit)));
      mLocation.findAndCountAll(jLimit).then((db) => {
        console.log('Location : '+chalk.blue(JSON.stringify(db)));
        if(util.isDataFound(db.rows)) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,{"totalRecord":db.count,"locationList":db.rows}));
        else res.json(resp.getJsonSuccess(error.code_01003,error.desc_01003));
      }).catch((err) => {
        console.log('Error : ' + chalk.red(err));
        res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });
    }catch(err){
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

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
      logger.info(req,cmd+'|'+JSON.stringify(req.body.requestData));

      cmd = 'chkPaging';
      const jLimit={offset: null, limit: null};
      // console.log('jLimit : '+chalk.blue(JSON.stringify(jLimit)));
      if(Object.keys(req.query).length !=0){
        cmd = 'chkPageCount';
        // console.log(chalk.green('=========== NOT NUll ==========='));
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          // console.log(chalk.green('=========== isDigit ==========='));
          jLimit.offset = (req.query.page -1)*req.query.count;
          jLimit.limit = parseInt(req.query.count);
        }else{
          logger.info(req,cmd+'|page or count is wrong format');
          return resp.getIncompleteParameter(req,res,cmd);
          // console.log(chalk.green('=========== Invalid ==========='));
          // return res.json(resp.getJsonError(error.code_00005,error.desc_00005));
        }
      }
      logger.info(req,cmd+'|'+JSON.stringify(jLimit));

      cmd = 'chkRequestBody';
      if(util.isDataFound(req.body)){
        let jWhere = {};
        cmd = 'genLocationCriteria';
        if(util.isDataFound(req.body.requestData.locationCriteria)){
          logger.info(req,cmd+'|genLocationCriteria');
          jWhere = JSON.parse(JSON.stringify(req.body.requestData.locationCriteria));
        }else{
          logger.info(req,cmd+'|default Location with no criteria');
        }
        //add paging in to jwhere
        jWhere.offset = jLimit.offset;
        jWhere.limit = jLimit.limit;
        
        cmd = 'genAreaCriteria';
        if(util.isDataFound(req.body.requestData.areaCriteria)){
          logger.info(req,cmd+'|genAreaCriteria');
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
        jWhere.include.as='areaList';
        jWhere.include.required=false;
        //add include Detail into jWhere
        cmd = 'genDetail';
        if(util.isDataFound(jWhere.include.attributes)){
          logger.info(req,cmd+'|add Area Detail');
          jWhere.include.include={};
          jWhere.include.include.model=mDetail;
          jWhere.include.include.as='detailList';
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
          if(db.count>0) return resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"locationList":db.rows});
          else{
            logger.summary(req,cmd+'|Not Found Location');
            res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));
          }
        }).catch((err) => {
          logger.error(req,cmd+'|Error while check Location return|'+err);
          // return resp.getInternalError(req,res,cmd,err);
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

  queryById: (req, res) => {
    try{
      console.log(chalk.green('=========== Query Location By Id ==========='));
      console.log('Request URL : ' + chalk.blue(req.url));
      console.log('req.params.buildingId : ' + chalk.blue(req.params.buildingId));
      const jWhere = {buildingId: req.params.buildingId};
      // const jWhere = { buildingId: req.params.buildingId};
      mLocation.findOne({where:jWhere}).then((db) => {
        console.log('Location : '+chalk.blue(JSON.stringify(db)));
        if(util.isDataFound(db)){
          res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,db));
        }else res.json(resp.getJsonSuccess(error.code_01003,error.desc_01003));
      }).catch((err) => {
        console.log('Error : ' + chalk.red(err));
        res.json(resp.getJsonError(error.code_01002,error.desc_01002));
      });
    }catch(err){
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  }

}

module.exports = location;