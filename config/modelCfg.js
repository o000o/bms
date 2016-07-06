'use strict'

const mCfg = module.exports = {};
const Sequelize = require('sequelize');
const cfg = require('./config');
const logger = require('../utils/logUtils');
const moment = require('moment-timezone');

mCfg.timeZone = 'Asia/Bangkok';
// mCfg.timeFormat = cfg.timeFormat;

//**** Connect mySQL ****
mCfg.sequelize = new Sequelize(cfg.dbName, cfg.dbUser, cfg.dbPwd, {
// mCfg.sequelize = new Sequelize('ooo', 'ooo', '000', {
	timezone:'+07:00',
	logging: logger.db,
	benchmark: false,
	// logging: console.log,
	// logging: false,
	// quoteIdentifiers: false,
	native:false,
	omitNull:true,
	dialect: 'postgres', //'mysql',
	host: cfg.dbHost,
  // host: '10.252.176.111',
//**** Connect msSQL ****
// config.sequelize = new Sequelize('BMSDB', 'bmsadmin', 'P@ssw0rd', {
// 	dialect: 'mssql',
// 	host: '10.252.163.130',
// 	port: 1433,

	protocol: 'tcp',
	retry:{max: 3},
	// dialectOptions: {insecureAuth: true}, //Only need for pc connect
	pool: {
		max: cfg.poolMax,
		min: 0,
		idle: 10000,
	}
});

mCfg.correctTime = (varDate) => {
	if(varDate) return moment(varDate).tz(mCfg.timeZone).format(cfg.timeFormat);
	else return;
};

mCfg.sequelize
  .authenticate()
  .then((err) => {
  	logger.db('===>Connection has been established successfully.');
    // console.log('Connection has been established successfully.');
  })
  .catch((err) => {
  	logger.db('===>Unable to connect to the database:'+ err);
    // console.log('Unable to connect to the database:', err);
  });
