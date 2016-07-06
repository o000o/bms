'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const mVendorProfile = require('./mVendorProfile');

// const mContract = cfg.sequelize.define('CONTRACT', {
const mContract = mCfg.sequelize.define('contract', {
	// CONTRACT_ID: { type: Sequelize.UUID , primaryKey: true, defaultValue: Sequelize.UUIDV1, allowNull: false},
	contractId: { type: Sequelize.STRING, field: 'contract_id', primaryKey: true, allowNull: false, defaultValue: Sequelize.fn('getcontractid')},
	vendorId: { type: Sequelize.INTEGER, field: 'vendor_id', allowNull: false },
	contractNo: { type: Sequelize.STRING, field: 'contract_no', allowNull: false},
	contractDate: { type: Sequelize.DATEONLY, field: 'contract_date', allowNull: false, 
		get: function() {return mCfg.correctTime(this.getDataValue('contractDate'));}
	},
	startDate: { type: Sequelize.DATEONLY, field: 'start_date', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('startDate'));}
	},
	endDate: { type: Sequelize.DATEONLY, field: 'end_date', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('endDate'));}
	},
	contractDuration: { type: Sequelize.STRING, field: 'contract_duration', allowNull: false },
	adminOwner: { type: Sequelize.STRING, field: 'admin_owner', allowNull: false},
	adminTeam: { type: Sequelize.STRING, field: 'admin_team', allowNull: false},
	contractStatus: { type: Sequelize.STRING, field: 'contract_status', allowNull: false},
	oldContractId: { type: Sequelize.STRING, field: 'old_contract_id', allowNull: true}
},{freezeTableName: true, timestamps: false});

mContract.belongsTo(mVendorProfile, {as:'vendorProfile', foreignKey:'vendorId', targetKey:'vendorId'});

module.exports = mContract;