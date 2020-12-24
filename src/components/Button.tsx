import React from 'react'
import clsx from 'clsx'

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: 'small'
    variant?: 'primary' | 'secondary'
  }
> = ({ children, size, variant, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        props.className,
        'button',
        size && `is-${size}`,
        `is-${variant || 'primary'}`,
      )}
    >
      {children}
    </button>
  )
}
