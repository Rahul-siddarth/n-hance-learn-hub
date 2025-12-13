import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectsForSemester, modules } from '@/data/curriculum';
import { motion } from 'framer-motion';
import { ClipboardCheck, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuizPlaceholder() {
  const { semester, subjectId, moduleId } = useParams<{ 
    semester: string; 
    subjectId: string;
    moduleId: string;
  }>();
  const { user } = useAuth();
  const semesterNum = parseInt(semester || '1');
  
  const subjects = user?.branch 
    ? getSubjectsForSemester(user.branch, semesterNum)
    : [];
  
  const subject = subjects.find(s => s.id === subjectId);
  const module = modules.find(m => m.id === moduleId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl"
        >
          <div className="rounded-lg border border-border bg-card p-8 text-center shadow-card">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <ClipboardCheck className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {module?.name} Quiz
            </h1>
            <p className="mt-2 text-muted-foreground">
              {subject?.name} • {subject?.code}
            </p>

            <div className="my-8 grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
              <div className="text-center">
                <div className="flex justify-center">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-1 text-lg font-semibold text-foreground">~20</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="text-center border-x border-border">
                <div className="flex justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-1 text-lg font-semibold text-foreground">30</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-1 text-lg font-semibold text-foreground">MCQ</p>
                <p className="text-xs text-muted-foreground">Format</p>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Quiz Coming Soon</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This quiz module is currently under development. Questions will be 
                    available once uploaded by the administrator.
                  </p>
                </div>
              </div>
            </div>

            <Button disabled size="lg" className="w-full">
              Start Quiz (Coming Soon)
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link 
              to={`/quiz/semester/${semester}/subject/${subjectId}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Modules
            </Link>
          </motion.div>
        </motion.div>
      </PageContainer>
    </div>
  );
}
