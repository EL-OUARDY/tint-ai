import ColorsTab from '@/components/ColorsTab'
import ExportTab from '@/components/ExportTab'
import Footer from '@/components/Footer'
import GenerateTab from '@/components/GenerateTab'
import Header from '@/components/Header'
import AiIcon from '@/components/ui/icons/ai'
import { ThemeProvider } from '@/contexts/theme-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useStore from '@/hooks/useStore'
import { loadCSSVariables } from '@/lib/utils'
import { useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import '@/global.css'

export const UIWrapper = () => {
  const {
    colorVariables,
    setColorVariables,
    excludedVariables,
    setExcludedVariables,
    tabURL,
    setTabURL,
    savedPalettes,
  } = useStore()

  // Load CSS variables from the current page
  useEffect(() => {
    const loadPageVariables = async () => {
      const vars = await loadCSSVariables(colorVariables)
      setColorVariables(vars || [])
    }
    loadPageVariables()
  }, [])

  // Save Excluded Variables in local storage
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

        // Set tab url
        if (tab.url) setTabURL(tab.url)

        // Clear old page variables
        setColorVariables([])
        setExcludedVariables([])

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
        const vars = await loadCSSVariables(colorVariables)
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

  // Apply CSS variables to the current page when colorVariables change (skip excluded)
  useEffect(() => {
    const applyVariablesToPage = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

        if (!tab?.id) return

        // Don't modify internal chrome/extension pages
        if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
          return
        }

        const payload = {
          action: 'applyCSSVariables',
          variables: colorVariables,
          excluded: excludedVariables,
        }

        try {
          // Try to send message to content script
          await chrome.tabs.sendMessage(tab.id, payload)
        } catch (sendError) {
          // If content script is not injected, try to inject and retry
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id! },
              files: ['src/contentScript/index.ts.js'],
            })
            // Retry after injection
            await chrome.tabs.sendMessage(tab.id, payload)
          } catch (injectionError) {
            console.error('Failed to apply CSS variables after injection:', injectionError)
          }
        }
      } catch (error) {
        console.error('Error applying CSS variables to page:', error)
      }
    }

    // Only run when there are color variables (or when they became empty)
    applyVariablesToPage()
  }, [colorVariables, excludedVariables])

  // Save fovorite palettes in local storage
  useEffect(() => {
    const saveFavoritePalettes = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab?.url) {
          const key = tab.url + '--favorites'
          localStorage.setItem(key, JSON.stringify(savedPalettes))
        }
      } catch (error) {
        console.error('Error getting current tab URL:', error)
      }
    }

    saveFavoritePalettes()
  }, [savedPalettes])

  return (
    <ThemeProvider defaultTheme="system" storageKey="tintai-ui-theme">
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
              <ColorsTab key={tabURL} />
            </TabsContent>
            <TabsContent value="customize" className="flex-1 border">
              <GenerateTab key={tabURL} />
            </TabsContent>
            <TabsContent value="contribute" className="flex-1 border">
              <ExportTab key={tabURL} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="bg-secondary p-2">
          <Footer />
        </div>
        <Toaster position="top-left" />
      </main>
    </ThemeProvider>
  )
}

export default UIWrapper
