import ColorsTab from '@/components/ColorsTab'
import ExportTab from '@/components/ExportTab'
import Footer from '@/components/Footer'
import GenerateTab from '@/components/GenerateTab'
import Header from '@/components/Header'
import AiIcon from '@/components/ui/icons/ai'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useStore from '@/hooks/useStore'
import { loadCSSVariables } from '@/lib/utils'
import { useEffect } from 'react'

export const SidePanel = () => {
  const { colorVariables, setColorVariables, excludedVariables, setExcludedVariables } = useStore()

  // Load CSS variables from the current page
  useEffect(() => {
    const loadVars = async () => {
      const vars = await loadCSSVariables()
      setColorVariables(vars || [])
    }
    loadVars()
  }, [])

  // Save Excluded Variables in chrome storage
  useEffect(() => {
    const saveExcludedVariables = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab?.url) {
          const key = tab.url
          localStorage.setItem(key, JSON.stringify(excludedVariables))
        }
      } catch (error) {
        console.error('Error getting current tab URL:', error)
      }
    }

    saveExcludedVariables()
  }, [excludedVariables])

  // Reload CSS variables when user switches tabs or navigates to another page
  useEffect(() => {
    let isMounted = true

    const refreshForActiveTab = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (!isMounted || !tab) return

        // Load excluded variables for the current tab (stored by URL)
        if (tab.url) {
          try {
            const stored = localStorage.getItem(tab.url)
            if (stored) {
              setExcludedVariables(JSON.parse(stored))
            } else {
              // clear if nothing stored for this URL
              setExcludedVariables([])
            }
          } catch (e) {
            console.error('Failed to load excluded variables for tab:', e)
          }
        }

        // Reload CSS variables from the page
        const vars = await loadCSSVariables()
        if (isMounted) setColorVariables(vars || [])
      } catch (error) {
        console.error('Error refreshing variables on tab change:', error)
      }
    }

    // Handlers must be stable references so we can remove them on cleanup
    const onActivated = () => {
      refreshForActiveTab()
    }

    const onUpdated = (_tabId: number, changeInfo: any, tab: chrome.tabs.Tab) => {
      // React to URL changes or when the tab finishes loading
      if (changeInfo.status === 'complete' || changeInfo.url) {
        refreshForActiveTab()
      }
    }

    const onWindowFocusChanged = (_windowId: number) => {
      // When window focus changes, the active tab may have changed
      refreshForActiveTab()
    }

    try {
      chrome.tabs.onActivated.addListener(onActivated)
      chrome.tabs.onUpdated.addListener(onUpdated)
      chrome.windows.onFocusChanged?.addListener(onWindowFocusChanged)
    } catch (err) {
      console.warn('Could not register chrome tab listeners in sidepanel:', err)
    }

    // Run once to initialize (in case active tab changed since mount)
    refreshForActiveTab()

    return () => {
      isMounted = false
      try {
        chrome.tabs.onActivated.removeListener(onActivated)
      } catch (e) {
        /* ignore */
      }
      try {
        chrome.tabs.onUpdated.removeListener(onUpdated)
      } catch (e) {
        /* ignore */
      }
      try {
        chrome.windows.onFocusChanged?.removeListener(onWindowFocusChanged)
      } catch (e) {
        /* ignore */
      }
    }
  }, [setColorVariables, setExcludedVariables])

  return (
    <main className="flex h-screen flex-col">
      <div className="bg-background p-2 pb-0">
        <Header />
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <Tabs defaultValue="themes" className="flex h-full flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="themes"
              className="flex items-center gap-1 !text-[0.8rem] font-bold uppercase"
            >
              <span>Colors</span>
              {colorVariables.length > 0 && (
                <span className="font-normal">({colorVariables.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="customize"
              className="flex items-center gap-1 !text-[0.8rem] font-bold uppercase"
            >
              <AiIcon className="size-4" />
              <span>Generate</span>
            </TabsTrigger>
            <TabsTrigger value="contribute" className="!text-[0.8rem] font-bold uppercase">
              Export
            </TabsTrigger>
          </TabsList>
          <TabsContent value="themes" className="flex-1 border">
            <ColorsTab />
          </TabsContent>
          <TabsContent value="customize" className="flex-1 border">
            <GenerateTab />
          </TabsContent>
          <TabsContent value="contribute" className="flex-1 border">
            <ExportTab />
          </TabsContent>
        </Tabs>
      </div>
      <div className="bg-secondary p-2">
        <Footer />
      </div>
    </main>
  )
}

export default SidePanel
