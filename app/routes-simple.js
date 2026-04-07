// External dependencies
const express = require('express')

const router = express.Router()

const formActions  = require('./routes/registration/form-actions');

router.use('/', formActions)

// Add your routes here - above the module.exports line

// Handle header state

router.use((req, res, next) => {
  // Logic to determine state (e.g., from session or database)
  // For now, we'll use a placeholder logic
  res.locals.headerState = req.session?.user ? 'logged-in' : 'logged-out';

  // You can easily add more states here later
  if (req.path.startsWith('/create-account') | req.path.startsWith('/create-account') | req.path.startsWith('/admin')) {
    res.locals.headerState = 'basic';
  }
  if (req.path.startsWith('/all-users') | req.path.startsWith('/dashboard') | req.path.startsWith('/learner-profile')) {
    res.locals.headerState = 'logged-in';
  }
  if (req.path.startsWith('/start') | req.path.startsWith('/admin')) {
    res.locals.headerState = 'logged-out';
  }

  next();
});

module.exports = router
