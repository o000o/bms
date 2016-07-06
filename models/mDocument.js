'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mDocument = mCfg.sequelize.define('document', {
	docId: {type: Sequelize.INTEGER, field: 'doc_id', primaryKey: true, allowNull: false, autoIncrement: true},
	buildingId: {type: Sequelize.INTEGER, field: 'building_id', allowNull: true},
	contractId: {type: Sequelize.STRING, field: 'contract_id', allowNull: true},
	baId: {type: Sequelize.INTEGER, field: 'ba_id', allowNull: true},
	docName: {type: Sequelize.STRING, field: 'doc_name', allowNull: false},
	docVersion: {type: Sequelize.STRING, field: 'doc_version', allowNull: false},
	docType: {type: Sequelize.STRING, field: 'doc_type', allowNull: false},
	uploadDate: {type: Sequelize.DATEONLY, field: 'upload_date', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('uploadDate'));}
	},
	docStatus: {type: Sequelize.STRING, field: 'doc_status', allowNull: false},
	uploadBy: {type: Sequelize.STRING, field: 'upload_by', allowNull: false}
},{freezeTableName: true, timestamps: false});

module.exports = mDocument;