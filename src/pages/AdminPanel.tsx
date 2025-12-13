import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { MotionCard } from '@/components/ui/motion-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Branch } from '@/contexts/AuthContext';
import { semesters, modules, curriculum } from '@/data/curriculum';
import { Upload, FileText, BookOpen, ClipboardCheck, FolderOpen, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const branches: Branch[] = ['CSE', 'EEE', 'Mechanical', 'ECE', 'Civil'];

export default function AdminPanel() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | ''>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [uploadType, setUploadType] = useState<'material' | 'reference' | 'quiz'>('material');
  const { toast } = useToast();

  const subjects = selectedBranch && selectedSemester
    ? curriculum[selectedBranch]?.[parseInt(selectedSemester)] || []
    : [];

  const handleUpload = () => {
    toast({
      title: 'Upload Simulated',
      description: 'In production, this would upload the file to the server.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer 
        title="Admin Panel" 
        subtitle="Manage study materials, references, and quizzes"
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
                    <Label>Branch</Label>
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
                    <Label>Semester</Label>
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
                  <Label>Subject</Label>
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

                <div className="space-y-2">
                  <Label>Module / Section</Label>
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
                    <Button
                      variant={uploadType === 'quiz' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadType('quiz')}
                    >
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Quiz
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Title / Description</Label>
                  <Input placeholder="Enter title or description" />
                </div>

                {uploadType === 'reference' && (
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input placeholder="Enter author name" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary/50">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supports PDF, DOC, DOCX, PPT, PPTX
                    </p>
                  </div>
                </div>

                <Button onClick={handleUpload} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Content
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
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="material">Materials</SelectItem>
                      <SelectItem value="reference">References</SelectItem>
                      <SelectItem value="quiz">Quizzes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
                <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">No Content Uploaded Yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Uploaded materials, references, and quizzes will appear here for management.
                </p>
              </div>
            </MotionCard>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}
