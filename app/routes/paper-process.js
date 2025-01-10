const express = require('express');
const router = express.Router();

/* Learner ------------------------------------------------------------- */
router.post('/choose-framework', (req, res) => {
  const framework = req.session.data['frameworkName'].replace(/\s+/g, '-').toLowerCase();

  res.redirect(`/paper-transfer/learner/_dls-parts/about-${framework}`);
});

router.get('/additional-proficiencies-answer', (req, res) => {
  const answer = req.session.data['addAdditionalProficiencies'];
  const framework = req.session.data['frameworkName']
  let frameworkPostfix = framework ? framework.replace(/\s+/g, '-').toLowerCase() : null;
  let frameworkPath = '/paper-transfer/learner/additional-proficiencies/add-proficiencies';

  console.log(frameworkPostfix);
  console.log(frameworkPath);

  if(framework) {
    frameworkPath = `/paper-transfer/learner/additional-proficiencies/add-proficiencies-${frameworkPostfix}`
  } else {
    frameworkPath = `/paper-transfer/learner/additional-proficiencies/add-proficiencies-iv-therapy`
  }

  res.redirect(frameworkPath);
});

router.post('/confirmed', (req, res) => {
  const framework = req.session.data['frameworkName']
  let frameworkPostfix = framework ? framework.replace(/\s+/g, '-').toLowerCase() : null;
  let frameworkPath = '#';

  if(framework) {
    frameworkPath = `/paper-transfer/learner/_dls-parts/about-${frameworkPostfix}`
  } else {
    frameworkPath = `/paper-transfer/learner/_dls-parts`
  }

  res.redirect(frameworkPath);
});

/* Supervisor ------------------------------------------------------------- */
router.get('/supervisor-review-outcome', (req, res) => {
  const supervisorReviewOutcome = req.session.data['supervisorReviewOutcome'] ? req.session.data['supervisorReviewOutcome'].replace(/\s+/g, '-').toLowerCase() : null;
  let supervisorReviewOutcomePath = `/paper-transfer/admin/confirmation/${supervisorReviewOutcome}`

  if(!supervisorReviewOutcome) {
    supervisorReviewOutcomePath = `/paper-transfer/admin/confirmation/approved`
  }

  console.log(supervisorReviewOutcomePath);

  res.redirect(supervisorReviewOutcomePath);
});

module.exports = router;
