const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');

router.post('/login', authController.postLogin);

module.exports = router;