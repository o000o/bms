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
      // .build(req.body)
      // .save()
      // .update(req.body)
      // .then((succeed) => {
/**
jWhere typeof : object
jWhere : {"VENDOR_TYPE":"ccc","VENDOR_NAME1":"ccc"}
Executing (default): INSERT INTO [VENDOR_PROFILE] ([VENDOR_TYPE],[TAX_ID],[VENDOR_NAME1],[VENDOR_NAME2],
[BUILDING_NAME],[BUILDING_NO],[FLOOR],[HOME_NO],[ROAD],[TUMBOL],[AMPHUR],[PROVINCE],[POSTAL_CODE],[LANDLINE],
[MOBILE_NO],[FAX],[EMAIL]) OUTPUT INSERTED.* VALUES (N'ccc',N'ooo',N'ccc',N'ooo',N'ooo',N'ooo',
N'ooo',N'ooo',N'ooo',N'ooo',N'ooo',N'ooo',N'ooo',N'ooo',N'ooo',N'ooo',N'ooo');
Save Result : [object SequelizeInstance:VENDOR_PROFILE]
VendorProfile : {
  "VENDOR_ID": 4,
  "VENDOR_TYPE": "ccc",
  "TAX_ID": "ooo",
  "VENDOR_NAME1": "ccc",
  "VENDOR_NAME2": "ooo",
  "BUILDING_NAME": "ooo",
  "BUILDING_NO": "ooo",
  "FLOOR": "ooo",
  "HOME_NO": "ooo",
  "ROAD": "ooo",
  "TUMBOL": "ooo",
  "AMPHUR": "ooo",
  "PROVINCE": "ooo",
  "POSTAL_CODE": "ooo",
  "LANDLINE": "ooo",
  "MOBILE_NO": "ooo",
  "FAX": "ooo",
  "EMAIL": "ooo"
}
POST /bms/vendorProfile 200 199.234 ms - 72
**/
      .findOrCreate({where:jWhere, defaults:req.body})
      .spread((db,succeed) => {
        console.log('Save Result : ' + chalk.green(succeed));
        console.log('VendorProfile : ' + chalk.blue(JSON.stringify(db, undefined, 2)));
        if(succeed) res.json(resp.getJsonSuccess(error.err_00000,error.desc_00000,db));
        else res.json(resp.getJsonSuccess(error.err_db00004,error.desc_db00004,db));
/**
jWhere typeof : object
jWhere : {"VENDOR_TYPE":"ddd","VENDOR_NAME1":"ddd"}
Executing (default): BEGIN TRANSACTION;
Executing (default): SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
Executing (default): SELECT [VENDOR_ID], [VENDOR_TYPE], [TAX_ID], [VENDOR_NAME1]
, [VENDOR_NAME2], [BUILDING_NAME], [BUILDING_NO], [FLOOR], [HOME_NO], [ROAD], [TUMBOL], 
[AMPHUR], [PROVINCE], [POSTAL_CODE], [LANDLINE], [MOBILE_NO], [FAX], [EMAIL] 
FROM [VENDOR_PROFILE] AS [VENDOR_PROFILE] WHERE [VENDOR_PROFILE].[VENDOR_TYPE] = N'ddd' 
AND [VENDOR_PROFILE].[VENDOR_NAME1] = N'ddd' ORDER BY [VENDOR_ID] OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
Executing (default): COMMIT TRANSACTION;
Save Result : false
VendorProfile : {
  "VENDOR_ID": 5,
  "VENDOR_TYPE": "ddd",
  "TAX_ID": "ooo",
  "VENDOR_NAME1": "ddd",
  "VENDOR_NAME2": "ooo",
  "BUILDING_NAME": "ooo",
  "BUILDING_NO": "ooo",
  "FLOOR": "ooo",
  "HOME_NO": "ooo",
  "ROAD": "ooo",
  "TUMBOL": "ooo",
  "AMPHUR": "ooo",
  "PROVINCE": "ooo",
  "POSTAL_CODE": "ooo",
  "LANDLINE": "ooo",
  "MOBILE_NO": "ooo",
  "FAX": "ooo",
  "EMAIL": "ooo"
}
POST /bms/vendorProfile 200 165.730 ms - 72
**/
      }).catch((err) => {
        console.log('Error : ' + chalk.red(err));
        res.json(resp.getJsonError(error.err_db00001,error.desc_db00001));
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
          res.json(resp.getJsonSuccess(error.err_00000,error.desc_00000));
        }).catch((err) => { //No use unless it has error under .then(succeed)
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.err_db00001,error.desc_db00001));
        })
    }).catch((err) => {
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.err_db00002,error.desc_db00002));
    });
  },

  del: (req, res) => {
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
          res.json(resp.getJsonSuccess(error.err_00000,error.desc_00000));
        }).catch((err) => { //No use unless it has error under .then(succeed)
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.err_db00001,error.desc_db00001));
        })
    }).catch((err) => {
          console.log('Error : ' + chalk.red(err));
          res.json(resp.getJsonError(error.err_db00002,error.desc_db00002));
    });
  },

  query: (req, res) => {
    console.log(chalk.green('=========== Query VendorProfile ==========='));
// const jWhere = { userid: 4};
    // mUser.findAll({where:jWhere}).then((users) => {
    mVendorProfile.findAll().then((db) => {
      console.log('VendorProfile : '+chalk.blue(JSON.stringify(db)));
      console.log('VendorProfile typeof : ' + chalk.blue(typeof db));

      let json = resp.getJsonSuccess(error.err_00000,error.desc_00000,db);
      // console.log('auth.login response : ' + chalk.blue(JSON.stringify(json, undefined, 2)));
      res.json(json);
    }).catch((err) => {
      console.log('Error : ' + chalk.red(err));
      res.json(resp.getJsonError(error.err_db00002,error.desc_db00002));
    });

  }

};

module.exports = vendorProfile;