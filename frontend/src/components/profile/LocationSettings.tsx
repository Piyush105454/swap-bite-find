
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LocationPicker } from '@/components/LocationPicker';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LocationSettingsProps {
  profileData: {
    location: string;
  };
  isEditing: boolean;
  locationData: {
    lat: number;
    lng: number;
    address: string;
  };
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  onProfileDataChange: (data: any) => void;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({
  profileData,
  isEditing,
  locationData,
  onLocationChange,
  onProfileDataChange
}) => {
  const { user } = useAuth();

  // Load saved location from database when component mounts
  useEffect(() => {
    const loadSavedLocation = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('location_lat, location_lng, location_address')
            .eq('id', user.id)
            .single();

          if (!error && data && data.location_lat && data.location_lng) {
            const savedLocation = {
              lat: data.location_lat,
              lng: data.location_lng,
              address: data.location_address || `${data.location_lat}, ${data.location_lng}`
            };
            
            onLocationChange(savedLocation);
            onProfileDataChange({ ...profileData, location: savedLocation.address });
          }
        } catch (error) {
          console.error('Error loading saved location:', error);
        }
      }
    };

    loadSavedLocation();
  }, [user?.id]);

  const saveLocationToDatabase = async (location: { lat: number; lng: number; address: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          location_lat: location.lat,
          location_lng: location.lng,
          location_address: location.address
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error saving location:', error);
        toast.error('Failed to save location');
      } else {
        toast.success('Location saved successfully');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };

  const handleLocationChange = (location: { lat: number; lng: number; address: string }) => {
    console.log('Location changed:', location);
    onLocationChange(location);
    onProfileDataChange({ ...profileData, location: location.address });
    
    // Save location to database if user is authenticated
    if (user?.id && location.lat && location.lng) {
      saveLocationToDatabase(location);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Location</Label>
      {isEditing ? (
        <div className="space-y-4">
          <LocationPicker
            onLocationChange={handleLocationChange}
            initialLocation={locationData}
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-2">Why we need your location:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Show nearby food items in your area</li>
              <li>Help other users find food you're sharing</li>
              <li>Calculate distances for food pickup</li>
              <li>Improve community connections in your neighborhood</li>
            </ul>
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              💡 Your location was automatically detected when you logged in for better experience
            </p>
          </div>
        </div>
      ) : (
        <Input
          value={profileData.location}
          disabled
          placeholder="No location set"
        />
      )}
    </div>
  );
};

export default LocationSettings;
