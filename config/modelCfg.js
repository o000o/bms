'use strict'

const mCfg = module.exports = {};
const Sequelize = require('sequelize');
const cfg = require('../config/config');

//**** Connect mySQL ****
mCfg.sequelize = new Sequelize(cfg.dbName, cfg.dbUser, cfg.dbPwd, {
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
	max: 5,
	min: 0,
	idle: 10000,
	}
});
