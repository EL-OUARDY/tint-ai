import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
  SheetDescription,
} from './ui/sheet'
import { PanelLeft } from 'lucide-react'
import useStore from '@/hooks/useStore'
import About from '@/components/About'
import SavedPalettes from '@/components/SavedPalettes'

function Header() {
  const { colorVariables, setColorVariables } = useStore()

  function loadInitialVariables() {
    setColorVariables(colorVariables.map((color) => ({ ...color, value: color.initial })))
  }

  return (
    <div className="relative flex h-8 items-center rounded-md px-2">
      {/* About Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <PanelLeft className="text-muted-foreground hover:text-foreground z-10 size-[1.2rem] cursor-pointer transition-colors duration-300" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] !p-4">
          <SheetHeader>
            <SheetTitle className="font-title mt-8 mb-2 text-xl">About</SheetTitle>
            <SheetDescription className="sr-only">About extension</SheetDescription>
          </SheetHeader>

          <About />
        </SheetContent>
      </Sheet>

      <div className="z-10 ml-auto flex items-center gap-2">
        {/* Reset button */}
        {colorVariables.length > 0 && (
          <>
            <span
              onClick={loadInitialVariables}
              title="Reset to default"
              className="hover:text-foreground text-muted-foreground cursor-pointer text-sm hover:underline"
            >
              Reset
            </span>
            <span className="text-muted-foreground">|</span>
          </>
        )}

        {/* Saved Palettes */}
        <SavedPalettes />
      </div>
    </div>
  )
}

export default Header
