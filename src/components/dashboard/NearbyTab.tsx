
import React from 'react';
import { Card } from '@/components/ui/card';
import { FoodCard } from '@/components/FoodCard';

interface FoodItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  location_lat: number;
  location_lng: number;
  location_address: string;
  user_id: string;
  created_at: string;
  expire_date: Date | null;
  quantity: number;
  unit: string;
  carbon_emissions: number;
  user: {
    full_name: string;
    avatar_url: string;
  };
}

interface FoodCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  postedAt: string;
  likes: number;
  isLiked: boolean;
  quantity: number;
  unit: string;
  carbon_emissions: number;
  user: {
    name: string;
    avatar: string;
  };
}

interface NearbyTabProps {
  items: FoodItem[];
  loading: boolean;
  onLike: (itemId: string) => void;
  convertToFoodCardFormat: (item: FoodItem) => FoodCardItem;
}

export const NearbyTab: React.FC<NearbyTabProps> = ({ 
  items, 
  loading, 
  onLike, 
  convertToFoodCardFormat 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <p className="text-gray-500 dark:text-gray-400">No food items found nearby.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Food shared by community members
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => {
          const convertedItem = convertToFoodCardFormat(item);
          console.log('Food shared by:', item.user.full_name); // Debug log to see the sharer's name
          return (
            <FoodCard
              key={item.id}
              item={convertedItem}
              onLike={onLike}
            />
          );
        })}
      </div>
    </div>
  );
};
