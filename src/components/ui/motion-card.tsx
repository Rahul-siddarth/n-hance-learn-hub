import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface MotionCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'interactive' | 'elevated';
  delay?: number;
}

const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, variant = 'default', delay = 0, children, ...props }, ref) => {
    const variants = {
      default: 'bg-card border border-border',
      interactive: 'bg-card border border-border hover:border-primary/30 hover:shadow-hover cursor-pointer',
      elevated: 'bg-card shadow-card border border-border',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: 'easeOut' }}
        whileHover={variant === 'interactive' ? { scale: 1.02, y: -2 } : undefined}
        className={cn(
          'rounded-lg p-6 transition-all duration-300',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionCard.displayName = 'MotionCard';

export { MotionCard };
