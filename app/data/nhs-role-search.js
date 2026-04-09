const fs = require('node:fs')
const path = require('node:path')

const rolesFilePath = path.join(__dirname, '../views/_data/roles/nhs-roles.njk')

function normalise(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function extractQuotedValues(block = '') {
  return [...block.matchAll(/"([^"]+)"/g)].map((match) => match[1].trim())
}

function parseRoleCategories() {
  const source = fs.readFileSync(rolesFilePath, 'utf8')
  const categoryPattern = /(\w+):\s*{\s*label:\s*"([^"]+)"[\s\S]*?relatedRoles:\s*\[([\s\S]*?)\][\s\S]*?tags:\s*\[([\s\S]*?)\][\s\S]*?}/g

  return [...source.matchAll(categoryPattern)].map((match) => ({
    key: match[1],
    label: match[2],
    relatedRoles: extractQuotedValues(match[3]),
    tags: extractQuotedValues(match[4])
  }))
}

function buildRoleIndex() {
  const roles = new Map()

  for (const category of parseRoleCategories()) {
    for (const roleName of category.relatedRoles) {
      const existingRole = roles.get(roleName) || {
        text: roleName,
        value: roleName,
        categories: new Set(),
        keywords: new Set([normalise(roleName)])
      }

      existingRole.categories.add(category.label)
      existingRole.keywords.add(normalise(category.label))

      for (const tag of category.tags) {
        existingRole.keywords.add(normalise(tag))
      }

      roles.set(roleName, existingRole)
    }
  }

  return [...roles.values()]
    .map((role) => ({
      text: role.text,
      value: role.value,
      hint: {
        text: [...role.categories].sort().join(' • ')
      },
      keywords: [...role.keywords]
    }))
    .sort((left, right) => left.text.localeCompare(right.text))
}

const roleIndex = buildRoleIndex()
const roleIndexByName = new Map(
  roleIndex.map((role) => [normalise(role.value), role])
)

function scoreRoleMatch(role, query) {
  const normalisedRoleText = normalise(role.text)

  if (normalisedRoleText === query) {
    return 400
  }

  if (normalisedRoleText.startsWith(query)) {
    return 300
  }

  if (normalisedRoleText.includes(query)) {
    return 200
  }

  if (role.keywords.some((keyword) => keyword.startsWith(query))) {
    return 120
  }

  if (role.keywords.some((keyword) => keyword.includes(query))) {
    return 100
  }

  return 0
}

function searchRoles(rawQuery, options = {}) {
  const limit = options.limit || 10
  const query = normalise(rawQuery)

  if (!query) {
    return []
  }

  return roleIndex
    .map((role) => ({
      ...role,
      score: scoreRoleMatch(role, query)
    }))
    .filter((role) => role.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.text.localeCompare(right.text)
    })
    .slice(0, limit)
    .map((role) => ({
      text: role.text,
      value: role.value,
      hint: role.hint
    }))
}

function getRoleByName(roleName = '') {
  return roleIndexByName.get(normalise(roleName)) || null
}

module.exports = {
  searchRoles,
  getRoleByName
}
