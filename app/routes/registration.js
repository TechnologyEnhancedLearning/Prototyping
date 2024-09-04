const express = require('express');
const router = express.Router();

router.post('/register/start', (req, res) => {
  const howMany = req.session.data['how-many'];

  if (howMany === 'single') {
    res.redirect('/register-delegates/single');
  } else {
    res.redirect('/register-delegates/multiple');
  }
});

router.post('/register/multiple/upload', (req, res) => {
  const withErrors = req.session.data['upload-with-error'];

  if (withErrors == 'true') {
    res.redirect('/register-delegates/multiple/upload-error');
  } else {
    res.redirect('/register-delegates/multiple/upload');
  }
});

/*
router.post('/register/single/promotion', (req, res) => {
  // Make a variable and give it the value from 'know-nhs-number'
  const enroled = req.session.data['enrolment'];

  // Check whether the variable matches a condition
  if (enroled !== undefined && enroled.length > 0) {
    // Send user to next page
    res.redirect('/register/single/promotion');
  } else {
    // Send user to ineligible page
    res.redirect('/register/single/welcome');
  }
});
*/

// Clear all data in session if you open /examples/passing-data/clear-data
router.post('/restart', (req, res) => {
  req.session.data = {};
  res.redirect('/register-delegates');
});

// Clear all data in session if you open /examples/passing-data/clear-data
router.post('/cancel', (req, res) => {
  req.session.data = {};
  res.redirect('/register-delegates');
});

module.exports = router;
