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
    
    // Natural Tones: Primary is amber-400 (#fbbf24) with emerald text, Secondary is emerald-900 (#064e3b)
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#064e3b] disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-[#fbbf24] text-[#064e3b] hover:bg-[#f59e0b] shadow-sm",
      secondary: "bg-[#064e3b] text-white hover:bg-[#065f46] shadow-sm",
      outline: "border border-[#065f46] bg-transparent hover:bg-emerald-50 text-[#064e3b]",
      ghost: "hover:bg-emerald-50 hover:text-[#064e3b] text-slate-600",
      link: "text-[#064e3b] underline-offset-4 hover:underline",
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
