// ES6 or Vanilla JavaScript

function debounce(fn, delay) {
  let timeoutId

  return (...args) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delay)
  }
}

function createAutosuggest(input) {
  const endpoint = input.dataset.autosuggestEndpoint
  const form = input.form
  const resultType = input.dataset.autosuggest || 'results'
  const radioName = input.dataset.autosuggestRadioName || 'role'
  const otherValue = input.dataset.autosuggestOtherValue || 'other'
  const otherLabelText = input.dataset.autosuggestOtherLabel || 'Other'
  const emptyText = input.dataset.autosuggestEmptyText || `No matching ${resultType} found. Select ${otherLabelText} to enter a value manually.`

  if (!endpoint || !form) {
    return
  }

  const resultsRegion = form.querySelector('[data-live-role-results]')
  const radiosContainer = form.querySelector('[data-live-role-radios]')
  const otherGroup = form.querySelector('[data-live-role-other-group]')
  const otherInput = form.querySelector('#live-other-role')
  const continueButton = form.querySelector('[data-live-role-continue]')

  if (!resultsRegion || !radiosContainer || !otherGroup || !otherInput) {
    return
  }

  let lastRequest = 0

  function clearResults() {
    resultsRegion.hidden = true
    radiosContainer.innerHTML = ''
    otherGroup.hidden = true
    otherInput.value = ''
  }

  function updateOtherFieldVisibility() {
    const selectedItem = form.querySelector(`input[name="${radioName}"]:checked`)
    otherGroup.hidden = !selectedItem || selectedItem.value !== otherValue
  }

  function renderResults(items) {
    resultsRegion.hidden = false
    radiosContainer.innerHTML = ''

    const fragment = document.createDocumentFragment()

    if (!items.length) {
      const emptyMessage = document.createElement('p')
      emptyMessage.className = 'nhsuk-body app-live-role-results__empty'
      emptyMessage.textContent = emptyText
      fragment.append(emptyMessage)
    } else {
      items.forEach((result, index) => {
        const item = document.createElement('div')
        item.className = 'nhsuk-radios__item'

        const radio = document.createElement('input')
        radio.className = 'nhsuk-radios__input'
        radio.id = `live-${radioName}-${index + 1}`
        radio.name = radioName
        radio.type = 'radio'
        radio.value = result.value
        radio.addEventListener('change', updateOtherFieldVisibility)

        const label = document.createElement('label')
        label.className = 'nhsuk-label nhsuk-radios__label'
        label.htmlFor = radio.id
        label.textContent = result.text

        item.append(radio, label)

        if (result.hint?.text) {
          const hint = document.createElement('div')
          hint.className = 'nhsuk-hint nhsuk-radios__hint'
          hint.textContent = result.hint.text
          item.append(hint)
        }

        fragment.append(item)
      })
    }

    const otherItem = document.createElement('div')
    otherItem.className = 'nhsuk-radios__item'

    const otherRadio = document.createElement('input')
    otherRadio.className = 'nhsuk-radios__input'
    otherRadio.id = `live-${radioName}-${otherValue}`
    otherRadio.name = radioName
    otherRadio.type = 'radio'
    otherRadio.value = otherValue
    otherRadio.addEventListener('change', updateOtherFieldVisibility)

    const otherLabel = document.createElement('label')
    otherLabel.className = 'nhsuk-label nhsuk-radios__label'
    otherLabel.htmlFor = otherRadio.id
    otherLabel.textContent = otherLabelText

    otherItem.append(otherRadio, otherLabel)
    fragment.append(otherItem)

    radiosContainer.append(fragment)
  }

  const fetchResults = debounce(async (query) => {
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 2) {
      clearResults()
      return
    }

    const requestId = Date.now()
    lastRequest = requestId

    try {
      const response = await fetch(`${endpoint}?q=${encodeURIComponent(trimmedQuery)}`, {
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        clearResults()
        return
      }

      const data = await response.json()

      if (lastRequest !== requestId) {
        return
      }

      renderResults(data.results || [])
    } catch {
      clearResults()
    }
  }, 150)

  if (continueButton) {
    continueButton.hidden = false
  }

  input.addEventListener('input', (event) => {
    fetchResults(event.target.value)
  })

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  })

  otherInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('[data-autosuggest]')
    .forEach((input) => createAutosuggest(input))
})
