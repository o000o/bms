'use strict'
// const response = require('../response/broadcastResponse.js');
const chalk = require('chalk');
const resp = require('../utils/respUtils');
const error = require('../config/error');
const mContract = require('../models/mContract');
const mVendorProfile = require('../models/mVendorProfile');
const mVendorPC = require('../models/mVendorProfileContact');

const contract = {

  add: (req, res) => {
    console.log(chalk.green('=========== Add contract ==========='));
    console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));

    mContract
      .build(req.body)
      .save()
      // .update(req.body)
      .then((succeed) => {
        console.log('Save Result : ' + chalk.green(succeed));
        res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
      }).catch((err) => {
        console.log('Error : ' + chalk.red(err));
        res.json(resp.getJsonError(error.code_01001,error.desc_01001));
      })
  },

  edit: (req, res) => {
    console.log(chalk.green('=========== Edit contract ==========='));
    console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
    const jWhere = { CONTRACT_ID: req.body.CONTRACT_ID};
    console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
    console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

    mContract.findOne({where:jWhere}).then((db) => {
      console.log('contract => ' + chalk.blue(JSON.stringify(db)));
      db
        .update(req.body)
        .then((succeed) => {
          console.log('Save Result : ' + chalk.green(succeed));
          res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
        }).catch((err) => { //No use unless it has error under .then(succeed)
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.code_01001,error.desc_01001));
        })
    }).catch((err) => {
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.code_01002,error.desc_01002));
    });
  },

  delete: (req, res) => {
    console.log(chalk.green('=========== Delete contract ==========='));
    console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
    // const jWhere = { userid: req.body.userid};
    // console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
    // console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

    mContract.findOne({where:req.body}).then((db) => {
      console.log('contract => ' + chalk.blue(JSON.stringify(db)));
      db
        .destroy()
        .then((succeed) => {
          console.log('Save Result : ' + chalk.green(succeed));
          res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000));
        }).catch((err) => { //No use unless it has error under .then(succeed)
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.code_01001,error.desc_01001));
        })
    }).catch((err) => {
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.code_01002,error.desc_01002));
    });
  },

  query: (req, res) => {
    console.log(chalk.green('=========== Query contract ==========='));
// const jWhere = { userid: 4};
    // mUser.findAll({where:jWhere}).then((users) => {
    mContract.findAll({include:[{model:mVendorProfile},{model:mVendorPC}]
    }).then((db) => {
      console.log('contract : '+chalk.blue(JSON.stringify(db)));
      console.log('contract typeof : ' + chalk.blue(typeof db));

      let json = resp.getJsonSuccess(error.code_00000,error.desc_00000,db);
      // console.log('auth.login response : ' + chalk.blue(JSON.stringify(json, undefined, 2)));
      res.json(json);
    }).catch((err) => {
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_01002,error.desc_01002));
    });

  }

};

module.exports = contract;