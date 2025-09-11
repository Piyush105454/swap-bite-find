
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationChange,
  initialLocation
}) => {
  const [location, setLocation] = useState(initialLocation || { lat: 0, lng: 0, address: '' });
  const [isDetecting, setIsDetecting] = useState(false);

  const detectCurrentLocation = () => {
    setIsDetecting(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use Nominatim (OpenStreetMap) for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.display_name || `${latitude}, ${longitude}`;
            
            const newLocation = {
              lat: latitude,
              lng: longitude,
              address
            };
            
            setLocation(newLocation);
            onLocationChange(newLocation);
            toast.success('Location detected successfully');
          } else {
            throw new Error('Geocoding failed');
          }
        } catch (error) {
          // Fallback to coordinates if geocoding fails
          const newLocation = {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          };
          
          setLocation(newLocation);
          onLocationChange(newLocation);
          toast.success('Location detected (coordinates only)');
        }
        
        setIsDetecting(false);
      },
      (error) => {
        console.error('Error detecting location:', error);
        toast.error('Failed to detect location. Please enter manually.');
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          className="flex items-center space-x-2"
        >
          {isDetecting ? (
            <Navigation className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span>{isDetecting ? 'Detecting...' : 'Use Current Location'}</span>
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={location.address}
          onChange={(e) => {
            const newLocation = { ...location, address: e.target.value };
            setLocation(newLocation);
            onLocationChange(newLocation);
          }}
          placeholder="Enter your address"
        />
      </div>
      
      {location.lat !== 0 && location.lng !== 0 && (
        <div className="text-sm text-gray-500">
          Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};
