import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Color, { ColorTypes } from 'colorjs.io'
import { COLOR_VARIABLE } from '@/shared/models'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidCssColor(value: ColorTypes) {
  try {
    new Color(value)
    return true
  } catch (e) {
    return false
  }
}

export async function loadCSSVariables(
  oldVariables: COLOR_VARIABLE[] = [],
): Promise<COLOR_VARIABLE[] | undefined> {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab?.id) {
      console.error('No active tab found')
      return []
    }

    // Check if we can access the tab (not a chrome:// or extension page)
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
      console.log('Cannot access CSS variables on Chrome internal pages')

      return []
    }

    try {
      // Send message to content script to get CSS variables
      // Send previous variables as oldVariables so content script can log/use them
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'getCSSVariables',
        oldVariables,
      })

      if (response?.variables && response.variables.length > 0) {
        console.log('Loaded CSS variables:', response.variables)
        return response.variables
      } else {
        console.log('No CSS variables found on the page')
        return []
      }
    } catch (messageError) {
      console.error('Error sending message to content script:', messageError)
      // Content script might not be injected, try to inject it
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          files: ['src/contentScript/index.ts.js'],
        })
        // Wait a bit for the script to load
        setTimeout(async () => {
          try {
            // Retry and include oldVariables again
            const response = await chrome.tabs.sendMessage(tab.id!, {
              action: 'getCSSVariables',
              oldVariables,
            })
            if (response?.variables && response.variables.length > 0) {
              console.log('Loaded CSS variables after injection:', response.variables)
              return response.variables
            } else {
              return []
            }
          } catch (retryError) {
            console.error('Failed to load CSS variables after injection:', retryError)
            return []
          }
        }, 100)
      } catch (injectionError) {
        console.error('Failed to inject content script:', injectionError)
        return []
      }
    }
  } catch (error) {
    console.error('Error loading CSS variables:', error)
    return []
  }
}
