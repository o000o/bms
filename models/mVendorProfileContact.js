'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mVendorProfileContact = mCfg.sequelize.define('vendor_profile_contact', {
	vendorContactId: { type: Sequelize.INTEGER, field: 'vendor_contact_id', primaryKey: true, autoIncrement: true, allowNull: false},
	vendorId: { type: Sequelize.INTEGER, field: 'vendor_id', allowNull: false},
	vendorName: { type: Sequelize.STRING, field: 'vendor_name', allowNull: true},
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
	email: { type: Sequelize.STRING, allowNull: false}
},{freezeTableName: true, timestamps: false});

module.exports = mVendorProfileContact;