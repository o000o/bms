'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');
const mContract = require('./mContract');
const mUrWf = require('./mUrWorkFlow');

// const mUR = cfg.sequelize.define('USER_REQUEST', {
const mUR = mCfg.sequelize.define('user_request', {
	urId: { type: Sequelize.STRING , primaryKey: true, field: 'UR_ID', allowNull: true},
	contractId: { type: Sequelize.STRING, field: 'CONTRACT_ID', allowNull: true},
	urDate: { type: Sequelize.DATEONLY, field: 'UR_DATE', allowNull: false, defaultValue: Sequelize.NOW, 
		get: function()  {
		    // return moment(this.getDataValue('urDate')).tz(mCfg.timeZone).format(mCfg.timeFormat);
		    return mCfg.correctTime(this.getDataValue('urDate'));
	    }
	},
	urType: { type: Sequelize.STRING, field: 'UR_TYPE', allowNull: false},
	company: { type: Sequelize.STRING, field: 'COMPANY', allowNull: false },
	department: { type: Sequelize.STRING, field: 'DEPARTMENT', allowNull: true },
	urDetail: { type: Sequelize.STRING, field: 'UR_DETAIL', allowNull: false },
	expectDate: { type: Sequelize.DATEONLY, field: 'EXPECT_DATE', allowNull: false, 
		get: function()  {return mCfg.correctTime(this.getDataValue('expectDate'));}
	},
	urBy: { type: Sequelize.STRING, field: 'UR_BY', allowNull: false},
	urStatus: { type: Sequelize.STRING, field: 'UR_STATUS', allowNull: false},
	rentalObjective: { type: Sequelize.STRING, field: 'RENTAL_OBJ', allowNull: true},
	areaSize: { type: Sequelize.INTEGER, field: 'AREA_SIZE', allowNull: true},
	unitArea: { type: Sequelize.STRING, field: 'UNIT_AREA', allowNull: true},
	empTotal: { type: Sequelize.INTEGER, field: 'EMP_TOTAL', allowNull: true},
	rentalDayAmount: { type: Sequelize.STRING, field: 'RENTAL_USE_AMOUNT', allowNull: true}
},{freezeTableName: true, timestamps: false});

// mUR.belongsTo(mContract, {foreignKey:'CONTRACT_ID'});
mUR.hasMany(mUrWf, { foreignKey:'UR_ID' }); //work
// mUR.hasMany(mUrWf); //Error : SequelizeDatabaseError: ER_BAD_FIELD_ERROR: Unknown column 'ur_workflows.userRequestUrId' in 'field list'
// mUrWf.hasMany(mUR, { foreignKey:'UR_ID'}); //Error : Error: ur_workflow is not associated to user_request!
// mUR.belongsToMany(mUrWf, {through: 'ur_workflow',foreignKey:'UR_ID'});

module.exports = mUR;