import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'
import { inputStyles } from './input-styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string
  iconPosition?: 'left' | 'right'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, iconPosition = 'left', ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative flex items-center">
          {iconPosition === 'left' && (
            <Icon
              name={icon}
              size="md"
              className="absolute left-3 text-(--text-tertiary) pointer-events-none"
            />
          )}
          <input
            ref={ref}
            className={cn(
              inputStyles,
              iconPosition === 'left' ? 'pl-10 pr-4' : 'pl-4 pr-10',
              className
            )}
            {...props}
          />
          {iconPosition === 'right' && (
            <Icon
              name={icon}
              size="md"
              className="absolute right-3 text-(--text-tertiary) pointer-events-none"
            />
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        className={cn(inputStyles, className)}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

// Search input variant
export function SearchInput({ className, ...props }: Omit<InputProps, 'icon' | 'iconPosition'>) {
  return (
    <Input
      icon="search"
      iconPosition="left"
      placeholder="Search..."
      className={className}
      {...props}
    />
  )
}
