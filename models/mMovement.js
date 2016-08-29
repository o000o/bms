'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mMovement = mCfg.sequelize.define('location_movement', {
	movementId: {type: Sequelize.INTEGER, field: 'lm_id', primaryKey: true, allowNull: false, autoIncrement: true},
	urId: {type: Sequelize.STRING, field: 'ur_id', allowNull: false},
	buildingAreaId: {type: Sequelize.INTEGER, field: 'ba_id', allowNull: false},
	movementType: {type: Sequelize.STRING, field: 'movement_type', allowNull: false},
	movementDate: {type: Sequelize.DATEONLY, field: 'movement_date', allowNull: false},
  createDate: {type: Sequelize.DATEONLY, field: 'create_date', allowNull:false, defaultValue:Sequelize.NOW},
	createBy: { type: Sequelize.STRING, field: 'create_by', allowNull: false},
	assignSpace: {type: Sequelize.REAL, field: 'assign_space', allowNull: true},
	unitArea: {type: Sequelize.STRING, field: 'unit_area', allowNull: true}
},{freezeTableName: true, timestamps: false})

module.exports = mMovement;
