
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImageUploadFieldProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  onImageSelect
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">Food Photo</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageSelect(file);
        }}
      />
    </div>
  );
};
