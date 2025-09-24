import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAddFoodForm } from "@/hooks/useAddFoodForm";
import { BasicFoodFields } from "@/components/food/BasicFoodFields";
import { ExpiryDateTimeFields } from "@/components/food/ExpiryDateTimeFields";
import { ImageUploadField } from "@/components/food/ImageUploadField";
import { LocationSelectionField } from "@/components/food/LocationSelectionField";
import { QuantityField } from "@/components/food/QuantityField";

interface FormData {
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  image: File | null;
  location: { lat: number; lng: number; address: string } | null;
  expireDate: string;
  expireTime: string;
}

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
  const { addFood, loading } = useAddFoodForm();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    quantity: 1,
    unit: 'pieces',
    image: null,
    location: null,
    expireDate: '',
    expireTime: ''
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | File | { lat: number; lng: number; address: string } | null
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleImageSelect = (file: File) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      quantity: 1,
      unit: 'pieces',
      image: null,
      location: null,
      expireDate: '',
      expireTime: ''
    });
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("food-photos")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("food-photos").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return toast.error("Please log in to share food");
    if (!formData.location) return toast.error("Please select a location");
    if (!formData.expireDate || !formData.expireTime)
      return toast.error("Please set expiry date and time");
    if (!formData.quantity || formData.quantity < 1)
      return toast.error("Please set a valid quantity");

    try {
      // Upload image if provided
      let imageUrl: string | null = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
        if (!imageUrl) {
          return;
        }
      }

      // Combine date + time into ISO format
      const expireDateTime = new Date(
        `${formData.expireDate}T${formData.expireTime}`
      );

      const foodItem = {
        name: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        image_url: imageUrl,
        location_lat: formData.location.lat,
        location_lng: formData.location.lng,
        location_address: formData.location.address,
        user_id: user.id,
        expire_date: expireDateTime.toISOString(),
      };

      await addFood(foodItem);

      resetForm();
      onFoodAdded();
      onOpenChange(false);
    } catch (error) {
      console.error("Error sharing food:", error);
      toast.error("Failed to share food item");
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
          <QuantityField
            quantity={formData.quantity}
            unit={formData.unit}
            onChange={handleInputChange}
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
            {loading ? "Sharing..." : "Share Food"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
