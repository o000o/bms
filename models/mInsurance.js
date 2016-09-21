'use strict'

const Sequelize = require('sequelize')
const mCfg = require('../config/modelCfg')
const cst = require('../config/constant')
const mDocument = require('./mDocument')

const mInsurance = mCfg.sequelize.define('insurance', {
	insuranceId: {type: Sequelize.INTEGER, field: 'insurance_id', primaryKey: true, allowNull: false, autoIncrement: true},
	buildingId: {type: Sequelize.INTEGER, field: 'building_id', allowNull: true},
	baId: {type: Sequelize.INTEGER, field: 'ba_id', allowNull: true},
	insuranceNo: {type: Sequelize.STRING, field: 'insurance_no', allowNull: false},
	insuranceDetail: {type: Sequelize.STRING, field: 'insurance_detail', allowNull: false},
	insuranceDate: {type: Sequelize.DATEONLY, field: 'insurance_date', allowNull: false//,
		//get: function() {return mCfg.correctTime(this.getDataValue('insuranceDate'))}
	},
	insuranceStart: {type: Sequelize.DATEONLY, field: 'insurance_start', allowNull: false//,
		//get: function() {return mCfg.correctTime(this.getDataValue('insuranceStart'))}
	},
	insuranceEnd: {type: Sequelize.DATEONLY, field: 'insurance_end', allowNull: false//,
		//get: function() {return mCfg.correctTime(this.getDataValue('insuranceEnd'))}
	},
	insurer: {type: Sequelize.STRING, allowNull: false},
	insured: {type: Sequelize.STRING, allowNull: false},
	insuranceType: {type: Sequelize.STRING, field: 'insurance_type', allowNull: false},
	sumInsured: {type: Sequelize.INTEGER, field: 'sum_insured', allowNull: false},
	premium: {type: Sequelize.DECIMAL, field: 'premium', allowNull: false},
	createBy: { type: Sequelize.STRING, field: 'create_by', allowNull: false},
        createDate: { type: Sequelize.DATEONLY, field: 'create_date', allowNull: false, defaultValue: Sequelize.NOW}
},{freezeTableName: true, timestamps: false})

mDocument.belongsTo(mInsurance, {as:cst.models.insurance,foreignKey:'insuranceId',targetKey:'insuranceId'})

module.exports = mInsurance
