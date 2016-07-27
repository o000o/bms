'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const cst = require('../config/constant');
const mVendorContact = require('./mVendorProfileContact');

const mVendorProfile = mCfg.sequelize.define('vendor_profile', {
	vendorId: { type: Sequelize.INTEGER, field: 'vendor_id', primaryKey: true, autoIncrement: true, allowNull: false},
	vendorType: { type: Sequelize.STRING, field: 'vendor_type', allowNull: false},
	taxId: { type: Sequelize.STRING, field: 'tax_id', allowNull: true },
	vendorName1: { type: Sequelize.STRING, field: 'vendor_name1', allowNull: false },
	vendorName2: { type: Sequelize.STRING, field: 'vendor_name2', allowNull: true },
	buildingName: { type: Sequelize.STRING, field: 'building_name', allowNull: true },
	buildingNo: { type: Sequelize.STRING, field: 'building_no', allowNull: true},
	floor: { type: Sequelize.STRING, allowNull: true},
	homeNo: { type: Sequelize.STRING, field: 'home_no', allowNull: true},
	road: { type: Sequelize.STRING, allowNull: false},
	tumbol: { type: Sequelize.STRING, allowNull: false},
	amphur: { type: Sequelize.STRING, allowNull: false},
	province: { type: Sequelize.STRING, allowNull: false},
	postalCode: { type: Sequelize.STRING, field: 'postal_code', allowNull: true},
	landline: { type: Sequelize.STRING, allowNull: false},
	mobileNo: { type: Sequelize.STRING, field: 'mobile_no', allowNull: true},
	fax: { type: Sequelize.STRING, allowNull: true},
	email: { type: Sequelize.STRING, allowNull: false},
	vendorCode: { type: Sequelize.STRING, allowNull: true}
},{freezeTableName: true, timestamps: false});

mVendorProfile.hasMany(mVendorContact, {as:cst.models.vendorContacts, foreignKey:'vendorId', targetKey:'vendorId'});

module.exports = mVendorProfile;