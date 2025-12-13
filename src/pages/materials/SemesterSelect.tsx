import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { semesters } from '@/data/curriculum';
import { ChevronRight } from 'lucide-react';

export default function SemesterSelect() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title="Material Section" 
        subtitle="Select a semester to view subjects and study materials"
      >
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {semesters.map((semester, index) => (
            <Link key={semester} to={`/materials/semester/${semester}`}>
              <MotionCard
                variant="interactive"
                delay={index * 0.05}
                className="group text-center"
              >
                <div className="mb-2 text-4xl font-bold text-primary">{semester}</div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  Semester {semester}
                </h3>
                <div className="mt-3 flex items-center justify-center text-sm text-muted-foreground">
                  <span>View Subjects</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </MotionCard>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link 
            to="/home" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </PageContainer>
    </div>
  );
}
