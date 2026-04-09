const taskDefaults = {
  primarySpeciality: 'Not yet started',
  prn: 'Not yet started',
  startDate: 'Not yet started',
  payBand: 'Not yet started',
  placeOfWork: 'Not yet started',
  region: 'Not yet started',
  interests: 'Optional',
  secondaryEmail: 'Optional',
  social: 'Optional'
}

function migrateSessionUserData(req, res, next) {
  if (!req.session) {
    next()
    return
  }

  if (!req.session.data) {
    req.session.data = {}
  }

  const data = req.session.data

  if (!data.user) {
    data.user = { profile: {}, tasks: {} }
  }

  if (!data.user.profile) data.user.profile = {}
  if (!data.user.tasks) data.user.tasks = {}

  Object.entries(taskDefaults).forEach(([taskKey, defaultStatus]) => {
    if (!data.user.tasks[taskKey]) {
      data.user.tasks[taskKey] = { status: defaultStatus }
      return
    }

    if (!data.user.tasks[taskKey].status) {
      data.user.tasks[taskKey].status = defaultStatus
    }
  })

  next()
}

module.exports = migrateSessionUserData
