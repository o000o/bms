'use strict'

const Sequelize = require('sequelize')
const mCfg = require('../config/modelCfg')

const mCtPayment = mCfg.sequelize.define('contract_payment', {
	contractPaymentId: {type: Sequelize.INTEGER, field:'cp_id', primaryKey: true, allowNull: false, autoIncrement: true},
	contractId: {type: Sequelize.STRING, field:'contract_id', primaryKey: true, allowNull: true},
	paymentType: {type: Sequelize.STRING, field:'payment_type', allowNull: false},
	paymentDetail: {type: Sequelize.STRING, field:'payment_detail', allowNull: true},
	startDate: {type: Sequelize.DATEONLY, field:'start_date', allowNull: true//,
		//get: function() {return mCfg.correctTime(this.getDataValue('startDate'))}
	},
	endDate: {type: Sequelize.DATEONLY, field:'end_date', allowNull: true//,
		//get: function() {return mCfg.correctTime(this.getDataValue('endDate'))}
	},
	price: {type: Sequelize.REAL, allowNull: true},
	priceIncVat: {type: Sequelize.REAL, field:'price_inc_vat', allowNull: true},
	paymentPeriod: {type: Sequelize.STRING, field: 'payment_period', allowNull: true},
	vatFlag: {type: Sequelize.STRING, field:'vat_flag', allowNull: true},
	whtFlag: {type: Sequelize.STRING, field:'wht_flag', allowNull: true},
	whtRate: {type: Sequelize.STRING, field:'wht_rate', allowNull: true},
	vatRate: {type: Sequelize.STRING, field:'vat_rate', allowNull: true},
	depositType: {type: Sequelize.STRING, field: 'deposit_type', allowNull: true},
	taxPaymentType: {type: Sequelize.STRING, field: 'tax_payment_type', allowNull: true},
	taxPaymentDistrict: {type: Sequelize.STRING, field: 'tax_payment_district', allowNull: true},
	meterNo: {type: Sequelize.STRING, field: 'meter_no', allowNull: true},
	registerMeterDate: {type: Sequelize.DATEONLY, field: 'register_meter_date', allowNull: true//,
		//get: function() {return mCfg.correctTime(this.getDataValue('registerMeterDate'))}
	},
	depositRefundStatus: {type: Sequelize.STRING, field: 'deposit_refund_status', allowNull: true},
	buildingAreaId: {type: Sequelize.INTEGER, field:'ba_id', allowNull: true},
	buildingId: {type: Sequelize.INTEGER, field:'building_id', allowNull: true},
	createBy: { type: Sequelize.STRING, field: 'create_by', allowNull: false},
        createDate: { type: Sequelize.DATEONLY, field: 'create_date', allowNull: false, defaultValue: Sequelize.NOW}
},{freezeTableName: true, timestamps: false})

module.exports = mCtPayment
