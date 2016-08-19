'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mBuildingArea = mCfg.sequelize.define('building_area', {
	buildingAreaId: {type: Sequelize.INTEGER, field: 'ba_id', primaryKey: true, autoIncrement: true, allowNull: false},
	buildingId: {type: Sequelize.INTEGER, field: 'building_id', allowNull: false},
	contractId: {type: Sequelize.STRING, field: 'contract_id', allowNull: false},
	areaName: {type: Sequelize.STRING, field: 'area_name', allowNull: false },
	floor: {type: Sequelize.STRING, allowNull: false},
	homeNo: {type: Sequelize.STRING, field: 'home_no', allowNull: true},
	// meetingRoomAmount: { type: Sequelize.INTEGER, field: 'MEETING_ROOM_AMOUNT', allowNull: true},
	// menToiletAmount: { type: Sequelize.INTEGER, field: 'MEN_TOILET_AMOUNT', allowNull: true},
	// womenToiletAmount: { type: Sequelize.INTEGER, field: 'WOMEN_TOILET_AMOUNT', allowNull: true},
	areaSize: {type: Sequelize.INTEGER, field: 'area_size', allowNull: false},
	availableSpace: {type: Sequelize.INTEGER, field: 'available_space', allowNull: true},
	unitArea: {type: Sequelize.STRING, field: 'unit_area', allowNull: false},
	// employeeTotal: { type: Sequelize.INTEGER, field: 'EMPLOYEE_AMOUNT', allowNull: true},
	rentalObjective: {type: Sequelize.STRING, field: 'rental_obj', allowNull: true},
	createBy: { type: Sequelize.STRING, field: 'create_by', allowNull: false},
        createDate: { type: Sequelize.DATEONLY, field: 'create_date', allowNull: false, defaultValue: Sequelize.NOW}
},{freezeTableName: true, timestamps: false});

module.exports = mBuildingArea;
