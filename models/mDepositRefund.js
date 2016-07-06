'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mDpRefund = mCfg.sequelize.define('deposit_refund', {
	cpId: {type: Sequelize.INTEGER, field: 'cp_id', primaryKey: true, allowNull: false},
	depositStatus: {type: Sequelize.STRING, field: 'deposit_status', allowNull: false},
	depositDetail: {type: Sequelize.STRING, field: 'deposit_detail', allowNull: false},
	receiveMethod: {type: Sequelize.STRING, field: 'receive_method', allowNull: false},
	receiveDate: {type: Sequelize.DATEONLY, field: 'receive_date', allowNull: false,
		get: function() {return mCfg.correctTime(this.getDataValue('receiveDate'));}
	},
	receiveAmount: {type: Sequelize.REAL, field: 'receive_amount', allowNull: false},
	receiveByUser: {type: Sequelize.STRING, field: 'receive_by_user', allowNull: false},
	depositRemark: {type: Sequelize.STRING, field: 'deposit_remark', allowNull: true}
},{freezeTableName: true, timestamps: false});

module.exports = mDpRefund;