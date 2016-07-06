'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const mVendorProfile = require('./mVendorProfile');

// const mContract = cfg.sequelize.define('CONTRACT', {
const mContract = mCfg.sequelize.define('contract', {
	// CONTRACT_ID: { type: Sequelize.UUID , primaryKey: true, defaultValue: Sequelize.UUIDV1, allowNull: false},
	contractId: { type: Sequelize.STRING, field: 'CONTRACT_ID', primaryKey: true, allowNull: false, defaultValue: Sequelize.fn('getcontractid')},
	vendorId: { type: Sequelize.INTEGER, field: 'VENDOR_ID', allowNull: true },
	contractNo: { type: Sequelize.STRING, field: 'CONTRACT_NO', allowNull: false},
	contractDate: { type: Sequelize.DATEONLY, field: 'CONTRACT_DATE', allowNull: false, 
		get: function() {return mCfg.correctTime(this.getDataValue('contractDate'));}
	},
	startDate: { type: Sequelize.DATEONLY, field: 'START_DATE', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('startDate'));}
	},
	endDate: { type: Sequelize.DATEONLY, field: 'END_DATE', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('endDate'));}
	},
	contractDuration: { type: Sequelize.STRING, field: 'CONTRACT_DURATION', allowNull: false },
	adminOwner: { type: Sequelize.STRING, field: 'ADMIN_OWNER', allowNull: false},
	adminTeam: { type: Sequelize.STRING, field: 'ADMIN_TEAM', allowNull: false},
	contractStatus: { type: Sequelize.STRING, field: 'CONTRACT_STATUS', allowNull: false},
	oldContractId: { type: Sequelize.STRING, field: 'OLD_CONTRACT_ID', allowNull: true}
},{freezeTableName: true, timestamps: false});

mContract.belongsTo(mVendorProfile, {as:'vendorProfile', foreignKey:'vendorId', targetKey:'vendorId'});
// mContract.belongsTo(mVendorProfile);

module.exports = mContract;