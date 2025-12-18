import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Branch, useAuth } from '@/contexts/AuthContext';
import { semesters, modules, curriculum } from '@/data/curriculum';
import { Upload, FileText, BookOpen, FolderOpen, Trash2, Loader2, Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const branches: Branch[] = ['CSE', 'EEE', 'Mechanical', 'ECE', 'Civil'];

interface Material {
  id: string;
  title: string;
  description: string | null;
  branch: string;
  semester: number;
  subject_id: string;
  subject_name: string;
  module_id: string;
  module_name: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
}

interface ReferenceBook {
  id: string;
  title: string;
  author: string;
  branch: string;
  semester: number;
  subject_id: string;
  subject_name: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<Branch | ''>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [uploadType, setUploadType] = useState<'material' | 'reference'>('material');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [referenceBooks, setReferenceBooks] = useState<ReferenceBook[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'material' | 'reference'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const subjects = selectedBranch && selectedSemester
    ? curriculum[selectedBranch]?.[parseInt(selectedSemester)] || []
    : [];

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const selectedModuleData = modules.find(m => m.id === selectedModule);

  // Fetch existing content
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const [materialsRes, referencesRes] = await Promise.all([
        supabase.from('materials').select('*').order('created_at', { ascending: false }),
        supabase.from('reference_books').select('*').order('created_at', { ascending: false })
      ]);

      if (materialsRes.data) setMaterials(materialsRes.data);
      if (referencesRes.data) setReferenceBooks(referencesRes.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload PDF, DOC, DOCX, PPT, or PPTX files only.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedBranch || !selectedSemester || !selectedSubject || !title || !selectedFile || !user) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields and select a file.',
        variant: 'destructive',
      });
      return;
    }

    if (uploadType === 'material' && !selectedModule) {
      toast({
        title: 'Missing module',
        description: 'Please select a module for the material.',
        variant: 'destructive',
      });
      return;
    }

    if (uploadType === 'reference' && !author) {
      toast({
        title: 'Missing author',
        description: 'Please enter the author name for the reference book.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const bucket = uploadType === 'material' ? 'materials' : 'references';
      const filePath = `${selectedBranch}/${selectedSemester}/${selectedSubject}/${Date.now()}_${selectedFile.name}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Insert record into database
      if (uploadType === 'material') {
        const { error: dbError } = await supabase.from('materials').insert({
          title,
          branch: selectedBranch,
          semester: parseInt(selectedSemester),
          subject_id: selectedSubject,
          subject_name: selectedSubjectData?.name || '',
          module_id: selectedModule,
          module_name: selectedModuleData?.name || '',
          file_path: filePath,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          uploaded_by: user.id,
        });

        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('reference_books').insert({
          title,
          author,
          branch: selectedBranch,
          semester: parseInt(selectedSemester),
          subject_id: selectedSubject,
          subject_name: selectedSubjectData?.name || '',
          file_path: filePath,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          uploaded_by: user.id,
        });

        if (dbError) throw dbError;
      }

      toast({
        title: 'Upload successful',
        description: `${uploadType === 'material' ? 'Material' : 'Reference book'} uploaded successfully.`,
      });

      // Reset form
      setTitle('');
      setAuthor('');
      setSelectedFile(null);
      setSelectedModule('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh content list
      fetchContent();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred during upload.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (type: 'material' | 'reference', id: string, filePath: string) => {
    try {
      const bucket = type === 'material' ? 'materials' : 'references';
      
      // Delete file from storage
      await supabase.storage.from(bucket).remove([filePath]);

      // Delete record from database
      if (type === 'material') {
        await supabase.from('materials').delete().eq('id', id);
      } else {
        await supabase.from('reference_books').delete().eq('id', id);
      }

      toast({
        title: 'Deleted successfully',
        description: 'The content has been removed.',
      });

      fetchContent();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'An error occurred while deleting.',
        variant: 'destructive',
      });
    }
  };

  const getSignedUrl = async (bucket: string, filePath: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
    return data.signedUrl;
  };

  const handleDownload = async (bucket: string, filePath: string) => {
    const url = await getSignedUrl(bucket, filePath);
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: 'Download failed',
        description: 'Could not generate download link.',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const filteredContent = [
    ...(filterType === 'all' || filterType === 'material' 
      ? materials.map(m => ({ ...m, type: 'material' as const })) 
      : []),
    ...(filterType === 'all' || filterType === 'reference' 
      ? referenceBooks.map(r => ({ ...r, type: 'reference' as const })) 
      : [])
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title="Admin Panel" 
        subtitle="Manage study materials and reference books"
      >
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="manage">Manage Content</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Selection Panel */}
              <MotionCard variant="elevated" className="space-y-4">
                <h3 className="font-serif text-lg font-semibold">Select Target</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Branch *</Label>
                    <Select 
                      value={selectedBranch} 
                      onValueChange={(v) => {
                        setSelectedBranch(v as Branch);
                        setSelectedSubject('');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {branches.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Semester *</Label>
                    <Select 
                      value={selectedSemester} 
                      onValueChange={(v) => {
                        setSelectedSemester(v);
                        setSelectedSubject('');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {semesters.map((s) => (
                          <SelectItem key={s} value={s.toString()}>
                            Semester {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select 
                    value={selectedSubject} 
                    onValueChange={setSelectedSubject}
                    disabled={!subjects.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={subjects.length ? "Select subject" : "Select branch & semester first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.code} - {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {uploadType === 'material' && (
                  <div className="space-y-2">
                    <Label>Module / Section *</Label>
                    <Select value={selectedModule} onValueChange={setSelectedModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {modules.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </MotionCard>

              {/* Upload Panel */}
              <MotionCard variant="elevated" delay={0.1} className="space-y-4">
                <h3 className="font-serif text-lg font-semibold">Upload Content</h3>

                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={uploadType === 'material' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadType('material')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Material
                    </Button>
                    <Button
                      variant={uploadType === 'reference' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadType('reference')}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Reference
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input 
                    placeholder="Enter title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {uploadType === 'reference' && (
                  <div className="space-y-2">
                    <Label>Author *</Label>
                    <Input 
                      placeholder="Enter author name" 
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>File Upload *</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary/50"
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click to browse files
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Supports PDF, DOC, DOCX, PPT, PPTX
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Content
                    </>
                  )}
                </Button>
              </MotionCard>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <MotionCard variant="elevated">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold">Uploaded Content</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filter by:</span>
                  <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="material">Materials</SelectItem>
                      <SelectItem value="reference">References</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="mt-6 flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
                  <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium text-foreground">No Content Uploaded Yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Uploaded materials and references will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {filteredContent.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        {item.type === 'material' ? (
                          <FileText className="h-8 w-8 text-primary" />
                        ) : (
                          <BookOpen className="h-8 w-8 text-accent" />
                        )}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.branch} • Sem {item.semester} • {item.subject_name}
                            {item.type === 'material' && 'module_name' in item && ` • ${item.module_name}`}
                            {item.type === 'reference' && 'author' in item && ` • by ${item.author}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.file_name} • {formatFileSize(item.file_size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(item.type === 'material' ? 'materials' : 'references', item.file_path)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.type, item.id, item.file_path)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </MotionCard>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}