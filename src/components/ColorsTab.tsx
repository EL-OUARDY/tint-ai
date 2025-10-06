import { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HexAlphaColorPicker } from 'react-colorful'
import { COLOR_VARIABLE } from '@/shared/models'
import { Button } from '@/components/ui/button'
import useStore from '@/hooks/useStore'
import { RefreshCcwIcon, XIcon } from 'lucide-react'
import { loadCSSVariables } from '@/lib/utils'

function ColorsTab() {
  const {
    colorVariables,
    getFilteredColorVariables,
    setColorVariables,
    excludedVariables,
    setExcludedVariables,
  } = useStore()
  const [selectedColor, setSelectedColor] = useState<COLOR_VARIABLE | null>(null)
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
          {/* Color picker drawer */}
          <Drawer open={!!selectedColor} onClose={() => setSelectedColor(null)}>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm py-4">
                <DrawerHeader className="text-left">
                  <DrawerTitle className="sr-only">Pick a color.</DrawerTitle>
                  <DrawerDescription className="text-muted-foreground flex flex-col gap-1 text-base tracking-wider select-text">
                    <span>{selectedColor?.name}</span>
                    <span className="text-foreground">{selectedColor?.value}</span>
                  </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 pt-0">
                  <div className="flex items-center justify-center">
                    {selectedColor && (
                      <HexAlphaColorPicker
                        color={selectedColor.value}
                        onChange={(newColor) => {
                          setSelectedColor({ ...selectedColor, value: newColor })
                          setColorVariables(
                            colorVariables.map((c) =>
                              c.name === selectedColor.name ? { ...c, value: newColor } : c,
                            ),
                          )
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="!w-3/4"
                      />
                    )}
                  </div>

                  <div className="mx-auto w-3/4">
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full">
                        Save
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          {/* Colors list */}
          {getFilteredColorVariables().map((colorVar, index) => (
            <div
              onClick={() => setSelectedColor(colorVar)}
              key={index}
              className="color hover:bg-muted mb-1 flex items-center justify-between border px-4 py-2 text-sm"
            >
              <div className="flex flex-col gap-1 pr-2">
                <span className="">{colorVar.name}</span>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <span>{colorVar.value}</span>
                  <span>|</span>
                  <button
                    onClick={(e) => {
                      setExcludedVariables([...excludedVariables, colorVar.name])
                      e.stopPropagation()
                    }}
                    className="text-foreground cursor-pointer hover:underline"
                  >
                    Exclude
                  </button>
                </div>
              </div>
              <div
                className="size-5 cursor-pointer border"
                style={{
                  backgroundColor: colorVar.value,
                }}
              ></div>
            </div>
          ))}

          {/* Excluded List */}
          {excludedVariables.length > 0 && (
            <div className="my-4 w-full">
              <h3 className="font-title mb-4 text-center text-base">
                Excluded Variables <span>({excludedVariables.length})</span>
              </h3>
              {excludedVariables.map((variable, index) => (
                <div
                  className="variable mb-2 flex h-10 items-center justify-between border px-4 py-2 text-sm"
                  key={index}
                >
                  <span>{variable}</span>
                  <button
                    onClick={() =>
                      setExcludedVariables(excludedVariables.filter((x) => x !== variable))
                    }
                    title="delete"
                    className="hover:bg-muted hover:text-foreground text-muted-foreground flex size-6 items-center justify-center border"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
