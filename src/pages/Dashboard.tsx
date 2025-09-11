
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, List, MessageCircle, Settings } from 'lucide-react';
import { AddFoodModal } from '@/components/AddFoodModal';
import { RequestsManagement } from '@/components/RequestsManagement';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { NearbyTab } from '@/components/dashboard/NearbyTab';
import { MyItemsTab } from '@/components/dashboard/MyItemsTab';
import { MapTab } from '@/components/dashboard/MapTab';
import { useAuth } from '@/contexts/AuthContext';
import { useFoodItems } from '@/hooks/useFoodItems';
import { useExpiredFoodCleanup } from '@/hooks/useExpiredFoodCleanup';
import { convertToFoodCardFormat } from '@/utils/foodItemUtils';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Use the cleanup hook to automatically remove expired items
  useExpiredFoodCleanup();

  const { myFoodItems, nearbyItems, loading, refreshItems } = useFoodItems(user, userLocation);

  // Improved location detection with better error handling
  useEffect(() => {
    const detectLocation = async () => {
      console.log('Starting location detection...');
      
      if (!navigator.geolocation) {
        const error = "Geolocation is not supported by your browser.";
        console.error(error);
        setLocationError(error);
        toast.error(error);
        return;
      }

      // Try high accuracy first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('High accuracy location obtained:', { latitude, longitude, accuracy });
          
          setUserLocation({
            lat: latitude,
            lng: longitude,
          });
          
          setLocationError(null);
          toast.success(`Location detected with ${Math.round(accuracy)}m accuracy`);
        },
        (error) => {
          console.warn('High accuracy location failed, trying low accuracy:', error);
          
          // Fallback to low accuracy
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude, accuracy } = position.coords;
              console.log('Low accuracy location obtained:', { latitude, longitude, accuracy });
              
              setUserLocation({
                lat: latitude,
                lng: longitude,
              });
              
              setLocationError(null);
              toast.success(`Location detected with approximate accuracy (${Math.round(accuracy)}m)`);
            },
            (fallbackError) => {
              console.error("Both location attempts failed:", fallbackError);
              let errorMessage = "Failed to get your location. ";
              
              switch(fallbackError.code) {
                case fallbackError.PERMISSION_DENIED:
                  errorMessage += "Please allow location access in your browser settings.";
                  break;
                case fallbackError.POSITION_UNAVAILABLE:
                  errorMessage += "Location information is unavailable.";
                  break;
                case fallbackError.TIMEOUT:
                  errorMessage += "Location request timed out.";
                  break;
                default:
                  errorMessage += "An unknown error occurred.";
                  break;
              }
              
              setLocationError(errorMessage);
              toast.error(errorMessage);
            },
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 600000 // 10 minutes
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

    detectLocation();
  }, []);

  const handleLike = (itemId: string) => {
    console.log('Like item:', itemId);
  };

  const handleAddFood = () => {
    setShowAddModal(true);
  };

  const handleFoodAdded = async () => {
    console.log('Food added, refreshing items...');
    await refreshItems();
    toast.success('Food items refreshed!');
  };

  const handleItemClick = (item: any) => {
    console.log('Item clicked from map:', item);
    toast.success(`Viewing details for: ${item.title}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />
        <div className="pt-20 flex justify-center items-center h-screen">
          <p className="text-gray-600 dark:text-gray-400">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  console.log('Dashboard render - My items:', myFoodItems.length, 'Nearby items:', nearbyItems.length);
  console.log('User location:', userLocation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader userName={user.name || 'User'} onAddFood={handleAddFood} />

          {/* Location Error Display */}
          {locationError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">
                📍 {locationError}
              </p>
            </div>
          )}

          {/* Location Detection Status */}
          {!userLocation && !locationError && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                🌍 Detecting your location to show nearby food items...
              </p>
            </div>
          )}

          <Tabs defaultValue="nearby" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="nearby" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Nearby</span>
              </TabsTrigger>
              <TabsTrigger value="my-items" className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">My Items</span>
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Requests</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nearby" className="space-y-6">
              <NearbyTab
                items={nearbyItems}
                loading={loading}
                onLike={handleLike}
                convertToFoodCardFormat={convertToFoodCardFormat}
              />
            </TabsContent>

            <TabsContent value="my-items" className="space-y-6">
              <MyItemsTab
                items={myFoodItems}
                loading={loading}
                onLike={handleLike}
                onAddFood={handleAddFood}
                convertToFoodCardFormat={convertToFoodCardFormat}
              />
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <RequestsManagement />
            </TabsContent>

            <TabsContent value="map" className="space-y-6">
              <MapTab
                items={nearbyItems.map(convertToFoodCardFormat)}
                userLocation={userLocation}
                onItemClick={handleItemClick}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddFoodModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onFoodAdded={handleFoodAdded}
      />
    </div>
  );
};

export default Dashboard;
