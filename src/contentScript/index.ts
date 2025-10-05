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
        })
      }
    }
  }

  cssVariables = cssVariables.filter((c) => isValidCssColor(c.value))

  return cssVariables
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCSSVariables') {
    const variables = extractCSSVariables()
    sendResponse({ variables })
  }
  return true // Keep the message channel open for async response
})
