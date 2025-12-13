import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * Admin Dashboard Page Transition
 *
 * Design decisions:
 * - Fast duration (120ms) - không delay user workflow
 * - Subtle fade only - professional, không distracting
 * - No exit animation - instant response feel
 * - ease-out - perceived faster
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
