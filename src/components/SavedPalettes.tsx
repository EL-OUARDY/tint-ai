import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
  SheetDescription,
  SheetFooter,
} from './ui/sheet'
import { LayersIcon, PaletteIcon, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import useStore from '@/hooks/useStore'
import clsx from 'clsx'

function SavedPalettes() {
  const { savedPalettes, setSavedPalettes, setColorVariables } = useStore()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <LayersIcon className="text-muted-foreground hover:text-foreground z-10 size-[1.2rem] cursor-pointer transition-colors duration-300" />
      </SheetTrigger>
      <SheetContent side="right" className="flex h-screen max-h-screen w-[300px] flex-col !p-4">
        <SheetHeader>
          <SheetTitle className={clsx('mt-8 mb-2 text-xl', savedPalettes.length === 0 && 'hidden')}>
            Saved Palettes {savedPalettes.length > 0 && <span>({savedPalettes.length})</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">Saved Palettes</SheetDescription>
        </SheetHeader>

        {/* Palettes list */}
        {savedPalettes.length > 0 && (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="size-full h-full">
              {savedPalettes.map((palette, index) => (
                <div key={index} className="color mb-1 flex h-10 items-center gap-1 text-sm">
                  <div
                    onClick={() => setColorVariables(palette.colors)}
                    className="hover:bg-muted flex h-full flex-1 cursor-pointer items-center border px-4"
                  >
                    {palette.name}
                  </div>
                  <button
                    onClick={() =>
                      setSavedPalettes(savedPalettes.filter((p) => p.name !== palette.name))
                    }
                    title="Delete palette"
                    tabIndex={-1}
                    className="hover:bg-muted text-muted-foreground flex size-10 cursor-pointer items-center justify-center border hover:text-red-500"
                  >
                    <Trash2 className="z-10 size-4 cursor-pointer transition-colors duration-300" />
                  </button>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        {/* Empty list */}
        {savedPalettes.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-4">
              <PaletteIcon className="size-12" />
              <p className="text-sm">You haven’t saved any palettes yet!</p>
            </div>
          </div>
        )}

        <SheetFooter>
          {savedPalettes.length > 0 && (
            <Button
              onClick={() => setSavedPalettes([])}
              size={'sm'}
              className="ml-auto w-fit px-8"
              tabIndex={-1}
            >
              Clear All
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default SavedPalettes
