'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');

router.get('/getAllCustomer', controller.getAll);
router.post('/createCustomer', authService.authorize, controller.createCustomer);

module.exports = router;