const express = require('express');
const router = express.Router();

// import all routes 
const authRoute = require('./authRoute');
const categoryRoute = require('./categoryRoute');
const authorRoute = require('./authorRoute');
const bookRoute = require('./bookRoute');
const slideshowRoute = require('./slideshowRoute');

// use routes
router.use('/auth', authRoute);
router.use('/categories', categoryRoute);
router.use('/authors', authorRoute);
router.use('/books', bookRoute);
router.use('/slideshows', slideshowRoute);

module.exports = router;