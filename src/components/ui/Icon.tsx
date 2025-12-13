import { cn } from '../../lib/cn'

interface IconProps {
  name: string
  className?: string
  filled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'text-[14px]',
  md: 'text-[18px]',
  lg: 'text-[20px]',
  xl: 'text-[24px]',
}

export function Icon({ name, className, filled = false, size = 'lg' }: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-outlined leading-none align-middle',
        filled && 'filled',
        sizeMap[size],
        className
      )}
    >
      {name}
    </span>
  )
}
