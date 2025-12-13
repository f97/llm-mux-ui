import { cn } from '../../lib/cn'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  )
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead className={cn('bg-(--bg-hover)/50 text-xs text-(--text-secondary) font-medium', className)}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={cn('divide-y divide-(--border-color)', className)}>{children}</tbody>
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr className={cn('hover:bg-(--bg-hover) transition-colors group', className)}>
      {children}
    </tr>
  )
}

interface TableCellProps extends TableProps {
  align?: 'left' | 'center' | 'right'
}

export function TableHead({ children, className, align = 'left' }: TableCellProps) {
  return (
    <th
      className={cn(
        'px-6 py-3 font-medium',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className, align = 'left' }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-6 py-4',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </td>
  )
}
