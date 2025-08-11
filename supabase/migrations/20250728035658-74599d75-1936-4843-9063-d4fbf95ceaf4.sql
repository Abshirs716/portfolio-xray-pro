-- Create storage bucket for transaction files
INSERT INTO storage.buckets (id, name, public) VALUES ('transaction-files', 'transaction-files', true);

-- Create policies for transaction file uploads
CREATE POLICY "Users can upload their own transaction files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'transaction-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own transaction files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'transaction-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own transaction files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'transaction-files' AND auth.uid()::text = (storage.foldername(name))[1]);