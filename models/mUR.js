'use strict'

const Sequelize = require('sequelize')
const mCfg = require('../config/modelCfg')
const cst = require('../config/constant')
const mUrWf = require('./mUrWorkFlow')

const mUR = mCfg.sequelize.define('user_request', {
	urId: {type: Sequelize.STRING , primaryKey: true, field: 'ur_id', allowNull: true, autoIncrement: true},
	urDate: {type: Sequelize.DATEONLY, field: 'ur_date', allowNull: false, defaultValue: Sequelize.NOW//, 
		//get: function()  {return mCfg.correctTime(this.getDataValue('urDate'))}
	},
	urType: {type: Sequelize.STRING, field: 'ur_type', allowNull: false},
	company: {type: Sequelize.STRING, allowNull: true },
	department: {type: Sequelize.STRING, allowNull: true },
	urDetail: {type: Sequelize.STRING, field: 'ur_detail', allowNull: false },
	expectDate: {type: Sequelize.DATEONLY, field: 'expect_date', allowNull: true//, 
		//get: function()  {return mCfg.correctTime(this.getDataValue('expectDate'))}
	},
	urBy: {type: Sequelize.STRING, field: 'ur_by', allowNull: false},
	urStatus: {type: Sequelize.STRING, field: 'ur_status', allowNull: false},
	rentalObjective: {type: Sequelize.STRING, field: 'rental_obj', allowNull: true},
	areaSize: {type: Sequelize.REAL, field: 'area_size', allowNull: true},
	unitArea: {type: Sequelize.STRING, field: 'unit_area', allowNull: true},
	empTotal: {type: Sequelize.INTEGER, field: 'emp_total', allowNull: true},
	outsourceEmpTotal: {type: Sequelize.INTEGER, field: 'outsource_emp_total', allowNull: true},
	rentalDayAmount: {type: Sequelize.STRING, field: 'rental_use_amount', allowNull: true},
	amphur: {type: Sequelize.STRING, allowNull: true},
	province: {type: Sequelize.STRING, allowNull: true},
	region: {type: Sequelize.STRING, allowNull: true},
	contractId: {type: Sequelize.STRING, field: 'contract_id', allowNull: true},
	userDepartment: {type: Sequelize.STRING, field: 'user_department', allowNull: true},
	userEmail: {type: Sequelize.STRING, field: 'user_email', allowNull: true},
	userName: {type: Sequelize.STRING, field: 'user_name', allowNull: true},
	userSurname: {type: Sequelize.STRING, field: 'user_surname', allowNull: true}
},{freezeTableName: true, timestamps: false})

mUR.hasMany(mUrWf, {as:cst.models.urWorkflows,foreignKey:'urId', targetKey:'urId'})

// mUR.hasMany(mUrWf, {foreignKey:'ur_id'}) //work
// mUR.hasMany(mUrWf, {as:'urWorkflowList', foreignKey:'urId', targetKey:'urId'}) //work
// mUrWf.belongsTo(mUR, {foreignKey:'urId', targetKey:'urId'})
// mUR.hasMany(mUrWf, { as:'ooo',foreignKey:'UR_ID'}) //Error
// mUR.hasMany(mUrWf) //add "userRequestUrId" which not exist in mUrWf
// mUR.hasMany(mUrWf) //Error : SequelizeDatabaseError: ER_BAD_FIELD_ERROR: Unknown column 'ur_workflows.userRequestUrId' in 'field list'
// mUrWf.hasMany(mUR, { foreignKey:'UR_ID'}) //Error : Error: ur_workflow is not associated to user_request!
// mUR.belongsToMany(mUrWf, {through: 'ur_workflow',foreignKey:'UR_ID'})

module.exports = mUR
