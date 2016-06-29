'use strict'
// const response = require('../response/broadcastResponse.js');
const chalk = require('chalk');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const error = require('../config/error');
const mContract = require('../models/mContract');
// const mVendorProfile = require('../models/mVendorProfile');
// const mVendorPC = require('../models/mVendorProfileContact');

const contract = {

  add: (req, res) => {
    try{
      console.log(chalk.green('=========== Add Contract ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      const jWhere = {contractNo: req.body.requestData.contractNo, contractDate: req.body.requestData.contractDate};
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mContract
        .findOrCreate({where:jWhere, defaults:req.body.requestData})
        .spread((db,succeed) => {
          console.log('Save Result : ' + chalk.green(succeed));
          console.log('mContract : ' + chalk.blue(JSON.stringify(db, undefined, 2)));
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
      console.log(chalk.green('=========== Edit Contract ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      const jWhere = {contractId: req.body.requestData.contractId};
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mContract.findOne({where:jWhere}).then((db) => {
        console.log('Contract => ' + chalk.blue(JSON.stringify(db)));
        if(util.isDataFound(db)) {
          db
            .update(req.body.requestData)
            .then((succeed) => {
              console.log('Save Result : ' + chalk.green(succeed));
              console.log('Contract : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
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
      console.log(chalk.green('=========== Delete Contract ==========='));
      const jWhere = {contractId: req.params.contractId};
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mContract.findOne({where:jWhere}).then((db) => {
        console.log('Contract => ' + chalk.blue(JSON.stringify(db)));
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
      console.log(chalk.green('=========== Query Contract with Paging ==========='));
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
      mContract.findAndCountAll(jLimit).then((db) => {
        console.log('Contract : '+chalk.blue(JSON.stringify(db)));
        if(util.isDataFound(db.rows)) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,{"totalRecord":db.count,"contractList":db.rows}));
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
      console.log(chalk.green('=========== Query Contract By Criteria ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body.requestData, undefined, 2)));

      if(util.isDataFound(req.body)){
        mContract.findAll({where:req.body.requestData}).then((db) => {
          console.log('rows.count: ' + chalk.blue(db.length));
          if(util.isDataFound(db)) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,{"contractList":db}));
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
      console.log(chalk.green('=========== Query Contract By Id ==========='));
      console.log('Request URL : ' + chalk.blue(req.url));
      console.log('req.params.contractId : ' + chalk.blue(req.params.contractId));
      
      const jWhere = {contractId: req.params.contractId};
      mContract.findOne({where:jWhere}).then((db) => {
        console.log('Contract : '+chalk.blue(JSON.stringify(db)));
        if(util.isDataFound(db)){
          // let dbClone = JSON.parse(JSON.stringify(db));
          // console.log('ur_workflows : '+chalk.blue(JSON.stringify(db.ur_workflows)));
          // if(util.isDataFound(db.ur_workflows)){
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

module.exports = contract;