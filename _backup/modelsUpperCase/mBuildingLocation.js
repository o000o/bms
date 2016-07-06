'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
// const mVendorProfile = require('./mVendorProfile');

const mBuildingLocation = mCfg.sequelize.define('building_location', {
	buildingId: { type: Sequelize.INTEGER, field: 'BUILDING_ID', primaryKey: true, autoIncrement: true, allowNull: false},
	buildingNo: { type: Sequelize.STRING, field: 'BUILDING_NO', allowNull: false},
	buildingName: { type: Sequelize.STRING, field: 'BUILDING_NAME', allowNull: false},
	titleDeeds: { type: Sequelize.STRING, field: 'TITLE_DEEDS', allowNull: true },
	road: { type: Sequelize.STRING, field: 'ROAD', allowNull: false},
	tumbol: { type: Sequelize.STRING, field: 'TUMBOL', allowNull: false},
	amphur: { type: Sequelize.STRING, field: 'AMPHUR', allowNull: false},
	province: { type: Sequelize.STRING, field: 'PROVINCE', allowNull: false},
	postalCode: { type: Sequelize.STRING, field: 'POSTAL_CODE', allowNull: false},
	region: { type: Sequelize.STRING, field: 'REGION', allowNull: false},
	location: { type: Sequelize.STRING, field: 'LOCATION', allowNull: true}
},{freezeTableName: true, timestamps: false});

// mVendorProfileContact.belongsTo(mVendorProfile, {foreignKey:'VENDOR_ID'});

module.exports = mBuildingLocation;