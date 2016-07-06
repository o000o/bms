'use strict'
const Sequelize = require('sequelize');
const cfg = require('../config/config');
const mContract = require('./mContract');
const mUrWf = require('./mUrWorkflow');

// const mUR = cfg.sequelize.define('USER_REQUEST', {
const mUR = cfg.sequelize.define('user_request', {
	urId: { type: Sequelize.STRING , primaryKey: true, field: 'UR_ID', allowNull: true},
	contractId: { type: Sequelize.STRING, field: 'CONTRACT_ID', allowNull: true},
	urDate: { type: Sequelize.DATE, field: 'UR_DATE', allowNull: false, defaultValue: Sequelize.NOW },
	// urDate: { type: Sequelize.DATE, field: 'UR_DATE', allowNull: false, 
	// 		// values: [cfg.sequelize.fn('date_format', cfg.sequelize.col('UR_DATE'), '%Y%m%d%H%i%s')]
	// 		    set      : function(val) {
 //      this.setDataValue('urDate', Sequelize.NOW);}
	// },
	urType: { type: Sequelize.STRING, field: 'UR_TYPE', allowNull: false},
	company: { type: Sequelize.STRING, field: 'COMPANY', allowNull: false },
	department: { type: Sequelize.STRING, field: 'DEPARTMENT', allowNull: true },
	urDetail: { type: Sequelize.STRING, field: 'UR_DETAIL', allowNull: false },
	expectDate: { type: Sequelize.DATE, field: 'EXPECT_DATE', allowNull: false,
 				get: function()  {
			      // 'this' allows you to access attributes of the instance
			      return 'expectDate';
			    },
    			set : function(val) {
   				   this.setDataValue('expectDate', "2016-06-30");
				}
	   
	},
	urBy: { type: Sequelize.STRING, field: 'UR_BY', allowNull: false},
	urStatus: { type: Sequelize.STRING, field: 'UR_STATUS', allowNull: false},
	rentalObjective: { type: Sequelize.STRING, field: 'RENTAL_OBJ', allowNull: true},
	areaSize: { type: Sequelize.INTEGER, field: 'AREA_SIZE', allowNull: true},
	unitArea: { type: Sequelize.STRING, field: 'UNIT_AREA', allowNull: true},
	empTotal: { type: Sequelize.INTEGER, field: 'EMP_TOTAL', allowNull: true},
	rentalDayAmount: { type: Sequelize.INTEGER, field: 'RENTAL_USE_AMOUNT', allowNull: true}
},{freezeTableName: true, timestamps: false});

// mUR.belongsTo(mContract, {foreignKey:'CONTRACT_ID'});
// mUR.belongsTo(mContract, {foreignKey:'UR_ID'});

module.exports = mUR;