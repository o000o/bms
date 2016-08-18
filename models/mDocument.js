'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mDocument = mCfg.sequelize.define('document', {
	documentId: {type: Sequelize.INTEGER, field: 'doc_id', primaryKey: true, allowNull: false, autoIncrement: true},
	buildingId: {type: Sequelize.INTEGER, field: 'building_id', allowNull: true},
	contractId: {type: Sequelize.STRING, field: 'contract_id', allowNull: true},
	buildingAreaId: {type: Sequelize.INTEGER, field: 'ba_id', allowNull: true},
	documentName: {type: Sequelize.STRING, field: 'doc_name', allowNull: false},
	documentVersion: {type: Sequelize.STRING, field: 'doc_version', allowNull: false},
	documentType: {type: Sequelize.STRING, field: 'doc_type', allowNull: false},
	documentStatus: {type: Sequelize.STRING, field: 'doc_status', allowNull: false},
	uploadDate: {type: Sequelize.DATEONLY, field: 'upload_date', allowNull: false//,
		//get: function() {return mCfg.correctTime(this.getDataValue('uploadDate'));}
	},
	uploadBy: {type: Sequelize.STRING, field: 'upload_by', allowNull: false},
	insuranceId: {type: Sequelize.INTEGER, field: 'insurance_id', allowNull: true}
},{freezeTableName: true, timestamps: false});

module.exports = mDocument;
