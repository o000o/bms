'use strict'
const moment = require('moment-timezone');
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
// const mUR = require('./mUR');

const mUrWf = mCfg.sequelize.define('ur_workflow', {
	wfId: { type: Sequelize.INTEGER , primaryKey: true, field: 'WF_ID', allowNull: false, autoIncrement: true},
	urId: { type: Sequelize.STRING , field: 'UR_ID', allowNull: false},
	urStatus: { type: Sequelize.STRING, field: 'UR_STATUS', allowNull: false},
	updateBy: { type: Sequelize.STRING, field: 'UPDATE_BY', allowNull: false},
	updateTime: { type: Sequelize.DATEONLY, field: 'UPDATE_TIME', allowNull: false, 
		defaultValue: Sequelize.NOW, get: function()  {return mCfg.correctTime(this.getDataValue('updateTime'));}
	},
	remark: { type: Sequelize.STRING, field: 'REMARK', allowNull: true}
},{freezeTableName: true, timestamps: false});

// mUR.belongsTo(mUrWf, {foreignKey:'UR_ID'});
// mUrWf.hasMany(mUR, { foreignKey:'UR_ID'}); //Error: ur_workflow.hasMany called with something that's not an instance of Sequelize.Model
// mUR.hasMany(mUrWf, { foreignKey:'UR_ID'}); //TypeError: mUR.hasMany is not a function

module.exports = mUrWf;