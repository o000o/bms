'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const cst = require('../config/constant');
const mVendorProfile = require('./mVendorProfile');
const mVendorContact = require('./mVendorProfileContact');
const mBuildingLocation = require('./mBuildingLocation');
const mBuildingArea = require('./mBuildingArea');
const mDocument = require('./mDocument');
const mPayment = require('./mContractPayment');
const mContractAgent = require('./mContractAgent');

const mContract = mCfg.sequelize.define('contract', {
	contractId: { type: Sequelize.STRING, field: 'contract_id', primaryKey: true, allowNull: true, autoIncrement: true},
	vendorId: { type: Sequelize.INTEGER, field: 'vendor_id', allowNull: true },
	contractNo: { type: Sequelize.STRING, field: 'contract_no', allowNull: false},
	createContractDate: { type: Sequelize.DATEONLY, field: 'create_contract_date', allowNull: false, defaultValue: Sequelize.NOW//,
		//get: function() {return mCfg.correctTime(this.getDataValue('createContractDate'));}
	},
	contractDate: { type: Sequelize.DATEONLY, field: 'contract_date', allowNull: false//,
		//get: function() {return mCfg.correctTime(this.getDataValue('contractDate'));}
	},
	startDate: { type: Sequelize.DATEONLY, field: 'start_date', allowNull: false//,
		//get: function() {return mCfg.correctTime(this.getDataValue('startDate'));}
	},
	endDate: { type: Sequelize.DATEONLY, field: 'end_date', allowNull: false//,
		//get: function() {return mCfg.correctTime(this.getDataValue('endDate'));}
	},
	contractDuration: { type: Sequelize.STRING, field: 'contract_duration', allowNull: false },
	adminOwner: { type: Sequelize.STRING, field: 'admin_owner', allowNull: false},
	adminTeam: { type: Sequelize.STRING, field: 'admin_team', allowNull: false},
	contractStatus: { type: Sequelize.STRING, field: 'contract_status', allowNull: false},
	oldContractId: { type: Sequelize.STRING, field: 'old_contract_id', allowNull: true},
	remark: { type: Sequelize.STRING, field: 'remark', allowNull: true}
},{freezeTableName: true, timestamps: false});

mContract.belongsTo(mVendorProfile, {as:cst.models.vendorProfile, foreignKey:'vendorId', targetKey:'vendorId'});
mContract.hasMany(mPayment, {as:cst.models.contractPayments, foreignKey:'contractId', targetKey:'contractId'});
mContract.hasMany(mDocument, {as:cst.models.documents, foreignKey:'contractId', targetKey:'contractId'});
mContract.belongsToMany(mBuildingLocation, {as:cst.models.locations, 
	through:{model:mBuildingArea, as:cst.models.area},//, unique: false}, constraints: false,
	foreignKey:'contractId', 
	otherKey:'buildingId'});
mContract.belongsToMany(mVendorContact, {as:cst.models.contractAgents, 
	through:{model:mContractAgent, as:cst.models.agent},
	foreignKey:'contractId', 
	otherKey:'vendorContactId'});

module.exports = mContract;
