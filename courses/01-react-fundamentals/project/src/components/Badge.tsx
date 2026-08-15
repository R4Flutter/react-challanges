import type { ReactNode } from 'react'

interface BadgeProps {
  children?: ReactNode
  variant?: string
  label?: string
}

export default function Badge({ children, variant, label }: BadgeProps) {
  return (
    <span className="badge" data-variant={variant} data-tag={label}>
      {children}
    </span>
  )
}