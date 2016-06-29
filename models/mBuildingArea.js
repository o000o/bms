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
	meetingRoomAmount: { type: Sequelize.INTEGER, field: 'MEETING_ROOM_AMOUNT', allowNull: true},
	menToiletAmount: { type: Sequelize.INTEGER, field: 'MEN_TOILET_AMOUNT', allowNull: true},
	womenToiletAmount: { type: Sequelize.INTEGER, field: 'WOMEN_TOILET_AMOUNT', allowNull: true},
	areaSize: { type: Sequelize.INTEGER, field: 'AREA_SIZE', allowNull: false},
	unitArea: { type: Sequelize.STRING, field: 'UNIT_AREA', allowNull: false},
	employeeTotal: { type: Sequelize.INTEGER, field: 'EMPLOYEE_AMOUNT', allowNull: true},
	rentalObjective: { type: Sequelize.STRING, field: 'RENTAL_OBJ', allowNull: false}
},{freezeTableName: true, timestamps: false});

// mVendorProfileContact.belongsTo(mVendorProfile, {foreignKey:'VENDOR_ID'});

module.exports = mBuildingArea;