// External dependencies
const express = require('express');
const router = express.Router();
const path = require('path');

// Add your routes here - above the module.exports line
const globalRoutes = require(`./routes/global.js`);
const registrationRoutes = require(`./routes/registration.js`);
const shorthandUrls = require(`./routes/shorthand-urls.js`);

// function logRequest(req, res, next) {
//   console.log('log something');
//   next();
// }
// router.use(logRequest);

router.use('/', globalRoutes);
router.use('/', registrationRoutes);
router.use('/', shorthandUrls);

module.exports = router;
