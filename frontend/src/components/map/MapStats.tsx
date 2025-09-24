
import React from 'react';

interface MapStatsProps {
  itemsCount: number;
  userLocation: {lat: number; lng: number} | null;
}

export const MapStats: React.FC<MapStatsProps> = ({ itemsCount, userLocation }) => {
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <p className="text-sm text-gray-600">
          📍 {itemsCount} food items nearby
        </p>
        {userLocation && (
          <p className="text-xs text-gray-500 mt-1">
            Within 10km of your location
          </p>
        )}
      </div>
    </div>
  );
};
