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
  const { colorVariables, setColorVariables, excludedVariables } = useStore()

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
