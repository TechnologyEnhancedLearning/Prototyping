// External dependencies
const express = require('express');
const router = express.Router();
const path = require('path');

// Add your routes here - above the module.exports line
const globalRoutes = require(`./routes/global.js`);
const shorthandUrlRoutes = require(`./routes/shorthand-urls.js`);
const registrationRoutes = require(`./routes/registration.js`);
const paperProcessRoutes = require(`./routes/paper-process.js`);

router.use('/', globalRoutes);
router.use('/', registrationRoutes);
router.use('/', shorthandUrlRoutes);
router.use('/', paperProcessRoutes);

module.exports = router;
