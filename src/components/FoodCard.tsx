import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { RequestFoodModal } from '@/components/RequestFoodModal';
import { ChatModal } from '@/components/ChatModal';
import { useAuth } from '@/contexts/AuthContext';
import { isAfter } from 'date-fns';
import { FoodCardHeader } from './food-card/FoodCardHeader';
import { UserInfo } from './food-card/UserInfo';
import { ExpiryDetails } from './food-card/ExpiryDetails';
import { FoodCardActions } from './food-card/FoodCardActions';

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: { lat: number; lng: number; address: string };
  user: { name: string; avatar: string };
  user_id?: string;
  postedAt: string;
  expireDate?: string;
  likes: number;
  isLiked: boolean;
  quantity: number;
  unit: string;
  carbon_emissions: number;
}

interface FoodCardProps {
  item: FoodItem;
  onLike: (itemId: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onLike }) => {
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Check if the food item has expired
  if (item.expireDate) {
    const expireDate = new Date(item.expireDate);
    const now = new Date();
    if (isAfter(now, expireDate)) {
      console.log('Item expired, not rendering:', item.title);
      return null;
    }
  }

  // Determine if the current user is the owner of the item
  const isOwnItem = user?.id === item.user_id;

  // Open request modal
  const handleRequestClick = () => {
    if (!user) {
      alert('Please log in to request food items');
      return;
    }
    setShowRequestModal(true);
  };

  // Open chat modal
  const handleChatClick = () => {
    if (!user) {
      alert('Please log in to start a chat');
      return;
    }
    setShowChatModal(true);
  };

  // Handle like button click
  const handleLike = () => {
    onLike(item.id);
  };

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
        {/* Card Header */}
        <FoodCardHeader
          image={item.image}
          title={item.title}
          category={item.category}
          expireDate={item.expireDate}
          isLiked={item.isLiked}
          onLike={handleLike}
        />

        <div className="p-6">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
            {item.description}
          </p>

          {/* Quantity */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            Quantity: {item.quantity} {item.unit}
          </p>

          {/* Carbon Emissions */}
          <p className="text-green-600">Carbon Emissions: {item.carbon_emissions.toFixed(2)} kg CO₂e</p>

          {/* Expiry Details */}
          {item.expireDate && <ExpiryDetails expireDate={item.expireDate} />}

          {/* Food Sharer Info */}
          <UserInfo user={item.user} postedAt={item.postedAt} />

          {/* Location */}
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {item.location.address}
          </div>

          {/* Action Buttons */}
          <FoodCardActions
            likes={item.likes}
            isLiked={item.isLiked}
            isOwnItem={isOwnItem}
            onLike={handleLike}
            onChat={handleChatClick}
            onRequest={handleRequestClick}
          />
        </div>
      </Card>

      {/* Request Food Modal */}
      <RequestFoodModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        foodItem={
          item.user_id
            ? { id: item.id, title: item.title, user_id: item.user_id }
            : null
        }
        onRequestSent={() => console.log('Request sent for item:', item.title)}
      />

      {/* Chat Modal */}
      <ChatModal
        open={showChatModal}
        onOpenChange={setShowChatModal}
        otherUserId={item.user_id || ''}
        otherUserName={item.user.name}
      />
    </>
  );
};
