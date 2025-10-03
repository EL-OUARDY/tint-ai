import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { InputHTMLAttributes, forwardRef, useId, ReactElement, useState } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  icon?: ReactElement
}

const Input = forwardRef<HTMLInputElement, Props>(({ className, icon, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const id = useId()
  const isPasswordInput = props['type'] === 'password'

  return (
    <div className="relative w-full">
      {icon && (
        <label
          htmlFor={id}
          className="text-muted-foreground/50 absolute top-0 left-0 flex h-full w-8 cursor-text items-center justify-center"
        >
          {icon}
        </label>
      )}

      <input
        id={id}
        {...props}
        ref={ref}
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ring-ring/20 from-accent to-secondary flex h-10 w-full rounded-md bg-gradient-to-r p-2 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-none',
          icon && 'pl-8',
          className,
        )}
        type={isPasswordInput ? (isPasswordVisible ? 'text' : 'password') : props['type']}
      />

      {isPasswordInput && (
        <div
          onClick={() => setIsPasswordVisible((v) => !v)}
          className="text-muted-foreground/50 bg-secondary absolute top-0 right-1 flex h-full w-8 cursor-pointer items-center justify-center"
        >
          {isPasswordVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </div>
      )}
    </div>
  )
})

export default Input
