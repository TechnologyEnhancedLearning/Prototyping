// External dependencies
const express = require('express')

const formActions = express.Router()

function ensureUserData(req) {
  if (!req.session) {
    req.session = {}
  }

  if (!req.session.data) {
    req.session.data = {}
  }

  const { data } = req.session

  if (!data.user) {
    data.user = {
      profile: {},
      tasks: {}
    }
  }

  if (!data.user.profile) {
    data.user.profile = {}
  }

  if (!data.user.tasks) {
    data.user.tasks = {}
  }
}

function setTaskStatus(req, taskKey, status) {
  ensureUserData(req)

  if (!req.session.data.user.tasks[taskKey]) {
    req.session.data.user.tasks[taskKey] = {
      status: 'Not yet started'
    }
  }

  req.session.data.user.tasks[taskKey].status = status
}

function setProfileField(req, field, value) {
  ensureUserData(req)

  if (typeof value === 'string') {
    req.session.data.user.profile[field] = value.trim()
    return
  }

  req.session.data.user.profile[field] = value
}

function workplaceLabel(workplace) {
  const labels = {
    bernard: '40 Bernard Street, Great Ormond Street Hospital for Children NHS Foundation Trust (NHS Trust Site)',
    acute: 'Acute Wards - GOSH Satellite, Great Ormond Street Hospital for Children NHS Foundation Trust (NHS Trust Site)',
    barclay: 'Barclay House, Great Ormond Street Hospital for Children NHS Foundation Trust (NHS Trust Site)',
    broomfield: 'Broomfield Hospital, Great Ormond Street Hospital for Children NHS Foundation Trust (NHS Trust Site)'
  }

  return labels[workplace] || workplace
}

// Route definitions to handle form submissions and button actions

// Login form submission – redirect to dashboard
formActions.post('/login', (req, res) => {
  res.redirect('/dashboard');
});

// Account creation flow
formActions.post('/create-account/email-address', (req, res) => {
  // After entering an email address, send the user to the email sent page
  setProfileField(req, 'emailAddress', req.body.emailAddress || '')
  res.redirect('/create-account/email-sent');
});

formActions.post('/create-account/email-sent', (req, res) => {
  // After the user confirms the email, take them to the about‑you page
  res.redirect('/create-account/about-you');
});

formActions.post('/create-account/about-you', (req, res) => {
  // After entering personal details and setting a password, confirm account creation
  res.redirect('/create-account/account-ready');
});

// Learner profile flow

formActions.post('/learner-profile/your-role-search', (req, res) => {
  setProfileField(req, 'roleSearch', req.body.roleSearch || '')
  if (req.body.role) {
    const otherRole = (req.body.otherRole || '').trim()

    if (req.body.role === 'other' && !otherRole) {
      res.redirect('/learner-profile/your-role-search')
      return
    }

    const selectedRole = req.body.role === 'other'
      ? otherRole
      : req.body.role

    setProfileField(req, 'role', selectedRole)
    res.redirect('/learner-profile/task-list')
    return
  }

  // Process search for role and display results (GET request will render the page)
  res.redirect('/learner-profile/your-role-search')
})

formActions.post('/learner-profile/primary-speciality', (req, res) => {
  setProfileField(req, 'primarySpecialitySearch', req.body.specialitySearch || '')
  setProfileField(req, 'primarySpeciality', req.body.speciality || req.body.specialitySearch || '')
  setTaskStatus(req, 'primarySpeciality', 'Completed')
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/enter-prn', (req, res) => {
  setProfileField(req, 'prn', req.body.prn || '')
  setTaskStatus(req, 'prn', 'Completed')
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/start-date', (req, res) => {
  setProfileField(req, 'startMonth', req.body.month || '')
  setProfileField(req, 'startYear', req.body.year || '')
  setTaskStatus(req, 'startDate', 'Completed')
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/pay-band', (req, res) => {
  setProfileField(req, 'payBand', req.body.payBand || '')
  setTaskStatus(req, 'payBand', 'Completed')
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/place-of-work-results', (req, res) => {
  setProfileField(req, 'placeSearch', req.body.placeSearch || '')
  if (req.body.workplace) {
    setProfileField(req, 'workplace', req.body.workplace)
    setProfileField(req, 'workplaceLabel', workplaceLabel(req.body.workplace))
    setTaskStatus(req, 'placeOfWork', 'Completed')
    res.redirect('/learner-profile/task-list')
    return
  }

  res.redirect('/learner-profile/place-of-work-results')
})

formActions.post('/learner-profile/region', (req, res) => {
  setProfileField(req, 'region', req.body.region || '')
  setTaskStatus(req, 'region', 'Completed')
  res.redirect('/learner-profile/task-list')
})

// Optional tasks flow

formActions.post('/all-users/learning-interests', (req, res) => {
  setProfileField(req, 'interestSearch', req.body.interestSearch || '')
  setTaskStatus(req, 'interests', 'Completed')
  res.redirect('/learner-profile/task-list')
})

formActions.post('/all-users/secondary-email', (req, res) => {
  setProfileField(req, 'secondaryEmail', req.body.secondaryEmail || '')
  setTaskStatus(req, 'secondaryEmail', 'Completed')
  res.redirect('/learner-profile/task-list')
})

// Social account linking
formActions.post('/all-users/link-social', (req, res) => {
  setTaskStatus(req, 'social', 'Completed')
  res.redirect('/learner-profile/task-list')
})

formActions.post('/all-users/check-details', (req, res) => {
  // After checking details, start the learning experience at the dashboard
  res.redirect('/dashboard');
});

module.exports = formActions
