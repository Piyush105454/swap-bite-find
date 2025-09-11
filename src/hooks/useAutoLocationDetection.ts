
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export const useAutoLocationDetection = () => {
  const { user, isAuthenticated } = useAuth();
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasDetectedLocation, setHasDetectedLocation] = useState(false);

  const detectLocationFromIP = async (): Promise<LocationData | null> => {
    try {
      // Using ipapi.co for IP-based location detection (free tier)
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          lat: data.latitude,
          lng: data.longitude,
          address: `${data.city}, ${data.region}, ${data.country_name}`
        };
      }
    } catch (error) {
      console.error('IP location detection failed:', error);
    }
    return null;
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${lat}, ${lng}`;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const detectLocationFromBrowser = (): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          
          resolve({
            lat: latitude,
            lng: longitude,
            address
          });
        },
        (error) => {
          console.error('Browser location detection failed:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const saveLocationToProfile = async (location: LocationData) => {
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
        console.error('Error saving location to profile:', error);
      } else {
        console.log('Location automatically saved to profile:', location.address);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const detectAndSaveLocation = async () => {
    if (!user?.id || hasDetectedLocation) return;

    setIsDetecting(true);
    
    try {
      // First try browser geolocation
      let location = await detectLocationFromBrowser();
      
      // Fallback to IP detection if browser geolocation fails
      if (!location) {
        location = await detectLocationFromIP();
      }

      if (location) {
        await saveLocationToProfile(location);
        setHasDetectedLocation(true);
        toast.success(`Location detected: ${location.address}`);
        return location;
      } else {
        console.log('Location detection failed with all methods');
      }
    } catch (error) {
      console.error('Error during location detection:', error);
    } finally {
      setIsDetecting(false);
    }
    
    return null;
  };

  // Auto-detect location when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id && !hasDetectedLocation) {
      // Small delay to ensure the profile page has loaded
      const timer = setTimeout(() => {
        detectAndSaveLocation();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.id]);

  return {
    isDetecting,
    detectAndSaveLocation,
    hasDetectedLocation
  };
};
