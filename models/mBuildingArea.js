'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
// const mVendorProfile = require('./mVendorProfile');

const mBuildingArea = mCfg.sequelize.define('building_area', {
	baId: { type: Sequelize.INTEGER, field: 'BA_ID', primaryKey: true, autoIncrement: true, allowNull: false},
	buildingId: { type: Sequelize.INTEGER, field: 'BUILDING_ID', allowNull: false},
	contractId: { type: Sequelize.STRING, field: 'CONTRACT_ID', allowNull: false},
	areaName: { type: Sequelize.STRING, field: 'AREA_NAME', allowNull: false },
	floor: { type: Sequelize.STRING, field: 'FLOOR', allowNull: false},
	homeNo: { type: Sequelize.STRING, field: 'HOME_NO', allowNull: true},
	meetingRoom: { type: Sequelize.INTEGER, field: 'MEETING_ROOM', allowNull: true},
	menToilet: { type: Sequelize.INTEGER, field: 'MEN_TOILET', allowNull: true},
	womenToilet: { type: Sequelize.INTEGER, field: 'WOMEN_TOILET', allowNull: true},
	areaSize: { type: Sequelize.INTEGER, field: 'AREA_SIZE', allowNull: false},
	unitArea: { type: Sequelize.STRING, field: 'UNIT_AREA', allowNull: false},
	empTotal: { type: Sequelize.INTEGER, field: 'EMP_TOTAL', allowNull: true}
},{freezeTableName: true, timestamps: false});

// mVendorProfileContact.belongsTo(mVendorProfile, {foreignKey:'VENDOR_ID'});

module.exports = mBuildingArea;