import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered entrance animation.
 * Respects `prefers-reduced-motion` by rendering statically.
 */
export default function Reveal({
  children,
  as: Component = 'div',
  delay = 0,
  y = 24,
  className = '',
  once = true,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[Component] ?? motion.div

  if (reduceMotion) {
    const Tag = Component
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
