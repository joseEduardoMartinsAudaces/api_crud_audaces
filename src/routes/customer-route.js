'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');

router.get('/getAll', controller.getAll);
router.get('/get', controller.getById);
router.post('/create', authService.authorize, controller.create);
router.put('/update', authService.authorize, controller.update);
router.delete('/delete', authService.authorize, controller.delete);

module.exports = router;