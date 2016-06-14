'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
// const mVendorProfile = require('./mVendorProfile');

const mVendorProfileContact = mCfg.sequelize.define('vendor_profile_contact', {
	vendorContactId: { type: Sequelize.INTEGER, field: 'VENDOR_CONTACT_ID', primaryKey: true, autoIncrement: true, allowNull: false},
	vendorId: { type: Sequelize.INTEGER, field: 'VENDOR_ID', allowNull: false},
	vendorName: { type: Sequelize.STRING, field: 'VENDOR_NAME', allowNull: true},
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

// mVendorProfileContact.belongsTo(mVendorProfile, {foreignKey:'VENDOR_ID'});

module.exports = mVendorProfileContact;