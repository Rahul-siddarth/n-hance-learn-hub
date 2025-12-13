import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectsForSemester } from '@/data/curriculum';
import { ChevronRight, Library } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReferenceSubjectSelect() {
  const { semester } = useParams<{ semester: string }>();
  const { user } = useAuth();
  const semesterNum = parseInt(semester || '1');
  
  const subjects = user?.branch 
    ? getSubjectsForSemester(user.branch, semesterNum)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title={`Semester ${semesterNum} References`}
        subtitle={`Select a subject to view reference books • ${user?.branch}`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject, index) => (
            <Link 
              key={subject.id} 
              to={`/references/semester/${semester}/subject/${subject.id}`}
            >
              <MotionCard
                variant="interactive"
                delay={index * 0.05}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-carbon/10 p-2">
                    <Library className="h-5 w-5 text-carbon" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {subject.code}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {subject.name}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-primary">
                      <span>View Books</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </MotionCard>
            </Link>
          ))}
        </div>

        {subjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-border bg-muted/50 p-8 text-center"
          >
            <p className="text-muted-foreground">
              No subjects available for this semester yet.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Link 
            to="/references" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Semesters
          </Link>
        </motion.div>
      </PageContainer>
    </div>
  );
}
