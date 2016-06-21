'use strict'

const chalk = require('chalk');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const error = require('../config/error');
const mLocation = require('../models/mBuildingLocation');
// const mArea = require('../models/mBuildingArea');

const location = {

  add: (req, res) => {
    try{
      console.log(chalk.green('=========== Add Location ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      const jWhere = { buildingNo: req.body.requestData.buildingNo, buildingName: req.body.requestData.buildingName};
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mLocation
        .findOrCreate({where:jWhere, defaults:req.body.requestData})
        .spread((db,succeed) => {
          console.log('Save Result : ' + chalk.green(succeed));
          console.log('Save Data : ' + chalk.blue(JSON.stringify(db, undefined, 2)));
          if(succeed) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,db));
          else res.json(resp.getJsonSuccess(error.code_01004,error.desc_01004,db));
        }).catch((err) => {
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.code_01001,error.desc_01001));
        })

    }catch(err){
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_00003,error.desc_00003));
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
        if(util.chkDataFound(db)) {
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
        if(util.chkDataFound(db)) {
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
        if(util.chkDigit(req.query.page) && util.chkDigit(req.query.count)){
          console.log(chalk.green('=========== chkDigit ==========='));
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
        if(util.chkDataFound(db.rows)) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,{"totalRecord":db.count,"locationList":db.rows}));
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

  queryByCriteria: (req, res) => {
    try{
      console.log(chalk.green('=========== Query Location By Criteria ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body.requestData, undefined, 2)));

      if(util.chkDataFound(req.body)){
        mLocation.findAll({where:req.body.requestData}).then((db) => {
          console.log('rows.count: ' + chalk.blue(db.length));
          if(util.chkDataFound(db)) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,{"locationList":db}));
          else res.json(resp.getJsonSuccess(error.code_01003,error.desc_01003));
        }).catch((err) => {
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.code_01002,error.desc_01002));
        });
      }else res.json(resp.getJsonSuccess(error.code_00005,error.desc_00005));
    }catch(err){
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_00003,error.desc_00003));
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
        if(util.chkDataFound(db)){
          // let dbClone = JSON.parse(JSON.stringify(db));
          // console.log('ur_workflows : '+chalk.blue(JSON.stringify(db.ur_workflows)));
          // if(util.chkDataFound(db.ur_workflows)){
          //   console.log(chalk.green('=========== Yes ==========='));
          //   dbClone.urWorkflowList = db.ur_workflows;
          //   delete dbClone.ur_workflows;
          // }else{
          //   console.log(chalk.green('=========== No ==========='));
          //   delete dbClone.ur_workflows;
          //   console.log('dbClone : '+chalk.blue(JSON.stringify(dbClone)));
          // }
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

};

module.exports = location;