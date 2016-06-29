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
	timezone:'+07:00',
	logging: logger.db,
	// logging: console.log,
	// logging: false,
	dialect: 'mysql',
	host: cfg.dbHost,
//   host: '10.252.176.111',
//**** Connect msSQL ****
// config.sequelize = new Sequelize('BMSDB', 'bmsadmin', 'P@ssw0rd', {
// 	dialect: 'mssql',
// 	host: '10.252.163.130',
// 	port: 1433,

	protocol: 'tcp',
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
