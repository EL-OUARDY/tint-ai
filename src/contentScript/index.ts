import { isValidCssColor } from '@/lib/utils'
import { COLOR_VARIABLE } from '@/shared/models'

// Function to extract CSS variables from the page
function extractCSSVariables(): COLOR_VARIABLE[] {
  const htmlElement = document.querySelector('html')

  if (!htmlElement) {
    return []
  }

  let cssVariables: COLOR_VARIABLE[] = []

  // Modern browsers with computedStyleMap support
  if ('computedStyleMap' in htmlElement) {
    const styleMap = htmlElement.computedStyleMap()

    Array.from(styleMap).forEach(([propertyName, propertyValue]) => {
      if (propertyName.startsWith('--') && !propertyName.startsWith('--tw')) {
        cssVariables.push({
          name: propertyName,
          value: propertyValue.toString(),
          initial: propertyValue.toString(),
        })
      }
    })
  }
  // Fallback for older browsers
  else {
    const computedStyles = getComputedStyle(htmlElement)

    for (let index = 0; index < computedStyles.length; index++) {
      const propertyName = computedStyles[index]

      if (propertyName?.startsWith('--') && !propertyName.startsWith('--tw')) {
        const propertyValue = computedStyles.getPropertyValue(propertyName)
        cssVariables.push({
          name: propertyName,
          value: propertyValue,
          initial: propertyValue,
        })
      }
    }
  }

  cssVariables = cssVariables.filter((c) => isValidCssColor(c.value))

  return cssVariables
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Load CSS variables from the current page
  if (request.action === 'getCSSVariables') {
    const variables = extractCSSVariables()
    sendResponse({ variables })
  }

  // Apply CSS variables sent from the sidepanel, skipping excluded ones
  if (request.action === 'applyCSSVariables') {
    try {
      const { variables, excluded } = request as {
        variables: COLOR_VARIABLE[]
        excluded: string[]
      }

      const html = document.documentElement
      if (!html) {
        sendResponse({ ok: false, reason: 'no documentElement' })
        return true
      }

      // Apply each variable unless it's excluded
      variables?.forEach((v) => {
        if (!v?.name) return
        if (Array.isArray(excluded) && excluded.includes(v.name)) return
        try {
          // setProperty will create or update the CSS variable on :root
          html.style.setProperty(v.name, v.value)
        } catch (err) {
          // Silently ignore invalid values
          console.warn('Failed to set CSS variable', v.name, err)
        }
      })

      sendResponse({ ok: true })
    } catch (e) {
      console.error('Error applying CSS variables:', e)
      sendResponse({ ok: false, reason: String(e) })
    }
  }
  return true // Keep the message channel open for async response
})
