import { Github, LayersIcon, PanelLeft, RefreshCcwIcon, Trash2 } from 'lucide-react'
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
  SheetDescription,
} from './ui/sheet'
import { Separator } from './ui/separator'
import { REPO_LINK } from '@/shared/constants'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useStore from '@/hooks/useStore'
import { loadCSSVariables } from '@/lib/utils'

function Header() {
  const { setColorVariables } = useStore()

  const palettes = [
    'Dracula',
    'Solarized Dark',
    'Nord',
    'Monokai',
    'Gruvbox',
    'One Dark',
    'Tokyo Night',
    'Catppuccin',
    'Palenight',
    'Midnight Coder',
  ]

  async function loadVars() {
    const vars = await loadCSSVariables()
    setColorVariables(vars || [])
  }

  return (
    <div className="relative flex h-8 items-center rounded-md px-2">
      <Sheet>
        <SheetTrigger asChild>
          <PanelLeft className="text-muted-foreground hover:text-foreground z-10 size-5 cursor-pointer transition-colors duration-300" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] !p-4">
          <SheetHeader>
            <SheetTitle className="font-title mt-8 mb-2 text-xl">About</SheetTitle>
            <SheetDescription className="sr-only">About extension</SheetDescription>
          </SheetHeader>
          <div className="text-muted-foreground mt-1 text-[0.76rem]">
            <p className="text-sm">
              TintAI extension lets you manage your CSS color variables and create stunning color
              palettes using AI. It analyzes your page's existing colors and helps you generate
              beautiful, cohesive palettes that actually make sense for your design. No more endless
              tweaking – just point, click, and get colors that work.
            </p>
            <Separator className="my-2" />
            <p className="text-sm">
              Want to help out? Awesome! Feel free to jump in with bug fixes, feature ideas, or UI
              improvements. Open an issue if you want to chat about bigger changes first, or just
              submit a PR if you've got something ready. All contributions welcome – let's make this
              thing better together!
            </p>
            <div className="mt-4">
              <a
                href={REPO_LINK}
                target="_blank"
                className={buttonVariants({ variant: 'outline' }) + 'cursor-pointer text-sm'}
              >
                <Github className="mr-2 size-4" /> Contribute
              </a>
            </div>
          </div>
          <img className="absolute bottom-4 left-4 size-5" src="./logo.svg" alt="logo" />
        </SheetContent>
      </Sheet>

      <div className="z-10 ml-auto flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={loadVars} aria-label="Refresh" type="button">
                <RefreshCcwIcon className="text-muted-foreground hover:text-foreground z-10 size-5 cursor-pointer transition-colors duration-300" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Sheet>
          <SheetTrigger asChild>
            <LayersIcon className="text-muted-foreground hover:text-foreground z-10 size-5 cursor-pointer transition-colors duration-300" />
          </SheetTrigger>
          <SheetContent side="right" className="flex h-screen max-h-screen w-[300px] flex-col !p-4">
            <SheetHeader>
              <SheetTitle className="mt-8 mb-2 text-xl">Saved Palettes</SheetTitle>
              <SheetDescription className="sr-only">Saved Palettes</SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="size-full h-full">
                {palettes.map((palette, index) => (
                  <div key={index} className="color mb-1 flex h-10 items-center gap-1 text-sm">
                    <div
                      onClick={() => alert('load palette')}
                      className="hover:bg-muted flex h-full flex-1 cursor-pointer items-center border px-4"
                    >
                      {palette}
                    </div>
                    <button
                      onClick={() => alert('delete palette')}
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
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default Header
