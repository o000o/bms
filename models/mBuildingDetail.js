'use strict'
const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mBuildingDetail = mCfg.sequelize.define('building_detail', {
	buildingDetailId: {type: Sequelize.INTEGER, field: 'bd_id', primaryKey: true, autoIncrement: true, allowNull: false},
	buildingAreaId: {type: Sequelize.INTEGER, field: 'ba_id', allowNull: false},
	detailType: {type: Sequelize.STRING, field: 'detail_type', allowNull: false},
	valueType: {type: Sequelize.STRING, field: 'value_type', allowNull: false},
	value: {type: Sequelize.STRING, allowNull: false},
	//updateTime: {type: Sequelize.DATEONLY, field: 'update_time', allowNull: false, defaultValue: Sequelize.NOW//, 
		//get: function()  {return mCfg.correctTime(this.getDataValue('updateTime'));}
	//},
	//updateBy: {type: Sequelize.STRING, field: 'update_by', allowNull: false},
	createBy: { type: Sequelize.STRING, field: 'create_by', allowNull: false},
        createDate: { type: Sequelize.DATEONLY, field: 'create_date', allowNull: false, defaultValue: Sequelize.NOW}
},{freezeTableName: true, timestamps: false});

module.exports = mBuildingDetail;
