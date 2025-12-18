import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { BookOpen, Library, ClipboardCheck, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'materials',
    title: 'Material Section',
    description: 'Access lecture notes, modules, and study materials organized by semester and subject.',
    icon: BookOpen,
    href: '/materials',
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'references',
    title: 'Study References',
    description: 'Browse recommended textbooks and reference materials for each subject.',
    icon: Library,
    href: '/references',
    color: 'bg-carbon/10 text-carbon',
  },
  {
    id: 'quiz',
    title: 'Quiz / Practice Tests',
    description: 'Test your knowledge with module-wise quizzes and practice tests.',
    icon: ClipboardCheck,
    href: '/quiz',
    color: 'bg-secondary-foreground/10 text-secondary-foreground',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-secondary/40 via-secondary/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/15 via-transparent to-transparent blur-3xl" />
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-primary/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-40 w-16 h-16 border border-secondary/20 rounded-full" />
        <div className="absolute bottom-32 left-20 w-24 h-24 border border-primary/10 rounded-full" />
        <div className="absolute top-1/2 left-10 w-2 h-2 bg-primary/30 rounded-full" />
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-secondary/40 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-primary/20 rounded-full" />
      </div>

      <Header />
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Hi, {user?.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome to your learning dashboard. Choose a section to get started.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section, index) => (
            <Link key={section.id} to={section.href}>
              <MotionCard
                variant="interactive"
                delay={index * 0.1}
                className="group h-full backdrop-blur-sm bg-card/80 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`mb-4 inline-flex rounded-lg p-3 ${section.color}`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <h2 className="mb-2 font-serif text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  {section.description}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  <span>Explore</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </MotionCard>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-12 rounded-lg border border-border/50 bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20 p-6 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Your Branch: {user?.branch}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All materials and subjects are tailored to your {user?.branch} curriculum.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Decorative bottom elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex justify-center gap-2"
        >
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary/40 to-primary/10" />
          <div className="h-1 w-4 rounded-full bg-gradient-to-r from-secondary/40 to-secondary/10" />
          <div className="h-1 w-6 rounded-full bg-gradient-to-r from-primary/30 to-transparent" />
        </motion.div>
      </PageContainer>
    </div>
  );
}
