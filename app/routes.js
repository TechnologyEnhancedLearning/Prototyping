// External dependencies
const express = require('express')

const router = express.Router()

const { searchRoles } = require('./data/nhs-role-search')
const { searchPrimarySpecialities } = require('./data/primary-speciality-search')
const { getRoleRequirements } = require('./data/role-requirements')
const formActions = require('./routes/registration/form-actions')
const migrateSessionUserData = require('./routes/registration/middleware/session-user-migration')

router.use(migrateSessionUserData)
router.use('/', formActions)

// Add your routes here - above the module.exports line

// Handle header state

router.use((req, res, next) => {
  // Logic to determine state (e.g., from session or database)
  // For now, we'll use a placeholder logic
  res.locals.headerState = req.session?.user ? 'logged-in' : 'logged-out';

  // You can easily add more states here later
  if (req.path.startsWith('/create-account') | req.path.startsWith('/admin') | req.path.startsWith('/')) {
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

router.get('/api/roles/search', (req, res) => {
  const query = req.query.q || ''

  res.json({
    query,
    results: searchRoles(query)
  })
})

router.get('/api/primary-specialities/search', (req, res) => {
  const query = req.query.q || ''

  res.json({
    query,
    results: searchPrimarySpecialities(query)
  })
})

router.use((req, res, next) => {
  const profile = req.session?.data?.user?.profile || {}
  const roleRequirements = getRoleRequirements(profile.role || '')

  res.locals.roleRequirements = roleRequirements

  if (req.method === 'GET' && req.path === '/learner-profile/primary-speciality' && !roleRequirements.needsPrimarySpeciality) {
    res.redirect('/learner-profile/task-list')
    return
  }

  if (req.method === 'GET' && req.path === '/learner-profile/enter-prn' && !roleRequirements.needsPrn) {
    res.redirect('/learner-profile/task-list')
    return
  }

  if (req.method === 'GET' && req.path === '/learner-profile/pay-band' && !roleRequirements.needsPayScale) {
    res.redirect('/learner-profile/task-list')
    return
  }

  if (req.path !== '/learner-profile/your-role-search') {
    next()
    return
  }

  const roleSearchQuery = profile.roleSearch || ''
  const selectedRole = profile.role || ''
  const roleSearchResults = searchRoles(roleSearchQuery)

  res.locals.roleSearchQuery = roleSearchQuery
  res.locals.roleSearchResults = roleSearchResults.map((role) => ({
    ...role,
    checked: role.value === selectedRole
  }))
  res.locals.selectedRole = selectedRole
  res.locals.selectedRoleInSearchResults = roleSearchResults.some((role) => role.value === selectedRole)

  next()
})





module.exports = router
