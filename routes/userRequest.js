'use strict'
// const response = require('../response/broadcastResponse.js');
const chalk = require('chalk');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const error = require('../config/error');
// const mContract = require('../models/mContract');
const mUR = require('../models/mUR');
const mUrWf = require('../models/mUrWorkFlow');
const cfg = require('../config/config');

const userRequest = {

  updateStatus: (req, res) => {
    try{
      console.log(chalk.green('=========== Approval UR ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      mUrWf
        .build(req.body.requestData)
        .save()
        .then((succeed) => {
          console.log('Save Result : ' + chalk.green(succeed));
          console.log('Save Data : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
          const jWhere = { urId: req.body.requestData.urId};
          mUR.findOne({where:jWhere}).then((db) => {
            console.log('UR => ' + chalk.blue(JSON.stringify(db)));
            if(util.chkDataFound(db)) {
              db
                .update(req.body.requestData)
                .then((succeed) => {
                  console.log('Save Result : ' + chalk.green(succeed));
                  console.log('VendorProfile : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
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
        }).catch((err) => {
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.code_01001,error.desc_01001));
        })
    }catch(err){
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_00003,error.desc_00003));
    }
  },

  add: (req, res) => {
    try{
      console.log(chalk.green('=========== Add UR ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      mUR
        .build(req.body.requestData)
        .save()
        .then((succeed) => {
          console.log('Save Result : ' + chalk.green(succeed));
          console.log('Save Data : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
          res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
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
      console.log(chalk.green('=========== Edit UR ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      const jWhere = { urId: req.body.requestData.urId};
      console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mUR.findOne({where:jWhere}).then((db) => {
        console.log('UR => ' + chalk.blue(JSON.stringify(db)));
        if(util.chkDataFound(db)) {
          db
            .update(req.body.requestData)
            .then((succeed) => {
              console.log('Save Result : ' + chalk.green(succeed));
              console.log('VendorProfile : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
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
      console.log(chalk.green('=========== Delete UR ==========='));
      // console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
      // const jWhere = { UR_ID: req.body.requestData.userid};
      const jWhere = { urId: req.params.urId};
      console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
      console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

      mUR.findOne({where:jWhere}).then((db) => {
        console.log('UR => ' + chalk.blue(JSON.stringify(db)));
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
      console.log(chalk.green('=========== Query UR with Paging ==========='));
      console.log('Page : ' + chalk.blue(req.query.page));
      console.log('Count : ' + chalk.blue(req.query.count));
      console.log('query : ' + chalk.blue(req.query));
      console.log('typeof query : ' + chalk.blue(typeof req.query));
      // const os=0, lm=0;
      const jLimit={offset: null, limit: null};
      // console.log('jLimit : '+chalk.blue(JSON.stringify(jLimit)));
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
      // mUR.findAll({
      //   offset:os, limit:lm,
        // attributes: { include: [[cfg.sequelize.fn('COUNT', cfg.sequelize.col('*')), 'totalRecord']] }
        // attributes: [[cfg.sequelize.fn('COUNT', cfg.sequelize.col('UR_ID')), 'totalRecord']] 
      mUR.findAndCountAll(jLimit).then((db) => {
        console.log('UR : '+chalk.blue(JSON.stringify(db)));
        // console.log('UR typeof : ' + chalk.blue(typeof db));
        // console.log('count: ' + chalk.blue(db.count));
        // console.log('rows: ' + chalk.blue(db.rows));
        // console.log('rows.count: ' + chalk.blue(db.rows.length));
        if(util.chkDataFound(db.rows)) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,{"totalRecord":db.count,"userRequestList":db.rows}));
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
      console.log(chalk.green('=========== Query UR By Criteria ==========='));
      console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body.requestData, undefined, 2)));

      if(util.chkDataFound(req.body)){
        mUR.findAll({where:req.body.requestData}).then((db) => {
          console.log('rows.count: ' + chalk.blue(db.length));
          if(util.chkDataFound(db)) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,{"userRequestList":db}));
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
      console.log(chalk.green('=========== Query UR By Id ==========='));
      console.log('Request URL : ' + chalk.blue(req.url)); // /userRequestById/UR_ID=111
      console.log('req.params.urId : ' + chalk.blue(req.params.urId)); // /userRequestById/UR_ID=111

      const jWhere = { urId: req.params.urId};
      // mUR.findOne({where:jWhere, include:[{model:mUrWf, where: { urStatus: 'DM_APPROVAL' }}]}).then((db) => {
      mUR.findOne({where:jWhere, include:[{model:mUrWf,attributes:['wfId', 'urStatus','updateBy','updateTime','remark']}]}).then((db) => {
        console.log('UR : '+chalk.blue(JSON.stringify(db)));
        // console.log('UR typeof : ' + chalk.blue(typeof db));
        // console.log('db: ' + chalk.blue(db));
        if(util.chkDataFound(db)){
          let dbClone = JSON.parse(JSON.stringify(db));
          console.log('ur_workflows : '+chalk.blue(JSON.stringify(db.ur_workflows)));
          if(util.chkDataFound(db.ur_workflows)){
            console.log(chalk.green('=========== Yes ==========='));
            dbClone.urWorkflowList = db.ur_workflows;
            delete dbClone.ur_workflows;
          }else{
            console.log(chalk.green('=========== No ==========='));
            delete dbClone.ur_workflows;
            console.log('dbClone : '+chalk.blue(JSON.stringify(dbClone)));
          }
          res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,dbClone));
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

module.exports = userRequest;