// External dependencies
const express = require('express')
const formActions = express.Router()

// Route definitions to handle form submissions and button actions

// Login form submission – redirect to dashboard
formActions.post('/login', (req, res) => {
  res.redirect('/dashboard');
});

// Account creation flow
formActions.post('/create-account/email-address', (req, res) => {
  // After entering an email address, send the user to the email sent page
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
  // Process search for role and display results (GET request will render the page)
  res.redirect('/learner-profile/your-role-search');
});

formActions.post('/learner-profile/primary-speciality', (req, res) => {
  // Mark the primary speciality task as completed and return to the task list
  req.session.data.primarySpecialityStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/enter-prn', (req, res) => {
  // Mark the PRN task as completed and return to the task list
  req.session.data.prnStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/start-date', (req, res) => {
  // Mark the start date task as completed and return to the task list
  req.session.data.startDateStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/pay-band', (req, res) => {
  // Mark the pay band task as completed and return to the task list
  req.session.data.payBandStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/place-of-work-results', (req, res) => {
  // Mark the place of work task as completed and return to the task list
  req.session.data.placeOfWorkStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

formActions.post('/learner-profile/region', (req, res) => {
  // Mark the region task as completed and return to the task list
  req.session.data.regionStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

// Optional tasks flow

formActions.post('/all-users/learning-interests', (req, res) => {
  // Mark the learning interests task as completed and return to the task list
  req.session.data.interestsStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

formActions.post('/all-users/secondary-email', (req, res) => {
  // Mark the secondary email task as completed and return to the task list
  req.session.data.secondaryEmailStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

// Social account linking
formActions.post('/all-users/link-social', (req, res) => {
  // Mark the social linking task as completed and return to the task list
  req.session.data.socialStatus = 'Completed'
  res.redirect('/learner-profile/task-list')
})

formActions.post('/all-users/check-details', (req, res) => {
  // After checking details, start the learning experience at the dashboard
  res.redirect('/dashboard');
});

module.exports = formActions
