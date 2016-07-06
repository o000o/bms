'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mInsurance = mCfg.sequelize.define('insurance', {
	insuranceId: {type: Sequelize.INTEGER, field: 'insurance_id', primaryKey: true, allowNull: false, autoIncrement: true},
	buildingId: {type: Sequelize.INTEGER, field: 'building_id', allowNull: true},
	baId: {type: Sequelize.INTEGER, field: 'ba_id', allowNull: true},
	insuranceNo: {type: Sequelize.STRING, field: 'insurance_no', allowNull: false},
	insuranceDetail: {type: Sequelize.STRING, field: 'insurance_detail', allowNull: false},
	insuranceDate: {type: Sequelize.DATEONLY, field: 'insurance_date', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('insuranceDate'));}
	},
	insuranceStart: {type: Sequelize.DATEONLY, field: 'insurance_start', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('insuranceStart'));}
	},
	insuranceEnd: {type: Sequelize.DATEONLY, field: 'insurance_end', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('insuranceEnd'));}
	},
	insurer: {type: Sequelize.STRING, allowNull: false},
	insured: {type: Sequelize.STRING, allowNull: false},
	insuranceType: {type: Sequelize.STRING, field: 'insurance_type', allowNull: false},
	sumInsured: {type: Sequelize.INTEGER, field: 'sum_insured', allowNull: false}
},{freezeTableName: true, timestamps: false});

module.exports = mInsurance;