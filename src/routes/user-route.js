'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller');
const authService = require('../services/auth-service');

router.get('/home', authService.authorize, controller.refreshToken);
router.post('/login', controller.authenticateUser);
router.post('/login/forgotPassword', controller.forgotPassword);
router.post('/login/resetPassword', controller.resetPassword);
router.post('/register', controller.createUser);
router.get('/register/authenticate', controller.authenticateEmail);

module.exports = router;