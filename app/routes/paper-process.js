const express = require('express');
const router = express.Router();

router.post('/choose-framework', (req, res) => {
  const framework = req.session.data['frameworkName'].replace(/\s+/g, '-').toLowerCase();

  res.redirect(`/paper-transfer/_dls-parts/about-${framework}`);
});


router.post('/additional-proficiencies-answer', (req, res) => {
  const answer = req.session.data['addAdditionalProficiencies'];
  const framework = req.session.data['frameworkName']
  let frameworkPostfix = framework ? framework.replace(/\s+/g, '-').toLowerCase() : null;
  let frameworkPath = '/paper-transfer/additional-proficiencies/add-proficiencies';

  if(framework) {
    frameworkPath = `/paper-transfer/additional-proficiencies/add-proficiencies-${frameworkPostfix}`
  }

  if (answer === 'yes') {
    res.redirect(frameworkPath);
  } else {
    res.redirect(`/paper-transfer`);
  }
});

module.exports = router;
