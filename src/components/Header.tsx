import { Github, HistoryIcon, PanelLeft } from 'lucide-react'
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, Sheet } from './ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Separator } from './ui/separator'
import { REPO_LINK } from '@/shared/constants'
import { buttonVariants } from '@/components/ui/button'

function Header() {
  return (
    <div className="border-input relative flex h-8 items-center rounded-md border px-2">
      <Sheet>
        <SheetTrigger asChild>
          <PanelLeft className="z-10 size-5 cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] !p-4">
          <SheetHeader>
            <SheetTitle>About</SheetTitle>
          </SheetHeader>
          <div className="text-muted-foreground mt-1 text-[0.76rem]">
            <p>
              This Chrome extension lets you manage your CSS color variables and create stunning
              color palettes using AI. It analyzes your page's existing colors and helps you
              generate beautiful, cohesive palettes that actually make sense for your design. No
              more endless tweaking – just point, click, and get colors that work.
            </p>
            <Separator className="my-2" />
            <p>
              Want to help out? Awesome! Feel free to jump in with bug fixes, feature ideas, or UI
              improvements. Open an issue if you want to chat about bigger changes first, or just
              submit a PR if you've got something ready. All contributions welcome – let's make this
              thing better together!
            </p>
            <div className="mt-3">
              <a
                href={REPO_LINK}
                target="_blank"
                className={buttonVariants({ variant: 'outline' }) + 'cursor-pointer text-xs'}
              >
                <Github className="mr-2 size-4" /> Contribute
              </a>
            </div>
          </div>
          <img className="absolute bottom-4 left-4 size-5" src="./logo.svg" alt="logo" />
        </SheetContent>
      </Sheet>

      <div className="logo absolute right-0 left-0 flex justify-center">
        <img className="size-5" src="./logo.svg" alt="logo" />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <div className="z-10 ml-auto flex">
            <HistoryIcon className="z-10 size-5 cursor-pointer" />
          </div>
        </SheetTrigger>
        <SheetContent side="right" className="w-[240px] !p-4">
          <SheetHeader>
            <SheetTitle>Hisory</SheetTitle>
          </SheetHeader>
          <div className="text-muted-foreground mt-1 text-[0.76rem]">{/* Saved palettes */}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Header
