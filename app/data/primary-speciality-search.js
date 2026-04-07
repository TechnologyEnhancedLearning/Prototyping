const fs = require('node:fs')
const path = require('node:path')

const specialitiesFilePath = path.join(__dirname, '../views/_data/primary-speciality/primary-speciality.njk')

function normalise(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function extractQuotedValues(block = '') {
  return [...block.matchAll(/"([^"]+)"/g)].map((match) => match[1].trim())
}

function parseSpecialities() {
  const source = fs.readFileSync(specialitiesFilePath, 'utf8')
  const specialtyPattern = /{\s*specialtyKey:\s*"([^"]+)"[\s\S]*?specialtyName:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?tags:\s*\[([\s\S]*?)\][\s\S]*?}/g

  return [...source.matchAll(specialtyPattern)].map((match) => ({
    specialtyKey: match[1],
    specialtyName: match[2],
    category: match[3],
    tags: extractQuotedValues(match[4])
  }))
}

function buildSpecialityIndex() {
  return parseSpecialities()
    .map((speciality) => ({
      text: speciality.specialtyName,
      value: speciality.specialtyName,
      hint: {
        text: speciality.category
      },
      keywords: [
        normalise(speciality.specialtyName),
        normalise(speciality.category),
        ...speciality.tags.map((tag) => normalise(tag))
      ]
    }))
    .sort((left, right) => left.text.localeCompare(right.text))
}

const specialityIndex = buildSpecialityIndex()

function scoreSpecialityMatch(speciality, query) {
  const normalisedText = normalise(speciality.text)

  if (normalisedText === query) {
    return 400
  }

  if (normalisedText.startsWith(query)) {
    return 300
  }

  if (normalisedText.includes(query)) {
    return 200
  }

  if (speciality.keywords.some((keyword) => keyword.startsWith(query))) {
    return 120
  }

  if (speciality.keywords.some((keyword) => keyword.includes(query))) {
    return 100
  }

  return 0
}

function searchPrimarySpecialities(rawQuery, options = {}) {
  const limit = options.limit || 10
  const query = normalise(rawQuery)

  if (!query) {
    return []
  }

  return specialityIndex
    .map((speciality) => ({
      ...speciality,
      score: scoreSpecialityMatch(speciality, query)
    }))
    .filter((speciality) => speciality.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.text.localeCompare(right.text)
    })
    .slice(0, limit)
    .map((speciality) => ({
      text: speciality.text,
      value: speciality.value,
      hint: speciality.hint
    }))
}

module.exports = {
  searchPrimarySpecialities
}
