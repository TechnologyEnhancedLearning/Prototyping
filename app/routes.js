// External dependencies
const express = require('express');
const router = express.Router();
const path = require('path');

// Add your routes here - above the module.exports line
const globalRoutes = require(`./routes/global.js`);
const registrationRoutes = require(`./routes/registration.js`);

// function logRequest(req, res, next) {
//   console.log('log something');
//   next();
// }
// router.use(logRequest);

const rootViewDirectory2 = '/prototypes';

// Create a custom route for the root URL
// router.get('/', (req, res) => {
//   // Render the files from the specified directory as the response
//   res.sendFile(path.join(rootViewDirectory2, '/'));
// });

router.use('/', globalRoutes);
router.use('/', registrationRoutes);

module.exports = router;
