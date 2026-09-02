import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
  className?: string
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200/80",
    success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200/80",
    warning: "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200/80",
    outline: "text-slate-950",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }
