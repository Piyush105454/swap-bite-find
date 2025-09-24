
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { ExpiryBadge } from './ExpiryBadge';

interface FoodCardHeaderProps {
  image: string;
  title: string;
  category: string;
  expireDate?: string;
  isLiked: boolean;
  onLike: () => void;
}

export const FoodCardHeader: React.FC<FoodCardHeaderProps> = ({
  image,
  title,
  category,
  expireDate,
  isLiked,
  onLike
}) => {
  return (
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <CategoryBadge category={category} />
        {expireDate && <ExpiryBadge expireDate={expireDate} />}
      </div>
      <div className="absolute top-3 right-3">
        <Button
          size="sm"
          variant="ghost"
          className={`bg-white/90 backdrop-blur-sm hover:bg-white ${
            isLiked ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={onLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
