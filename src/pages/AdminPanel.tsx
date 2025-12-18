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
import { Upload, FileText, BookOpen, Trash2, Loader2, Download, Eye } from 'lucide-react';
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
  const [subjectInput, setSubjectInput] = useState('');
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
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 50MB.',
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

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

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
      setSubjectInput('');
      setAuthor('');
      setSelectedFile(null);
      setSelectedModule('');
      if (fileInputRef.current) fileInputRef.current.value = '';

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
      
      await supabase.storage.from(bucket).remove([filePath]);

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
      .createSignedUrl(filePath, 3600);
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
        subtitle=""
      >
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="upload" className="data-[state=active]:bg-background">
              Upload Material
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-background">
              Manage Materials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <MotionCard variant="elevated" className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Upload className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-xl font-semibold">Upload New Material</h3>
              </div>

              <div className="space-y-6">
                {/* Title and Subject Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      placeholder="e.g., Module 1 Notes" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select 
                      value={selectedSubject} 
                      onValueChange={setSelectedSubject}
                      disabled={!subjects.length}
                    >
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder={subjects.length ? "e.g., Data Structures" : "Select department & semester first"} />
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
                </div>

                {/* Department and Semester Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select 
                      value={selectedBranch} 
                      onValueChange={(v) => {
                        setSelectedBranch(v as Branch);
                        setSelectedSubject('');
                      }}
                    >
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {branches.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select 
                      value={selectedSemester} 
                      onValueChange={(v) => {
                        setSelectedSemester(v);
                        setSelectedSubject('');
                      }}
                    >
                      <SelectTrigger className="bg-muted/30">
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

                {/* Content Type and Module/Author Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select 
                      value={uploadType} 
                      onValueChange={(v) => setUploadType(v as 'material' | 'reference')}
                    >
                      <SelectTrigger className="bg-muted/30">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="material">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Study Material
                          </div>
                        </SelectItem>
                        <SelectItem value="reference">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Reference Book
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {uploadType === 'material' ? (
                    <div className="space-y-2">
                      <Label>Module</Label>
                      <Select value={selectedModule} onValueChange={setSelectedModule}>
                        <SelectTrigger className="bg-muted/30">
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
                  ) : (
                    <div className="space-y-2">
                      <Label>Author</Label>
                      <Input 
                        placeholder="e.g., John Smith" 
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="bg-muted/30"
                      />
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>File (PDF or Word, max 50MB)</Label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-muted/30"
                    >
                      Choose file
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                </div>

                {/* Upload Button */}
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Material
                    </>
                  )}
                </Button>
              </div>
            </MotionCard>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <MotionCard variant="elevated" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-semibold">Manage Content</h3>
                <Select value={filterType} onValueChange={(v) => setFilterType(v as 'all' | 'material' | 'reference')}>
                  <SelectTrigger className="w-40 bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="material">Materials</SelectItem>
                    <SelectItem value="reference">References</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No content uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContent.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${item.type === 'material' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                          {item.type === 'material' ? (
                            <FileText className="h-5 w-5 text-primary" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.subject_name} • {item.branch} • Sem {item.semester}
                            {'module_name' in item && ` • ${item.module_name}`}
                            {'author' in item && ` • by ${item.author}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.file_name} • {formatFileSize(item.file_size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(
                            item.type === 'material' ? 'materials' : 'references',
                            item.file_path
                          )}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(
                            item.type === 'material' ? 'materials' : 'references',
                            item.file_path
                          )}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
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
