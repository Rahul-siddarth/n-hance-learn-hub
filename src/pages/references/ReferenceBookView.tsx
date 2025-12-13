import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectsForSemester } from '@/data/curriculum';
import { motion } from 'framer-motion';
import { BookMarked, ExternalLink } from 'lucide-react';

export default function ReferenceBookView() {
  const { semester, subjectId } = useParams<{ semester: string; subjectId: string }>();
  const { user } = useAuth();
  const semesterNum = parseInt(semester || '1');
  
  const subjects = user?.branch 
    ? getSubjectsForSemester(user.branch, semesterNum)
    : [];
  
  const subject = subjects.find(s => s.id === subjectId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title={`${subject?.name || 'Subject'} References`}
        subtitle={`${subject?.code} • Semester ${semesterNum}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <BookMarked className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl font-medium text-foreground">
            No Reference Books Yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Reference books for this subject will appear here once uploaded by the administrator.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Link 
            to={`/references/semester/${semester}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Subjects
          </Link>
        </motion.div>
      </PageContainer>
    </div>
  );
}
