import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    const paddingStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    const variantStyles = {
      default: 'bg-neutral-card border border-neutral-border rounded-lg shadow-md',
      outlined: 'border-2 border-neutral-border rounded-lg bg-transparent',
    }

    return (
      <div
        ref={ref}
        className={clsx(variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
