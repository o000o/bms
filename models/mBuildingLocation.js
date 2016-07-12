'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const mBuildingArea = require('./mBuildingArea');
const mBuildingDetail = require('./mBuildingDetail');

const mBuildingLocation = mCfg.sequelize.define('building_location', {
	buildingId: { type: Sequelize.INTEGER, field: 'building_id', primaryKey: true, autoIncrement: true, allowNull: false},
	buildingNo: { type: Sequelize.STRING, field: 'building_no', allowNull: false},
	buildingName: { type: Sequelize.STRING, field: 'building_name', allowNull: false},
	titleDeeds: { type: Sequelize.STRING, field: 'title_deeds', allowNull: true },
	road: { type: Sequelize.STRING, allowNull: false},
	tumbol: { type: Sequelize.STRING, allowNull: false},
	amphur: { type: Sequelize.STRING, allowNull: false},
	province: { type: Sequelize.STRING, allowNull: false},
	postalCode: { type: Sequelize.STRING, field: 'postal_code', allowNull: false},
	region: { type: Sequelize.STRING, allowNull: false},
	location: { type: Sequelize.STRING, allowNull: true}
},{freezeTableName: true, timestamps: false});

mBuildingLocation.hasMany(mBuildingArea, {as:'areaList',foreignKey:{name:'buildingId',field:'building_id'}});
mBuildingArea.hasMany(mBuildingDetail, {as:'detailList',foreignKey:{name:'buildingAreaId',field:'ba_id'}});

module.exports = mBuildingLocation;