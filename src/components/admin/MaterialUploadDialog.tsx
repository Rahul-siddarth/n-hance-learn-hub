import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface MaterialUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: string;
  semester: number;
  subjectId: string;
  subjectName: string;
  moduleId: string;
  moduleName: string;
  existingMaterial?: {
    id: string;
    title: string;
    description: string | null;
    file_path: string;
  } | null;
  onSuccess: () => void;
}

export function MaterialUploadDialog({
  open,
  onOpenChange,
  branch,
  semester,
  subjectId,
  subjectName,
  moduleId,
  moduleName,
  existingMaterial,
  onSuccess,
}: MaterialUploadDialogProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(existingMaterial?.title || '');
  const [description, setDescription] = useState(existingMaterial?.description || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!validTypes.includes(file.type)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for the material.',
        variant: 'destructive',
      });
      return;
    }

    if (!existingMaterial && !selectedFile) {
      toast({
        title: 'File required',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let filePath = existingMaterial?.file_path || '';
      let fileName = '';
      let fileSize: number | null = null;

      if (selectedFile) {
        // Delete old file if replacing
        if (existingMaterial?.file_path) {
          await supabase.storage.from('materials').remove([existingMaterial.file_path]);
        }

        // Upload new file
        const fileExt = selectedFile.name.split('.').pop();
        filePath = `${branch}/${semester}/${subjectId}/${moduleId}/${Date.now()}.${fileExt}`;
        fileName = selectedFile.name;
        fileSize = selectedFile.size;

        const { error: uploadError } = await supabase.storage
          .from('materials')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;
      }

      if (existingMaterial) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('materials')
          .update({
            title: title.trim(),
            description: description.trim() || null,
            ...(selectedFile && { file_path: filePath, file_name: fileName, file_size: fileSize }),
          })
          .eq('id', existingMaterial.id);

        if (updateError) throw updateError;

        toast({
          title: 'Material updated',
          description: 'The material has been updated successfully.',
        });
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('materials')
          .insert({
            branch,
            semester,
            subject_id: subjectId,
            subject_name: subjectName,
            module_id: moduleId,
            module_name: moduleName,
            title: title.trim(),
            description: description.trim() || null,
            file_path: filePath,
            file_name: fileName,
            file_size: fileSize,
            uploaded_by: user.id,
          });

        if (insertError) throw insertError;

        toast({
          title: 'Material uploaded',
          description: 'The material has been uploaded successfully.',
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload material.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {existingMaterial ? 'Update Material' : 'Upload Material'}
          </DialogTitle>
          <DialogDescription>
            {moduleName} • {subjectName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter material title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the material"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>File {existingMaterial ? '(optional - upload to replace)' : ''}</Label>
            <div
              className="relative cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
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
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to upload PDF, DOC, DOCX, PPT, or PPTX
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : existingMaterial ? (
                'Update'
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
