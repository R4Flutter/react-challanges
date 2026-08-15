import type { ReactNode } from 'react'

interface ButtonProps {
  children?: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  id?: string
  'data-active'?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  id,
  'data-active': dataActive,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-active={dataActive}
    >
      {children}
    </button>
  )
}