import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
