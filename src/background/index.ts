console.log('background is running')

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  ;(chrome.sidePanel as any).open({ tabId: tab.id })
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})
