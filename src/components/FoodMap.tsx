
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MapContainer } from '@/components/map/MapContainer';
import { MapItemInfo } from '@/components/map/MapItemInfo';
import { MapStats } from '@/components/map/MapStats';
import { calculateDistance } from '@/utils/mapUtils';

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

interface FoodMapProps {
  items: FoodItem[];
  userLocation: {lat: number; lng: number} | null;
  onItemClick: (item: FoodItem) => void;
}

export const FoodMap: React.FC<FoodMapProps> = ({ items, userLocation, onItemClick }) => {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [nearbyItems, setNearbyItems] = useState<FoodItem[]>([]);

  // Filter items within 25km radius when userLocation or items change
  useEffect(() => {
    console.log('FoodMap: Processing items', { 
      itemsCount: items.length, 
      userLocation,
      sampleItem: items[0] 
    });

    if (userLocation && items.length > 0) {
      const nearby = items.filter(item => {
        // Validate item location data
        if (!item.location || 
            typeof item.location.lat !== 'number' || 
            typeof item.location.lng !== 'number' ||
            isNaN(item.location.lat) || 
            isNaN(item.location.lng)) {
          console.warn('Invalid location data for item:', item.id, item.location);
          return false;
        }

        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          item.location.lat,
          item.location.lng
        );
        
        console.log(`Distance to ${item.title}: ${distance.toFixed(2)}km`);
        return distance <= 25; // Increased to 25km radius for better coverage
      });
      
      console.log(`Found ${nearby.length} food items within 25km`);
      setNearbyItems(nearby);
      
      if (nearby.length > 0) {
        toast.success(`Found ${nearby.length} food items within 25km of your location`);
      } else {
        toast.info('No food items found within 25km. Try expanding your search area.');
      }
    } else if (userLocation && items.length === 0) {
      console.log('User location available but no items to display');
      setNearbyItems([]);
      toast.info('No food items available in your area yet.');
    } else {
      console.log('No user location or items available');
      setNearbyItems(items); // Show all items if no location
    }
  }, [items, userLocation]);

  const getDirections = (item: FoodItem) => {
    if (!userLocation) {
      toast.error('Your location is not available for directions');
      return;
    }

    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${item.location.lat},${item.location.lng}`;
    window.open(url, '_blank');
    toast.success(`Opening directions to ${item.title}`);
  };

  const handleItemClick = (item: FoodItem) => {
    console.log('Food item clicked on map:', item.title);
    setSelectedItem(item);
    onItemClick(item);
  };

  if (!userLocation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📍</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Location Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">
          Please allow location access in your browser to view the food map and find items near you.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Retry Location Detection
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <MapContainer
        items={nearbyItems}
        userLocation={userLocation}
        onItemClick={handleItemClick}
      />
      
      {selectedItem && (
        <MapItemInfo
          selectedItem={selectedItem}
          userLocation={userLocation}
          onClose={() => setSelectedItem(null)}
          onGetDirections={getDirections}
        />
      )}

      <MapStats
        itemsCount={nearbyItems.length}
        userLocation={userLocation}
      />
    </div>
  );
};
