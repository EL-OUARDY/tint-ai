import React from 'react'
import ReactDOM from 'react-dom/client'
import UIWrapper from '@/components/UIWrapper'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <UIWrapper />
  </React.StrictMode>,
)

chrome.devtools.panels.create('🎨 TintAI', '', '../../devtools.html', function () {
  console.log('devtools panel create')
})
