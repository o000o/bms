'use strict'

const express = require('express');
const router = express.Router();
const auth = require('./auth.js');
const location = require('./location.js');
const contract = require('./contract.js');
const vendorProfile = require('./vendorProfile.js');
const userRequest = require('./userRequest.js');
const notification = require('./notification.js')
// const user = require('../_ooo/user.js')

// router.get('/ooo', user.queryUser);

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
router.post('/location', location.add);
router.put('/location', location.edit);
router.get('/location', location.query);
router.post('/getLocation', location.queryByCriteria);
router.get('/location/:buildingId', location.queryById);
// router.delete('/location:buildingId', location.delete);

// ============================================================================
// Contract
// ============================================================================
router.post('/contract', contract.add);
// router.put('/contract', contract.edit);
// router.get('/contract', contract.query);
// router.post('/getContract', contract.queryByCriteria);
// router.get('/contract/:contractId', contract.queryById);
// router.delete('/contract/:contractId', contract.delete);

// ============================================================================
// VendorProfile
// ============================================================================
router.post('/vendorProfile', vendorProfile.add);
router.put('/vendorProfile', vendorProfile.edit);
router.get('/vendorProfile', vendorProfile.query);
router.delete('/vendorProfile', vendorProfile.delete);

module.exports = router;
