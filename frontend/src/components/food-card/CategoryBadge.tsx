
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-orange-100 text-orange-800',
      baked: 'bg-yellow-100 text-yellow-800',
      desserts: 'bg-pink-100 text-pink-800',
      meals: 'bg-blue-100 text-blue-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Badge className={getCategoryColor(category)}>
      {category}
    </Badge>
  );
};
