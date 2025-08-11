import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUploaded?: (url: string, fileName: string, fileType: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ 
  onFileUploaded, 
  accept = "*/*", 
  maxSize = 10,
  className 
}: FileUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    url: string;
    type: string;
    status: 'uploading' | 'success' | 'error';
  }>>([]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxSize}MB limit`,
          variant: "destructive",
        });
        continue;
      }

      // Add file to uploading state
      const fileEntry = {
        name: file.name,
        url: '',
        type: file.type,
        status: 'uploading' as const
      };
      
      setUploadedFiles(prev => [...prev, fileEntry]);
      setIsUploading(true);

      try {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${user.id}/${timestamp}-${file.name}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('chat-uploads')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('chat-uploads')
          .getPublicUrl(data.path);

        // Update file status
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === file.name && f.status === 'uploading'
              ? { ...f, url: publicUrl, status: 'success' as const }
              : f
          )
        );

        // Notify parent component
        onFileUploaded?.(publicUrl, file.name, file.type);

        toast({
          title: "File uploaded",
          description: `${file.name} uploaded successfully`,
        });

      } catch (error: any) {
        console.error('Upload error:', error);
        
        // Update file status to error
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === file.name && f.status === 'uploading'
              ? { ...f, status: 'error' as const }
              : f
          )
        );

        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload file",
          variant: "destructive",
        });
      }
    }

    setIsUploading(false);
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    return '📎';
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50",
          isUploading && "border-primary/50 bg-primary/5"
        )}
        onClick={handleFileSelect}
      >
        <div className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload files
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, images, documents up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {file.status === 'uploading' && (
                        <Badge variant="secondary" className="text-xs">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-1" />
                          Uploading...
                        </Badge>
                      )}
                      {file.status === 'success' && (
                        <Badge variant="default" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                          <Check className="w-3 h-3 mr-1" />
                          Uploaded
                        </Badge>
                      )}
                      {file.status === 'error' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.name);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}