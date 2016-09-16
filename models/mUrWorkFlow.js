'use strict'
const moment = require('moment-timezone')
const Sequelize = require('sequelize')
const mCfg = require('../config/modelCfg')

const mUrWf = mCfg.sequelize.define('ur_workflow', {
	wfId: {type: Sequelize.INTEGER , primaryKey: true, field: 'wf_id', allowNull: false, autoIncrement: true},
	urId: {type: Sequelize.STRING , field: 'ur_id', allowNull: false},
	urStatus: {type: Sequelize.STRING, field: 'ur_status', allowNull: false},
	updateBy: {type: Sequelize.STRING, field: 'update_by', allowNull: false},
	updateTime: {type: Sequelize.DATEONLY, field: 'update_time', allowNull: false, 
		defaultValue: Sequelize.NOW//, get: function()  {return mCfg.correctTime(this.getDataValue('updateTime'))}
	},
	remark: {type: Sequelize.STRING, allowNull: true},
	department: {type: Sequelize.STRING, allowNull: true},
	userEmail: {type: Sequelize.STRING, field: 'user_email', allowNull: true},
        userName: {type: Sequelize.STRING, field: 'user_name', allowNull: true},
        userSurname: {type: Sequelize.STRING, field: 'user_surname', allowNull: true}
},{freezeTableName: true, timestamps: false})

module.exports = mUrWf
