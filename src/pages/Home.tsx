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
    <div className="min-h-screen bg-background">
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
                className="group h-full"
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
          className="mt-12 rounded-lg border border-border bg-secondary/30 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-2">
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
      </PageContainer>
    </div>
  );
}
