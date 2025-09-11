
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAddFoodForm } from '@/hooks/useAddFoodForm';
import { BasicFoodFields } from '@/components/food/BasicFoodFields';
import { ExpiryDateTimeFields } from '@/components/food/ExpiryDateTimeFields';
import { ImageUploadField } from '@/components/food/ImageUploadField';
import { LocationSelectionField } from '@/components/food/LocationSelectionField';

interface AddFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFoodAdded: () => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  open,
  onOpenChange,
  onFoodAdded,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    formData,
    handleInputChange,
    handleLocationSelect,
    handleImageSelect,
    resetForm
  } = useAddFoodForm();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('food-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('food-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to share food');
      return;
    }

    if (!formData.location) {
      toast.error('Please select a location');
      return;
    }

    if (!formData.expireDate || !formData.expireTime) {
      toast.error('Please set an expiry date and time');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      const expireDateTime = new Date(`${formData.expireDate}T${formData.expireTime}`);

      const { error } = await supabase
        .from('food_items')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: imageUrl,
          location_lat: formData.location.lat,
          location_lng: formData.location.lng,
          location_address: formData.location.address,
          user_id: user.id,
          expire_date: expireDateTime.toISOString()
        });

      if (error) throw error;

      toast.success('Food item shared successfully!');
      resetForm();
      onFoodAdded();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sharing food:', error);
      toast.error('Failed to share food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Food with Community</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicFoodFields
            title={formData.title}
            description={formData.description}
            category={formData.category}
            onInputChange={handleInputChange}
          />

          <ImageUploadField onImageSelect={handleImageSelect} />
          
          <ExpiryDateTimeFields
            expireDate={formData.expireDate}
            expireTime={formData.expireTime}
            onInputChange={handleInputChange}
          />

          <LocationSelectionField
            location={formData.location}
            onLocationSelect={handleLocationSelect}
          />

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white"
            disabled={loading}
          >
            {loading ? 'Sharing...' : 'Share Food'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
