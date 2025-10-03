// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  ;(chrome.sidePanel as any).open({ tabId: tab.id })
})
