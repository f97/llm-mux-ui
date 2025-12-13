import { motion, AnimatePresence } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import { fadeInUp, staggerContainer, staggerItem, smooth } from '../../lib/animations'

// Animated container for staggered children
export function AnimatedList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated item for use inside AnimatedList
export function AnimatedItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={staggerItem} transition={smooth} className={className}>
      {children}
    </motion.div>
  )
}

// Fade in up animation wrapper
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smooth, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated card with hover effect
interface MotionCardProps extends HTMLMotionProps<'div'> {
  hover?: boolean
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smooth}
        whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
        className={cn(
          'bg-(--bg-card) border border-(--border-color) rounded-xl',
          'shadow-sm',
          hover && 'hover:border-(--text-secondary)/40 transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

MotionCard.displayName = 'MotionCard'

// Animated presence wrapper for conditional rendering
export function AnimatedPresenceWrapper({
  children,
  show,
}: {
  children: React.ReactNode
  show: boolean
}) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={smooth}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Loading skeleton with shimmer animation
export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('bg-(--bg-hover) rounded', className)}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// Page wrapper with fade transition
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// Stats grid with staggered animation
export function AnimatedStats({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: { staggerChildren: 0.08 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedStatCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
      }}
      transition={smooth}
    >
      {children}
    </motion.div>
  )
}

// Table row animation
export function AnimatedTableRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={smooth}
      className={className}
    >
      {children}
    </motion.tr>
  )
}

// Grid item animation for cards
export function AnimatedGridItem({
  children,
  index = 0,
}: {
  children: React.ReactNode
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smooth, delay: index * 0.05 }}
    >
      {children}
    </motion.div>
  )
}
