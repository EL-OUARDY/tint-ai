console.log('background is running')

// Track side panel state per window
const sidePanelState = new Map<number, boolean>()

// Toggle side panel when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.windowId) return

  const windowId = tab.windowId
  const isOpen = sidePanelState.get(windowId) || false

  try {
    if (isOpen) {
      // Send message to close the side panel
      await chrome.runtime.sendMessage({ type: 'CLOSE_SIDEPANEL' })
      sidePanelState.set(windowId, false)
    } else {
      // Open side panel
      await (chrome.sidePanel as any).open({ windowId: windowId })
      sidePanelState.set(windowId, true)
    }
  } catch (error) {
    console.error('Error toggling side panel:', error)
    // Try to open if there was an error (likely means it's closed)
    try {
      await (chrome.sidePanel as any).open({ windowId: windowId })
      sidePanelState.set(windowId, true)
    } catch (e) {
      console.error('Failed to open side panel:', e)
    }
  }
})

// Listen for messages from side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SIDEPANEL_OPENED') {
    const windowId = sender.tab?.windowId
    if (windowId) {
      sidePanelState.set(windowId, true)
    }
  } else if (message.type === 'SIDEPANEL_CLOSED') {
    const windowId = sender.tab?.windowId
    if (windowId) {
      sidePanelState.set(windowId, false)
    }
  }
  return true
})

// Clean up state when window is closed
chrome.windows.onRemoved.addListener((windowId) => {
  sidePanelState.delete(windowId)
})
