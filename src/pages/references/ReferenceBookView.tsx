import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectsForSemester } from '@/data/curriculum';
import { motion } from 'framer-motion';
import { BookMarked, Download, Upload, Edit, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReferenceUploadDialog } from '@/components/admin/ReferenceUploadDialog';

interface ReferenceBook {
  id: string;
  title: string;
  author: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
}

export default function ReferenceBookView() {
  const { semester, subjectId } = useParams<{ semester: string; subjectId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const semesterNum = parseInt(semester || '1');
  
  const [references, setReferences] = useState<ReferenceBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<ReferenceBook | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const subjects = user?.branch 
    ? getSubjectsForSemester(user.branch, semesterNum)
    : [];
  
  const subject = subjects.find(s => s.id === subjectId);

  const fetchReferences = async () => {
    if (!user?.branch || !subjectId) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('reference_books')
      .select('*')
      .eq('branch', user.branch)
      .eq('semester', semesterNum)
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error fetching references:', error);
    } else {
      setReferences(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReferences();
  }, [user?.branch, semesterNum, subjectId]);

  const handleDownload = async (reference: ReferenceBook) => {
    setDownloadingId(reference.id);
    const { data, error } = await supabase.storage
      .from('references')
      .createSignedUrl(reference.file_path, 3600);

    if (error || !data?.signedUrl) {
      toast({
        title: 'Download failed',
        description: 'Could not generate download link.',
        variant: 'destructive',
      });
    } else {
      window.open(data.signedUrl, '_blank');
    }
    setDownloadingId(null);
  };

  const handleUploadClick = () => {
    setEditingReference(null);
    setUploadDialogOpen(true);
  };

  const handleEditClick = (reference: ReferenceBook) => {
    setEditingReference(reference);
    setUploadDialogOpen(true);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title={`${subject?.name || 'Subject'} References`}
        subtitle={`${subject?.code} • Semester ${semesterNum}`}
      >
        {user?.isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button onClick={handleUploadClick} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Reference Book
            </Button>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : references.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {references.map((reference, index) => (
              <MotionCard
                key={reference.id}
                variant="elevated"
                delay={index * 0.05}
                className="group"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-carbon/10 p-2">
                    <BookMarked className="h-5 w-5 text-carbon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-medium text-foreground line-clamp-2">
                      {reference.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      by {reference.author}
                    </p>
                    {reference.file_size && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(reference.file_size)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(reference)}
                    disabled={downloadingId === reference.id}
                  >
                    {downloadingId === reference.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                  {user?.isAdmin && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditClick(reference)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </MotionCard>
            ))}
          </div>
        ) : (
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
              {user?.isAdmin 
                ? 'Click the button above to add reference books for this subject.'
                : 'Reference books for this subject will appear here once uploaded by the administrator.'}
            </p>
            {user?.isAdmin && (
              <Button onClick={handleUploadClick} className="mt-4 gap-2">
                <Upload className="h-4 w-4" />
                Upload Reference Book
              </Button>
            )}
          </motion.div>
        )}

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

        {subject && user?.branch && (
          <ReferenceUploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            branch={user.branch}
            semester={semesterNum}
            subjectId={subjectId || ''}
            subjectName={subject.name}
            existingReference={editingReference}
            onSuccess={fetchReferences}
          />
        )}
      </PageContainer>
    </div>
  );
}
