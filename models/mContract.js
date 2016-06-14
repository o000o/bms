'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const mVendorProfile = require('./mVendorProfile');
const mVendorPC = require('./mVendorProfileContact');

// const mContract = cfg.sequelize.define('CONTRACT', {
const mContract = mCfg.sequelize.define('contract', {
	// CONTRACT_ID: { type: Sequelize.UUID , primaryKey: true, defaultValue: Sequelize.UUIDV1, allowNull: false},
	contractId: { type: Sequelize.STRING, field: 'CONTRACT_ID', primaryKey: true, allowNull: false},
	vendorId: { type: Sequelize.INTEGER, field: 'VENDOR_ID', allowNull: false },
	contractNo: { type: Sequelize.STRING, field: 'CONTRACT_NO', allowNull: false},
	contractDate: { type: Sequelize.DATE, field: 'CONTRACT_DATE', allowNull: false },
	startDate: { type: Sequelize.DATE, field: 'START_DATE', allowNull: false },
	endDate: { type: Sequelize.DATE, field: 'END_DATE', allowNull: false },
	contractDuration: { type: Sequelize.INTEGER, field: 'CONTRACT_DURATION', allowNull: false },
	rentalObj: { type: Sequelize.STRING, field: 'RENTAL_OBJ', allowNull: false},
	adminOwner: { type: Sequelize.STRING, field: 'ADMIN_OWNER', allowNull: false},
	contractStatus: { type: Sequelize.STRING, field: 'CONTRACT_STATUS', allowNull: false},
	approvalBy: { type: Sequelize.STRING, field: 'APPROVAL_BY', allowNull: true},
	approvalDate: { type: Sequelize.DATE, field: 'APPROVAL_DATE', allowNull: false},
	remark: { type: Sequelize.STRING, field: 'REMARK', allowNull: true},
	renewByContractId: { type: Sequelize.STRING, field: 'RENEW_BY_CONTRACT_ID', allowNull: true}
},{freezeTableName: true, timestamps: false});

mContract.belongsTo(mVendorProfile, {foreignKey:'VENDOR_ID'});
mContract.belongsTo(mVendorPC, {foreignKey:'VENDOR_ID'});

module.exports = mContract;