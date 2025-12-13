import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectsForSemester, modules } from '@/data/curriculum';
import { motion } from 'framer-motion';
import { ClipboardList, ChevronRight, Lock } from 'lucide-react';

export default function QuizModuleSelect() {
  const { semester, subjectId } = useParams<{ semester: string; subjectId: string }>();
  const { user } = useAuth();
  const semesterNum = parseInt(semester || '1');
  
  const subjects = user?.branch 
    ? getSubjectsForSemester(user.branch, semesterNum)
    : [];
  
  const subject = subjects.find(s => s.id === subjectId);
  
  // Filter only modules (not PYQ or two-marks)
  const quizModules = modules.filter(m => m.id.startsWith('module'));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title={`${subject?.name || 'Subject'} Quiz`}
        subtitle={`${subject?.code} • Select a module to start practicing`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizModules.map((module, index) => (
            <Link 
              key={module.id} 
              to={`/quiz/semester/${semester}/subject/${subjectId}/module/${module.id}`}
            >
              <MotionCard
                variant="interactive"
                delay={index * 0.05}
                className="group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-medium text-foreground">
                        {module.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">~20 Questions</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </MotionCard>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Link 
            to={`/quiz/semester/${semester}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Subjects
          </Link>
        </motion.div>
      </PageContainer>
    </div>
  );
}
