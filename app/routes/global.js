const express = require('express');
const router = express.Router();
const path = require('path');

// Add global functions here

// Clear all data in session if you open /examples/passing-data/clear-data
router.post('/restart', (req, res) => {
  req.session.data = {};
  res.redirect('/prototypes');
});

// Clear all data in session if you open /examples/passing-data/clear-data
router.post('/cancel', (req, res) => {
  req.session.data = {};
  res.redirect('/prototypes/register');
});

module.exports = router;
