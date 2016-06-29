'use strict'

const jwt = require('jwt-simple');
const chalk = require('chalk');
const Sequelize = require('sequelize');
const mUser = require('../models/mUser');
const resp = require('../utils/respUtils');
// var validateUser = require('../routes/auth').validateUser;

module.exports = (req, res, next) => {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  // var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  // var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-userTokenId'];
  // var token =  req.headers('x-userTokenId');
  let flagT = 0;
  try {
    // console.log('===========oooooo===========');
    // console.log('req.body : '+chalk.blue(req.body));
    // console.log('req.body.access_token : '+chalk.blue(req.body.access_token));
    // console.log('req.query : '+chalk.blue(req.query));
    // console.log('req.query.access_token : '+chalk.blue(req.query.access_token));
    // console.log('req.body.x_key : '+chalk.blue(req.body.x_key));
    // console.log('req.query.x_key : '+chalk.blue(req.query.x_key));
    // console.log('x-access-token: '+chalk.blue(req.headers['x-access-token']));

    // let token = req.header['x-userTokenId'];
    let token = req.header('x-userTokenId');
    console.log('Token : '+chalk.blue(token));

    // if (token || key) {
    if (token) {
      flagT = 1;
      // console.log('===========token===========');
      const decoded = jwt.decode(token, require('../config/secret.js')());
      // console.log('===========oooooo===========');
      // console.log('userId : '+chalk.blue(decoded.userId));
      // console.log('userName : '+chalk.blue(decoded.userName));
      // console.log('password : '+chalk.blue(decoded.password));
      // console.log('exp : '+chalk.blue(decoded.exp));

      if (decoded.exp <= Date.now()) {
        res.status(401);
        res.json({
          // responseStatus: {
            "status": 401,
            "message": "Token Expired"
          // }
        });
        return;
      }

      // Authorize the user to see if s/he can access our resources
        const jWhere = { USERNAME: decoded.userName};
        console.log('jWhere typeof : ' + chalk.blue(typeof jWhere));
        console.log('jWhere : '+chalk.blue(JSON.stringify(jWhere)));

        mUser.findOne({where:jWhere}).then((user) => {
      // mUser.findOne({_id:decoded.userId, userName:decoded.userName, password:decoded.password}, (err, user) => {
      // mUser.findOne({_id:decoded.userId}, (err, user) => {
        // if (!err) {
        if(user!=null) {
          // console.log('auth.login query result user : '+chalk.blue(user));
          if(user != null || req.method == "OPTIONS" || req.url == "/bms/logout/user" || req.url == "/bms/login/user"){
            console.log(chalk.blue('Goto auth'));
            next(); // To move to next middleware
          }else{
            res.status(401);
            res.json({
              //responseStatus: {
                "status": 401,
                "message": "Invalid User"
              //}
            });
            return;
          }
          
        }else{
          console.log('===========oooooo===========');
          res.status(401);
          res.json({
            //responseStatus: {
              "status": 401,
              "message": "Invalid User"
            //}
          });
          return;
        }
      }).catch((err) => {
        console.log('Error : ' + chalk.red(err));
          // res.json(resp.getJsonError(error.code_00004,error.desc_00004));
        res.status(401);
        res.json({
          // responseStatus: {
            "status": 401,
            "message": "Invalid User"
          // }
        });
      });
    } else {
      if(req.method == "OPTIONS" || req.url == "/bms/login/user"){
        console.log(chalk.blue('Goto auth'));
        next(); // To move to next middleware
      }else{
        console.log(chalk.blue('Invalid Token'));
        resp.getInvalidToken(res);
        // res.status(401);
        // res.json({
        //   "responseStatus": {
        //     "status": 401,
        //     "message": "Invalid Token"
        //   }
        // });
        return;
      }

    }

  } catch (err) {
    console.log('catch err : '+chalk.red(err.message));
    console.log('flag Token : '+chalk.blue(flagT));
    if (flagT) {
      resp.getInvalidToken(res);
      // res.status(401);
      // res.json({
      //   // responseStatus: {
      //     "status": 401,
      //     "message": "Invalid Token"
      //   // }
      // });
    }else{
      res.status(500);
      res.json({
        // responseStatus: {
          "status": 500,
          "message": "Oops something went wrong",
          "error": err.message
        // }
      }); 
    }

  }

};
