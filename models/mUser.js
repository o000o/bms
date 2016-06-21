'use strict'
const moment = require('moment-timezone');
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

// const mUser = cfg.sequelize.define('USER_MANAGEMENT', {
const mUser = mCfg.sequelize.define('user_management', {
  // userId: {type: Sequelize.INTEGER, field: 'USER_ID', primaryKey: true, allowNull: false, autoIncrement: true},//, autoIncrement: true},
	userName: {type: Sequelize.STRING, field: 'USERNAME', primaryKey: true, allowNull: false},
	password: {type: Sequelize.STRING, field: 'PASSWORD', allowNull: true},
	userType: {type: Sequelize.STRING, field: 'USER_TYPE', allowNull: false},
	createDate: {type: Sequelize.DATEONLY, field: 'CREATE_DATE', allowNull: false,
		get: function()  {return mCfg.correctTime(this.getDataValue('createDate'));}
	},
	createBy: {type: Sequelize.STRING, field: 'CREATE_BY', allowNull: false},
	userStatus: {type: Sequelize.STRING, field: 'USER_STATUS', allowNull: false},
},{freezeTableName: true, timestamps: false});

module.exports = mUser;