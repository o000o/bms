'use strict'

const express = require('express');
const router = express.Router();
const auth = require('./auth.js');
const location = require('./location.js');
const locationD = require('./locationDetail.js');
const contract = require('./contract.js');
const vendorProfile = require('./vendorProfile.js');
const userRequest = require('./userRequest.js');
const notification = require('./notification.js')
const userManagement = require('./userManagement.js');
const Insurance = require('./Insurance.js');

// ============================================================================
// Login
// ============================================================================
router.post('/login/user', auth.login);
router.get('/logout/user', auth.logout);

// ============================================================================
// Notification
// ============================================================================
router.get('/notification', notification.ur);

// ============================================================================
// User Request
// ============================================================================
router.post('/userRequest', userRequest.add);
router.put('/userRequest', userRequest.edit);
router.get('/userRequest', userRequest.query);
router.post('/getUserRequest', userRequest.queryByCriteria);
router.get('/userRequest/:urId', userRequest.queryById);
router.delete('/userRequest/:urId', userRequest.delete);
router.put('/userRequest/updateStatus', userRequest.updateStatus);

// ============================================================================
// Location Master
// ============================================================================
router.post('/locationDetail', locationD.add);
router.put('/locationDetail', locationD.edit);
router.delete('/locationDetail/:buildingDetailId', locationD.delete);
// router.get('/location', location.query);
router.post('/location', location.queryByCriteria);
router.post('/locationArea', location.queryAreaByCriteria);
// router.get('/location/:buildingId', location.queryById);
// router.delete('/location/:buildingId', location.delete);

// ============================================================================
// Contract
// ============================================================================
router.post('/contract', contract.add);
router.post('/getContract', contract.queryByCriteria);
router.put('/contractBuilding', contract.editLocation);
router.put('/contractVendorProfile', contract.editVendorAgent);
router.put('/contractPayment', contract.editPayment);

// ============================================================================
// VendorProfile
// ============================================================================
router.post('/vendorProfile', vendorProfile.add);
router.post('/getVendorProfile', vendorProfile.queryByCriteria);
router.put('/vendorProfile', vendorProfile.edit);
router.delete('/vendorProfile/:vendorId', vendorProfile.delete);

// ============================================================================
// UserManagement
// ============================================================================
router.post('/userManagement', userManagement.add);
router.post('/getuserManagement', userManagement.queryByCriteria);
router.put('/userManagement', userManagement.edit);
router.delete('/userManagement/:userName', userManagement.delete);

// ============================================================================
// Insurance of location
// ============================================================================
router.post('/Insurance', Insurance.add);
//router.post('/Insurance', Insurance.queryByCriteria);
//router.put('/Insurance', Insurance.edit);
//router.delete('/Insurance/:insuranceNo', Insurance.delete);

module.exports = router;
