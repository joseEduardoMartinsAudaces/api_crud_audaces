'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');

router.get('/getAll', authService.authorize, controller.getAll);
router.post('/createCustomer', controller.createCustomer);

module.exports = router;