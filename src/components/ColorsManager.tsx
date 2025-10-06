import { useRef, useState } from 'react'
import useStore from '@/hooks/useStore'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { HexAlphaColorPicker } from 'react-colorful'
import { COLOR_VARIABLE } from '@/shared/models'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'
import Input from '@/components/ui/input'

interface Props {
  showExcludedColors?: boolean
}

function ColorsManager({ showExcludedColors = true }: Props) {
  const {
    colorVariables,
    getFilteredColorVariables,
    setColorVariables,
    excludedVariables,
    setExcludedVariables,
  } = useStore()
  const [selectedColor, setSelectedColor] = useState<COLOR_VARIABLE | null>(null)
  const colorInput = useRef<HTMLInputElement>(null)

  return (
    <>
      {/* Color picker drawer */}
      <Drawer open={!!selectedColor} onClose={() => setSelectedColor(null)}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm py-4">
            <DrawerHeader className="text-left">
              <DrawerTitle className="sr-only">Pick a color.</DrawerTitle>
              <DrawerDescription className="text-muted-foreground flex flex-col gap-1 text-base tracking-wider select-text">
                <span>{selectedColor?.name}</span>
                <Input
                  ref={colorInput}
                  value={selectedColor?.value}
                  onChange={(e) => {
                    if (selectedColor) {
                      setSelectedColor({ ...selectedColor, value: e.target.value })
                      setColorVariables(
                        colorVariables.map((c) =>
                          c.name === selectedColor.name ? { ...c, value: e.target.value } : c,
                        ),
                      )
                    }
                  }}
                  className="text-foreground mx-auto w-3/4 text-center text-sm"
                />
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
              <span>|</span>
              <button
                onClick={(e) => {
                  setColorVariables(
                    colorVariables.map((c) =>
                      c.name === colorVar.name ? { ...c, value: c.initial } : c,
                    ),
                  )
                  e.stopPropagation()
                }}
                className="text-foreground cursor-pointer hover:underline"
              >
                Reset
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
          <div className="mb-4 flex items-center justify-between px-4">
            <h3 className="font-title text-center text-base">
              Excluded Variables <span>({excludedVariables.length})</span>
            </h3>
            <span
              onClick={() => setExcludedVariables([])}
              title="Clear excluded variables"
              className="hover:text-foreground text-muted-foreground cursor-pointer hover:underline"
            >
              Clear All
            </span>
          </div>
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
    </>
  )
}

export default ColorsManager
