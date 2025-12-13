import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectsForSemester, modules } from '@/data/curriculum';
import { motion } from 'framer-motion';
import { FileText, Download, Folder, HelpCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MaterialView() {
  const { semester, subjectId } = useParams<{ semester: string; subjectId: string }>();
  const { user } = useAuth();
  const semesterNum = parseInt(semester || '1');
  
  const subjects = user?.branch 
    ? getSubjectsForSemester(user.branch, semesterNum)
    : [];
  
  const subject = subjects.find(s => s.id === subjectId);

  const getModuleIcon = (moduleId: string) => {
    if (moduleId === 'pyq') return HelpCircle;
    if (moduleId === 'two-marks') return Clock;
    return Folder;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title={subject?.name || 'Subject'}
        subtitle={`${subject?.code} • Semester ${semesterNum}`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = getModuleIcon(module.id);
            return (
              <MotionCard
                key={module.id}
                variant="elevated"
                delay={index * 0.05}
                className="group"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-secondary p-2">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-medium text-foreground">
                      {module.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>No materials uploaded yet</span>
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Materials will appear here once uploaded by admin
                  </p>
                </div>
              </MotionCard>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link 
            to={`/materials/semester/${semester}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Subjects
          </Link>
        </motion.div>
      </PageContainer>
    </div>
  );
}
