
import React from 'react';
import { Label } from '@/components/ui/label';
import { LocationPicker } from '@/components/LocationPicker';

interface LocationSelectionFieldProps {
  location: { lat: number; lng: number; address: string } | null;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export const LocationSelectionField: React.FC<LocationSelectionFieldProps> = ({
  location,
  onLocationSelect
}) => {
  return (
    <div className="space-y-2">
      <Label>Pickup Location *</Label>
      <LocationPicker 
        onLocationChange={onLocationSelect}
        initialLocation={location}
      />
      {location && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selected: {location.address}
        </p>
      )}
    </div>
  );
};
