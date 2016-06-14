'use strict'
// const response = require('../response/broadcastResponse.js');
const chalk = require('chalk');
const resp = require('../utils/respUtils');
const error = require('../config/error');
// const mContract = require('../models/mContract');
const mVendorProfile = require('../models/mVendorProfile');

const vendorProfile = {

  add: (req, res) => {
    console.log(chalk.green('=========== Add VendorProfile ==========='));
    console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
    const jWhere = { VENDOR_TYPE: req.body.VENDOR_TYPE, VENDOR_NAME1: req.body.VENDOR_NAME1};
    console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
    console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

    mVendorProfile
      .findOrCreate({where:jWhere, defaults:req.body})
      .spread((db,succeed) => {
        console.log('Save Result : ' + chalk.green(succeed));
        console.log('VendorProfile : ' + chalk.blue(JSON.stringify(db, undefined, 2)));
        if(succeed) res.json(resp.getJsonSuccess(error.code_00000,error.desc_00000,db));
        else res.json(resp.getJsonSuccess(error.code_01004,error.desc_01004,db));
      }).catch((err) => {
        console.log('Error : ' + chalk.red(err));
        res.json(resp.getJsonError(error.code_01001,error.desc_01001));
      })
  },

  edit: (req, res) => {
    console.log(chalk.green('=========== Edit VendorProfile ==========='));
    console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
    const jWhere = { VENDOR_ID: req.body.VENDOR_ID};
    console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
    console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

    mVendorProfile.findOne({where:jWhere}).then((db) => {
      console.log('contract => ' + chalk.blue(JSON.stringify(db)));
      db
        .update(req.body)
        .then((succeed) => {
          console.log('Save Result : ' + chalk.green(succeed));
          console.log('VendorProfile : ' + chalk.blue(JSON.stringify(succeed, undefined, 2)));
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
    console.log(chalk.green('=========== Delete VendorProfile ==========='));
    console.log('Request Body : ' + chalk.blue(JSON.stringify(req.body, undefined, 2)));
    // const jWhere = { userid: req.body.userid};
    // console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
    // console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

    mVendorProfile.findOne({where:req.body}).then((db) => {
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
    console.log(chalk.green('=========== Query VendorProfile ==========='));
// const jWhere = { userid: 4};
    // mUser.findAll({where:jWhere}).then((users) => {
    mVendorProfile.findAll().then((db) => {
      console.log('VendorProfile : '+chalk.blue(JSON.stringify(db)));
      console.log('VendorProfile typeof : ' + chalk.blue(typeof db));

      let json = resp.getJsonSuccess(error.code_00000,error.desc_00000,db);
      // console.log('auth.login response : ' + chalk.blue(JSON.stringify(json, undefined, 2)));
      res.json(json);
    }).catch((err) => {
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.code_01002,error.desc_01002));
    });

  }

};

module.exports = vendorProfile;