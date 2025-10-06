import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import useStore from '@/hooks/useStore'
import { RefreshCcwIcon, XIcon } from 'lucide-react'
import { loadCSSVariables } from '@/lib/utils'
import ColorsManager from '@/components/ColorsManager'

function ColorsTab() {
  const { colorVariables, setColorVariables } = useStore()
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>()

  useEffect(() => {
    const container = document.getElementById('colors-container') as HTMLDivElement
    if (container) {
      const height = container.clientHeight - 16
      setScrollAreaHeight(height)
    }
  }, [])

  async function loadVars() {
    const vars = await loadCSSVariables()
    setColorVariables(vars || [])
  }

  return (
    <div className="size-full max-h-full p-2" id="colors-container">
      {colorVariables.length > 0 && (
        <ScrollArea style={{ height: scrollAreaHeight || 0 }} className="w-full">
          <ColorsManager />
        </ScrollArea>
      )}
      {/* Empty list */}
      {colorVariables.length === 0 && (
        <div className="text-muted-foreground flex size-full flex-col items-center justify-center gap-4 px-4 text-center text-lg">
          <p>No CSS color variables were detected on this page.</p>
          <Button onClick={loadVars} variant="outline" size="sm">
            <RefreshCcwIcon className="mr-2 size-4" /> Reload
          </Button>
        </div>
      )}
    </div>
  )
}

export default ColorsTab
