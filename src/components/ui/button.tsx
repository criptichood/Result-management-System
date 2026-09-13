import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Institutional High-Contrast Buttons with distinct hover elevation and transition
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#064e3b] dark:focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
    
    const variants = {
      default: "bg-[#064e3b] text-white hover:bg-[#065f46] hover:shadow-md hover:-translate-y-0.5 shadow-sm active:translate-y-0",
      secondary: "bg-[#fbbf24] text-[#064e3b] hover:bg-[#f59e0b] hover:shadow-md hover:-translate-y-0.5 shadow-sm active:translate-y-0",
      outline: "border-2 border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-emerald-50/80 dark:hover:bg-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-300 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#064e3b] dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 hover:-translate-y-0.5 active:translate-y-0",
      link: "text-[#064e3b] dark:text-emerald-400 underline-offset-4 hover:underline hover:text-[#065f46] dark:hover:text-emerald-300",
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8",
      icon: "h-9 w-9",
    }

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
