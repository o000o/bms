'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const mVendorPC = require('./mVendorProfileContact');

// const mVendorProfile = cfg.sequelize.define('VENDOR_PROFILE', {
const mVendorProfile = mCfg.sequelize.define('vendor_profile', {
	vendorId: { type: Sequelize.INTEGER, field: 'VENDOR_ID', primaryKey: true, autoIncrement: true, allowNull: false},
	vendorType: { type: Sequelize.STRING, field: 'VENDOR_TYPE', allowNull: false},
	taxId: { type: Sequelize.STRING, field: 'TAX_ID', allowNull: true },
	vendorName1: { type: Sequelize.STRING, field: 'VENDOR_NAME1', allowNull: false },
	vendorName2: { type: Sequelize.STRING, field: 'VENDOR_NAME2', allowNull: true },
	buildingName: { type: Sequelize.STRING, field: 'BUILDING_NAME', allowNull: true },
	buildingNo: { type: Sequelize.STRING, field: 'BUILDING_NO', allowNull: true},
	floor: { type: Sequelize.STRING, field: 'FLOOR', allowNull: true},
	homeNo: { type: Sequelize.STRING, field: 'HOME_NO', allowNull: true},
	road: { type: Sequelize.STRING, field: 'ROAD', allowNull: false},
	tumbol: { type: Sequelize.STRING, field: 'TUMBOL', allowNull: false},
	amphur: { type: Sequelize.STRING, field: 'AMPHUR', allowNull: false},
	province: { type: Sequelize.STRING, field: 'PROVINCE', allowNull: false},
	postalCode: { type: Sequelize.STRING, field: 'POSTAL_CODE', allowNull: true},
	landline: { type: Sequelize.STRING, field: 'LANDLINE', allowNull: false},
	mobileNo: { type: Sequelize.STRING, field: 'MOBILE_NO', allowNull: true},
	fax: { type: Sequelize.STRING, field: 'FAX', allowNull: true},
	email: { type: Sequelize.STRING, field: 'EMAIL', allowNull: false}
},{freezeTableName: true, timestamps: false});

mVendorProfile.hasMany(mVendorPC, { foreignKey:'VENDOR_ID' });

module.exports = mVendorProfile;