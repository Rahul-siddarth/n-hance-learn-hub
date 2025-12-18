-- Make storage buckets private
UPDATE storage.buckets SET public = false WHERE id = 'materials';
UPDATE storage.buckets SET public = false WHERE id = 'references';

-- Add RLS policy for authenticated users to view materials
CREATE POLICY "Authenticated users can view materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials' AND auth.role() = 'authenticated');

-- Add RLS policy for authenticated users to view references
CREATE POLICY "Authenticated users can view references"
ON storage.objects FOR SELECT
USING (bucket_id = 'references' AND auth.role() = 'authenticated');