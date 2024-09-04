const express = require('express');
const router = express.Router();

const shorthandPairs = {
  '/admin-home': '/prototypes/admin-frameworks',
  '/login': '/prototypes/login-journey',
  '/proficiencies': '/prototypes/proficiencies-journey',
  '/register-delegates': '/register-delegates',
};

// Middleware to rewrite shorthand URLs
router.use((req, res, next) => {
  let staticUrl = req.path;

  for (const [key, value] of Object.entries(shorthandPairs)) {
    if (staticUrl.startsWith(key)) {
      const dynamicUrl = staticUrl.slice(key.length);
      req.url = `${value}${dynamicUrl}`;  // Rewrite the URL to the full path

      break;
    }
  }

  next();
});

module.exports = router;
