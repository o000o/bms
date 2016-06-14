'use strict'

const express = require('express');
const router = express.Router();
const auth = require('./auth.js');
// const user = require('./user.js');
const contract = require('./contract.js');
const vendorProfile = require('./vendorProfile.js');
const userRequest = require('./userRequest.js');

const chalk = require('chalk');

// ============================================================================
// Login
// ============================================================================
router.post('/login/user', auth.login);
router.get('/logout/user', auth.logout);

// ============================================================================
// user for test
// ============================================================================
// router.post('/user', user.addUser);
// router.put('/user', user.editUser);
// router.get('/user', user.queryUser);
// router.delete('/user', user.deleteUser);

// ============================================================================
// User Request
// ============================================================================
router.post('/userRequest', userRequest.add);
router.put('/userRequest', userRequest.edit);
router.get('/userRequest', userRequest.query);
router.post('/getUserRequest', userRequest.queryByCriteria);
router.get('/userRequest/:urId', userRequest.queryById);
router.delete('/userRequest/:urId', userRequest.delete);
router.put('/userRequest/approval', userRequest.approval);

// ============================================================================
// Contract
// ============================================================================
router.post('/contract', contract.add);
router.put('/contract', contract.edit);
router.get('/contract', contract.query);
router.delete('/contract', contract.delete);

// ============================================================================
// VendorProfile
// ============================================================================
router.post('/vendorProfile', vendorProfile.add);
router.put('/vendorProfile', vendorProfile.edit);
router.get('/vendorProfile', vendorProfile.query);
router.delete('/vendorProfile', vendorProfile.delete);

module.exports = router;
