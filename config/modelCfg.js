'use strict'

const mCfg = module.exports = {}
const Sequelize = require('sequelize')
const cfg = require('./config')
const logger = require('../utils/logUtils')
const moment = require('moment-timezone')

const logdb = cfg.log.db ? logger.db : false

mCfg.timeZone = 'Asia/Bangkok'
// mCfg.timeFormat = cfg.timeFormat;

//**** Connect mySQL ****
mCfg.sequelize = new Sequelize(cfg.dbName, cfg.dbUser, cfg.dbPwd, {
// 	dialect: 'postgres', //'mysql',

// // mCfg.sequelize = new Sequelize('ooo', 'ooo', '000', {
  // host: '10.252.176.111',
// **** Connect msSQL ****
// mCfg.sequelize = new Sequelize('BMSDB', 'bmsadmin', 'P@ssw0rd', {
// mCfg.sequelize = new Sequelize(cfg.dbName, 'bmsadmin', 'P@ssw0rd', {
	dialect: 'mssql',
	// host: '10.252.163.130',
	port: 1433,
//************************
	host: cfg.dbHost,
	timezone:'+07:00',
	logging: logdb,
	benchmark: false,
	quoteIdentifiers: false,
	native:false,
	omitNull:true,
	protocol: 'tcp',
	retry:{max: 3},
	dialectOptions: {insecureAuth: true}, //Only need for pc connect
	pool: {
		max: cfg.poolMax,
		min: 0,
		idle: 10000,
	}
})

mCfg.correctTime = (varDate) => {
	if(varDate) return moment(varDate).tz(mCfg.timeZone).format(cfg.timeFormat)
	else return
}

mCfg.sequelize
  .authenticate()
  .then((err) => {
  	logger.db('===>Connection has been established successfully.')
    // console.log('Connection has been established successfully.');
  })
  .catch((err) => {
  	logger.db('===>Unable to connect to the database:'+ err)
    // console.log('Unable to connect to the database:', err);
  })
