import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjectsForSemester, modules } from '@/data/curriculum';
import { motion } from 'framer-motion';
import { FileText, Download, Folder, HelpCircle, Clock, Upload, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MaterialUploadDialog } from '@/components/admin/MaterialUploadDialog';

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number | null;
  module_id: string;
}

export default function MaterialView() {
  const { semester, subjectId } = useParams<{ semester: string; subjectId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const semesterNum = parseInt(semester || '1');
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<{ id: string; name: string } | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const subjects = user?.branch 
    ? getSubjectsForSemester(user.branch, semesterNum)
    : [];
  
  const subject = subjects.find(s => s.id === subjectId);

  const fetchMaterials = async () => {
    if (!user?.branch || !subjectId) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('branch', user.branch)
      .eq('semester', semesterNum)
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error fetching materials:', error);
    } else {
      setMaterials(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, [user?.branch, semesterNum, subjectId]);

  const handleDownload = async (material: Material) => {
    setDownloadingId(material.id);
    const { data, error } = await supabase.storage
      .from('materials')
      .createSignedUrl(material.file_path, 3600);

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

  const handleUploadClick = (module: { id: string; name: string }) => {
    setSelectedModule(module);
    setEditingMaterial(null);
    setUploadDialogOpen(true);
  };

  const handleEditClick = (material: Material, module: { id: string; name: string }) => {
    setSelectedModule(module);
    setEditingMaterial(material);
    setUploadDialogOpen(true);
  };

  const getModuleIcon = (moduleId: string) => {
    if (moduleId === 'pyq') return HelpCircle;
    if (moduleId === 'two-marks') return Clock;
    return Folder;
  };

  const getMaterialForModule = (moduleId: string) => {
    return materials.find(m => m.module_id === moduleId);
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
        title={subject?.name || 'Subject'}
        subtitle={`${subject?.code} • Semester ${semesterNum}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => {
              const Icon = getModuleIcon(module.id);
              const material = getMaterialForModule(module.id);
              
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

                  {material ? (
                    <div className="mt-4 rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{material.title}</p>
                          {material.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {material.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatFileSize(material.file_size)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDownload(material)}
                          disabled={downloadingId === material.id}
                        >
                          {downloadingId === material.id ? (
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
                            onClick={() => handleEditClick(material, module)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4">
                      {user?.isAdmin ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleUploadClick(module)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Material
                        </Button>
                      ) : (
                        <>
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>No materials uploaded yet</span>
                          </div>
                          <p className="mt-2 text-center text-xs text-muted-foreground">
                            Materials will appear here once uploaded by admin
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </MotionCard>
              );
            })}
          </div>
        )}

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

        {selectedModule && subject && user?.branch && (
          <MaterialUploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            branch={user.branch}
            semester={semesterNum}
            subjectId={subjectId || ''}
            subjectName={subject.name}
            moduleId={selectedModule.id}
            moduleName={selectedModule.name}
            existingMaterial={editingMaterial}
            onSuccess={fetchMaterials}
          />
        )}
      </PageContainer>
    </div>
  );
}
