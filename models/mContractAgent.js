'use strict'

const Sequelize = require('sequelize');
const mCfg = require('../config/modelCfg');

const mContractAgent = mCfg.sequelize.define('contract_vendor_agent', {
	contractId: {type:Sequelize.STRING, field: 'contract_id', primaryKey: true, allowNull: false},
	vendorContactId: {type:Sequelize.INTEGER, field:'vendor_contact_id', allowNull: false},
	createBy: { type: Sequelize.STRING, field: 'create_by', allowNull: false},
        createDate: { type: Sequelize.DATEONLY, field: 'create_date', allowNull: false, defaultValue: Sequelize.NOW}
},{freezeTableName: true, timestamps: false});

module.exports = mContractAgent;
