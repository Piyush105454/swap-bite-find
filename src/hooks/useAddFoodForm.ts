
import { useState } from 'react';

export interface FormData {
  title: string;
  description: string;
  category: string;
  image: File | null;
  location: { lat: number; lng: number; address: string } | null;
  expireDate: string;
  expireTime: string;
}

export const useAddFoodForm = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    image: null,
    location: null,
    expireDate: '',
    expireTime: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
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
      image: null,
      location: null,
      expireDate: '',
      expireTime: ''
    });
  };

  return {
    formData,
    handleInputChange,
    handleLocationSelect,
    handleImageSelect,
    resetForm,
    setFormData
  };
};
