import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-carbon shadow-soft">
            <GraduationCap className="h-10 w-10 text-carbon-foreground" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-4 font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          N-HANCE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12 text-lg text-muted-foreground md:text-xl"
        >
          Enhancing learning, semester by semester.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Link to="/register">
            <Button size="lg" className="w-full min-w-[200px] sm:w-auto">
              <BookOpen className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full min-w-[200px] sm:w-auto">
              I already have an account
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-8 text-center text-sm text-muted-foreground"
      >
        <p>© {new Date().getFullYear()} N-HANCE. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}
