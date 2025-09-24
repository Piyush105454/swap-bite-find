
import React from 'react';
import { Card } from '@/components/ui/card';
import { FoodMap } from '@/components/FoodMap';

interface MapTabProps {
  items: any[];
  userLocation: {lat: number; lng: number} | null;
  onItemClick: (item: any) => void;
}

export const MapTab: React.FC<MapTabProps> = ({ items, userLocation, onItemClick }) => {
  return (
    <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="h-96">
        <FoodMap 
          items={items}
          userLocation={userLocation}
          onItemClick={onItemClick}
        />
      </div>
    </Card>
  );
};
