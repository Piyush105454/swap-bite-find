
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import AvatarUpload from './AvatarUpload';
import BasicProfileFields from './BasicProfileFields';
import LocationSettings from './LocationSettings';

interface ProfileData {
  name: string;
  email: string;
  location: string;
  phone: string;
  bio: string;
  requests_sent: number;
}

interface ProfileSettingsProps {
  profileData: ProfileData;
  isEditing: boolean;
  setProfileData: (data: ProfileData) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profileData,
  isEditing,
  setProfileData
}) => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [locationData, setLocationData] = useState({
    lat: 0,
    lng: 0,
    address: profileData.location
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData({ ...profileData, [id]: value });
  };

  const handleLocationChange = (location: { lat: number; lng: number; address: string }) => {
    setLocationData(location);
  };

  const handleAvatarUpdate = (url: string) => {
    setAvatarUrl(url);
  };
  
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
        
        {/* Avatar Upload Section */}
        {isEditing && (
          <AvatarUpload
            avatarUrl={avatarUrl}
            onAvatarUpdate={handleAvatarUpdate}
          />
        )}

        <div className="space-y-6">
          <BasicProfileFields
            profileData={profileData}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <LocationSettings
            profileData={profileData}
            isEditing={isEditing}
            locationData={locationData}
            onLocationChange={handleLocationChange}
            onProfileDataChange={setProfileData}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProfileSettings;
