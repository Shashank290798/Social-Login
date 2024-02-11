const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/googleAuth', authController.googleAuth);

router.get('/azureAuth', authController.azureAuth);

router.post('/auth', authController.auth);

module.exports = router;
