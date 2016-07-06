'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mTrace = mCfg.sequelize.define('trace', {
	traceId: {type: Sequelize.INTEGER, field: 'trace_id', primaryKey: true, allowNull: false, autoIncrement: true},
	actionTimestamp: {type: Sequelize.DATEONLY, field: 'action_timestamp', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('actionTimestamp'));}
	},
	actionData: {type: Sequelize.STRING, field: 'action_data', allowNull: false},
	username: {type: Sequelize.STRING, allowNull: false},
	userType: {type: Sequelize.STRING, field: 'user_type', allowNull: false}
},{freezeTableName: true, timestamps: false});

module.exports = mTrace;