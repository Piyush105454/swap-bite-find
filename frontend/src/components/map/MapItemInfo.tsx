import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Heart } from 'lucide-react';

interface FoodItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: { lat: number; lng: number; address: string };
  user: { name: string; avatar: string };
  postedAt: string;
  likes: number;
  isLiked: boolean;
  expire_date?: string;
}

interface MapItemInfoProps {
  selectedItem: FoodItem;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
  onGetDirections: (item: FoodItem) => void;
}

// Calculate distance (in km) between two lat-lng points
const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const MapItemInfo: React.FC<MapItemInfoProps> = ({
  selectedItem,
  userLocation,
  onClose,
  onGetDirections,
}) => {
  // Calculate distance if userLocation is available
  const distanceKm =
    userLocation &&
    calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      selectedItem.location.lat,
      selectedItem.location.lng
    );

  return (
    <div className="absolute top-4 left-4 z-10">
      <Card className="p-4 max-w-sm bg-white/95 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <img
            src={selectedItem.image}
            alt={selectedItem.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {selectedItem.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {selectedItem.description}
            </p>
            {selectedItem.expire_date && (
              <p className="text-xs text-orange-600 mt-1">
                Expires: {new Date(selectedItem.expire_date).toLocaleDateString()}
              </p>
            )}

            {distanceKm !== undefined && (
              <p className="text-xs text-gray-700 mt-1">
                Distance: {distanceKm.toFixed(2)} km
              </p>
            )}

            <div className="flex items-center space-x-2 mt-2">
              <Badge className="text-xs">{selectedItem.category}</Badge>
              <div className="flex items-center text-gray-500 text-xs">
                <Heart className="h-3 w-3 mr-1" />
                {selectedItem.likes}
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <Button
                size="sm"
                onClick={() => onGetDirections(selectedItem)}
                className="flex items-center space-x-1"
              >
                <Navigation className="h-3 w-3" />
                <span>Directions</span>
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
