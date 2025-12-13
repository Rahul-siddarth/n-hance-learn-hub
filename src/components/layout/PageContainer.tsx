import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, className, title, subtitle }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('min-h-[calc(100vh-4rem)] py-8', className)}
    >
      <div className="container">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8"
          >
            {title && (
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </motion.div>
  );
}
