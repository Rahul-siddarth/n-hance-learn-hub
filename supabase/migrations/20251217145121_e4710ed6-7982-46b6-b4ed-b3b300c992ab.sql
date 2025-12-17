-- Create storage buckets for materials and references
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('references', 'references', true);

-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  branch TEXT NOT NULL,
  semester INTEGER NOT NULL,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  module_id TEXT NOT NULL,
  module_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reference_books table
CREATE TABLE public.reference_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  branch TEXT NOT NULL,
  semester INTEGER NOT NULL,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_books ENABLE ROW LEVEL SECURITY;

-- Materials RLS Policies
CREATE POLICY "Anyone can view materials"
ON public.materials
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert materials"
ON public.materials
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update materials"
ON public.materials
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete materials"
ON public.materials
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Reference Books RLS Policies
CREATE POLICY "Anyone can view reference_books"
ON public.reference_books
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert reference_books"
ON public.reference_books
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reference_books"
ON public.reference_books
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reference_books"
ON public.reference_books
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Storage Policies for materials bucket
CREATE POLICY "Anyone can view materials files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'materials');

CREATE POLICY "Admins can upload materials files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'materials' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update materials files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'materials' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete materials files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'materials' AND has_role(auth.uid(), 'admin'));

-- Storage Policies for references bucket
CREATE POLICY "Anyone can view references files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'references');

CREATE POLICY "Admins can upload references files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'references' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update references files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'references' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete references files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'references' AND has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON public.materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reference_books_updated_at
BEFORE UPDATE ON public.reference_books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();