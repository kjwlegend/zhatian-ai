import * as React from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploaderProps {
  activeImage: string | null;
  setActiveImage: (image: string | null) => void;
}

export function ImageUploader({ activeImage, setActiveImage }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  const uploadToOSS = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderName', 'BOMB-AI');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('上传错误:', error);
      toast.error('文件上传失败');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          // 先显示本地预览
          const reader = new FileReader();
          reader.onload = (e) => {
            setActiveImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);

          // 上传到 OSS
          const ossUrl = await uploadToOSS(file);
          setActiveImage(ossUrl);
        } catch (error) {
          console.error('处理文件错误:', error);
        }
      }
    },
    [setActiveImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    multiple: false,
  });

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardContent className="flex-1 p-4 overflow-auto">
        <div
          {...getRootProps()}
          className={cn(
            'flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center',
            isDragActive && 'border-primary bg-muted',
            isUploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} disabled={isUploading} />
          {activeImage ? (
            <img
              src={activeImage}
              alt="Uploaded content"
              className="max-h-full w-full object-contain"
            />
          ) : (
            <>
              <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="mb-2 text-sm font-medium">
                {isUploading ? '正在上传...' : '拖拽或点击上传图片'}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
