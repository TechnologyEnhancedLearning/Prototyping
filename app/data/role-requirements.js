const { getRoleByName } = require('./nhs-role-search')

const AGENDA_FOR_CHANGE_OPTIONS = [
  { value: '1', text: 'Band 1' },
  { value: '2', text: 'Band 2' },
  { value: '3', text: 'Band 3' },
  { value: '4', text: 'Band 4' },
  { value: '5', text: 'Band 5' },
  { value: '6', text: 'Band 6' },
  { value: '7', text: 'Band 7' },
  { value: '8a', text: 'Band 8a' },
  { value: '8b', text: 'Band 8b' },
  { value: '8c', text: 'Band 8c' },
  { value: '8d', text: 'Band 8d' },
  { value: '9', text: 'Band 9' },
  { value: 'student', text: 'Student' }
]

const MEDICAL_PAY_SCALE_OPTIONS = [
  { value: 'foundation-year-1', text: 'Foundation year 1' },
  { value: 'foundation-year-2', text: 'Foundation year 2' },
  { value: 'specialty-registrar', text: 'Specialty registrar' },
  { value: 'specialty-doctor', text: 'Specialty doctor' },
  { value: 'associate-specialist', text: 'Associate specialist' },
  { value: 'consultant', text: 'Consultant' },
  { value: 'gp', text: 'General practitioner' }
]

const LOCAL_PAY_SCALE_OPTIONS = [
  { value: 'local-scale', text: 'Local pay scale' },
  { value: 'very-senior-manager', text: 'Very senior manager pay scale' },
  { value: 'senior-manager', text: 'Senior manager pay scale' },
  { value: 'other', text: 'Other pay arrangement' }
]

const PAY_SCALE_CONFIG = {
  none: {
    key: 'none',
    taskLabel: '',
    summaryLabel: '',
    pageName: '',
    heading: '',
    hint: '',
    options: []
  },
  agendaForChange: {
    key: 'agendaForChange',
    taskLabel: 'Pay band',
    summaryLabel: 'Pay band',
    pageName: 'Pay band',
    heading: 'Select your pay band',
    hint: 'You can usually find your Agenda for Change band on your payslip.',
    options: AGENDA_FOR_CHANGE_OPTIONS
  },
  medical: {
    key: 'medical',
    taskLabel: 'Pay scale',
    summaryLabel: 'Medical pay scale',
    pageName: 'Pay scale',
    heading: 'Select your medical pay scale',
    hint: 'Choose the grade or pay scale that best matches your current medical role.',
    options: MEDICAL_PAY_SCALE_OPTIONS
  },
  local: {
    key: 'local',
    taskLabel: 'Pay scale',
    summaryLabel: 'Pay scale',
    pageName: 'Pay scale',
    heading: 'Select your pay scale',
    hint: 'Some roles are paid outside Agenda for Change. Choose the option that best matches your contract.',
    options: LOCAL_PAY_SCALE_OPTIONS
  }
}

const PRN_CONFIG = {
  none: {
    key: 'none',
    taskLabel: '',
    summaryLabel: '',
    pageName: '',
    heading: '',
    label: '',
    hint: '',
    intro: ''
  },
  gmc: {
    key: 'gmc',
    taskLabel: 'Your GMC number',
    summaryLabel: 'GMC number',
    pageName: 'Enter your GMC number',
    heading: 'Enter your GMC number',
    label: 'GMC number',
    hint: 'This is your General Medical Council registration number.',
    intro: 'You can find this on the GMC register or in your registration emails.'
  },
  nmc: {
    key: 'nmc',
    taskLabel: 'Your NMC number',
    summaryLabel: 'NMC number',
    pageName: 'Enter your NMC number',
    heading: 'Enter your NMC number',
    label: 'NMC number',
    hint: 'This may also be referred to as your PIN.',
    intro: 'You can find this on your NMC registration details.'
  },
  hcpc: {
    key: 'hcpc',
    taskLabel: 'Your HCPC number',
    summaryLabel: 'HCPC number',
    pageName: 'Enter your HCPC number',
    heading: 'Enter your HCPC registration number',
    label: 'HCPC registration number',
    hint: 'This is your Health and Care Professions Council registration number.',
    intro: 'You can find this on the HCPC register or in your registration details.'
  }
}

const ROLE_OVERRIDES = {
  Nurse: { prnType: 'nmc', payScale: 'agendaForChange' },
  Midwife: { prnType: 'nmc', payScale: 'agendaForChange' },
  'Mental Health Nurse': { prnType: 'nmc', payScale: 'agendaForChange' },
  'Doctor (General Practice)': { prnType: 'gmc', payScale: 'medical' },
  'Doctor (Specialist)': { prnType: 'gmc', payScale: 'medical' },
  Psychiatrist: { prnType: 'gmc', payScale: 'medical' },
  'Clinical Psychologist': { prnType: 'hcpc', payScale: 'agendaForChange' },
  'Allied Health Professional': { prnType: 'hcpc', payScale: 'agendaForChange' },
  Paramedic: { prnType: 'hcpc', payScale: 'agendaForChange' },
  Radiographer: { prnType: 'hcpc', payScale: 'agendaForChange' },
  'Occupational Therapist': { prnType: 'hcpc', payScale: 'agendaForChange' },
  Physiotherapist: { prnType: 'hcpc', payScale: 'agendaForChange' },
  'Biomedical Scientist': { prnType: 'hcpc', payScale: 'agendaForChange' },
  Director: { prnType: 'none', payScale: 'local' },
  'Operational Manager': { prnType: 'none', payScale: 'local' },
  'Programme Manager': { prnType: 'none', payScale: 'local' },
  'Service Manager': { prnType: 'none', payScale: 'local' }
}

const CATEGORY_DEFAULTS = {
  'Medical Specialties': { prnType: 'gmc', payScale: 'medical' },
  'Leadership, Management & Organisational Development': { prnType: 'none', payScale: 'local' },
  'Diagnostics & Testing': { prnType: 'none', payScale: 'agendaForChange' }
}

const PRIMARY_SPECIALITY_CATEGORIES = new Set([
  'Clinical Care',
  'Medical Specialties',
  'Mental Health & Wellbeing',
  'Social Care',
  'Public Health & Prevention',
  'Diagnostics & Testing'
])

function getBaseRoleRequirements(roleName = '') {
  const fallback = {
    roleName,
    prnType: 'none',
    payScale: 'none'
  }

  if (!roleName) {
    return fallback
  }

  if (ROLE_OVERRIDES[roleName]) {
    return {
      roleName,
      ...ROLE_OVERRIDES[roleName]
    }
  }

  const matchedRole = getRoleByName(roleName)

  if (!matchedRole || !matchedRole.hint || !matchedRole.hint.text) {
    return fallback
  }

  const categories = matchedRole.hint.text.split(' • ')

  for (const category of categories) {
    if (CATEGORY_DEFAULTS[category]) {
      return {
        roleName,
        ...CATEGORY_DEFAULTS[category]
      }
    }
  }

  return fallback
}

function getRoleRequirements(roleName = '') {
  const base = getBaseRoleRequirements(roleName)
  const prn = PRN_CONFIG[base.prnType] || PRN_CONFIG.none
  const pay = PAY_SCALE_CONFIG[base.payScale] || PAY_SCALE_CONFIG.none
  const matchedRole = getRoleByName(roleName)
  const roleCategories = matchedRole?.hint?.text
    ? matchedRole.hint.text.split(' • ')
    : []
  const needsPrimarySpeciality = roleCategories.some((category) => PRIMARY_SPECIALITY_CATEGORIES.has(category))

  return {
    roleName: base.roleName,
    roleCategories,
    prnType: base.prnType,
    payScale: base.payScale,
    needsPrimarySpeciality,
    needsPrn: base.prnType !== 'none',
    needsPayScale: base.payScale !== 'none',
    prn,
    pay
  }
}

module.exports = {
  getRoleRequirements
}
