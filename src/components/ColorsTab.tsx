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

function ColorsTab() {
  const { colorVariables, setColorVariables } = useStore()
  const [selectedColor, setSelectedColor] = useState<COLOR_VARIABLE | null>(null)
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>()

  useEffect(() => {
    const container = document.getElementById('colors-container') as HTMLDivElement
    if (container) {
      const height = container.clientHeight - 16
      setScrollAreaHeight(height)
    }
  }, [])

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
                  <DrawerDescription className="text-muted-foreground text-base tracking-wider">
                    {selectedColor?.name}:{selectedColor?.value}
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
          {colorVariables.map((colorVar, index) => (
            <div
              onClick={() => setSelectedColor(colorVar)}
              key={index}
              className="color hover:bg-muted mb-1 flex items-center justify-between border px-4 py-2 text-sm"
            >
              <div className="">
                {colorVar.name} --- {colorVar.value}
              </div>
              <div
                className="size-5 cursor-pointer border"
                style={{
                  backgroundColor: colorVar.value,
                }}
              ></div>
            </div>
          ))}
        </ScrollArea>
      )}
      {/* Empty list */}
      {colorVariables.length === 0 && (
        <div className="text-muted-foreground flex size-full items-center justify-center px-4 text-center text-lg">
          No CSS color variables were detected on this page.
        </div>
      )}
    </div>
  )
}

export default ColorsTab
