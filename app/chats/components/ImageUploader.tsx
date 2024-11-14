import * as React from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  activeImage: string | null;
  setActiveImage: (image: string | null) => void;
}

export function ImageUploader({ activeImage, setActiveImage }: ImageUploaderProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setActiveImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
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
            isDragActive && 'border-primary bg-muted'
          )}
        >
          <input {...getInputProps()} />
          {activeImage ? (
            <img
              src={activeImage}
              alt="Uploaded content"
              className="max-h-full w-full object-contain"
            />
          ) : (
            <>
              <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="mb-2 text-sm font-medium">Drag & drop to display an image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
