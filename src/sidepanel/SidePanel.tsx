import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export const SidePanel = () => {
  useEffect(() => {
    // Notify background that side panel is opened
    chrome.runtime.sendMessage({ type: 'SIDEPANEL_OPENED' }).catch(() => {
      console.log('Could not send message to background')
    })

    // Listen for close message from background
    const handleMessage = (message: any) => {
      if (message.type === 'CLOSE_SIDEPANEL') {
        window.close()
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    // Notify background when side panel is being closed
    const handleBeforeUnload = () => {
      chrome.runtime.sendMessage({ type: 'SIDEPANEL_CLOSED' }).catch(() => {
        // Ignore errors
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <main>
      <h3 className="text-2xl text-red-500">SidePanel Page</h3>
      <Button variant={'outline'}>Hello</Button>
    </main>
  )
}

export default SidePanel
