import { Github, HistoryIcon, PanelLeft } from 'lucide-react'
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, Sheet } from './ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Separator } from './ui/separator'
import { REPO_LINK } from '@/shared/constants'
import { buttonVariants } from '@/components/ui/button'

function Header() {
  return (
    <div className="relative flex h-8 items-center rounded-md px-2">
      <Sheet>
        <SheetTrigger asChild>
          <PanelLeft className="text-muted-foreground hover:text-foreground z-10 size-5 cursor-pointer transition-colors duration-300" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] !p-4">
          <SheetHeader>
            <SheetTitle className="font-title mt-8 text-xl">About</SheetTitle>
          </SheetHeader>
          <div className="text-muted-foreground mt-1 text-[0.76rem]">
            <p className="text-sm">
              This Chrome extension lets you manage your CSS color variables and create stunning
              color palettes using AI. It analyzes your page's existing colors and helps you
              generate beautiful, cohesive palettes that actually make sense for your design. No
              more endless tweaking – just point, click, and get colors that work.
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

      <Sheet>
        <SheetTrigger asChild>
          <div className="text-muted-foreground hover:text-foreground z-10 ml-auto flex transition-colors duration-300">
            <HistoryIcon className="z-10 size-5 cursor-pointer" />
          </div>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] !p-4">
          <SheetHeader>
            <SheetTitle className="mt-8 text-xl">History</SheetTitle>
          </SheetHeader>
          <div className="text-muted-foreground mt-1 text-[0.76rem]">{/* Saved palettes */}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Header
