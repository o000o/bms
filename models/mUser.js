'use strict'
const moment = require('moment-timezone');
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mUser = mCfg.sequelize.define('user_management', {
	userName: {type: Sequelize.STRING, field: 'username', primaryKey: true, allowNull: false},
	password: {type: Sequelize.STRING, allowNull: true},
	userType: {type: Sequelize.STRING, field: 'user_type', allowNull: false},
	createDate: {type: Sequelize.DATEONLY, field: 'create_date', allowNull: false,
		get: function()  {return mCfg.correctTime(this.getDataValue('createDate'));}
	},
	createBy: {type: Sequelize.STRING, field: 'create_by', allowNull: false},
	userStatus: {type: Sequelize.STRING, field: 'user_status', allowNull: false},
},{freezeTableName: true, timestamps: false});

module.exports = mUser;