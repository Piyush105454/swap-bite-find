
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Share2, Settings, MapPin, Calendar } from 'lucide-react';
import ProfileStats from './ProfileStats';

interface ProfileHeaderProps {
  user: {
    name?: string;
    avatar?: string;
  } | null;
  profileData: {
    name: string;
    location: string;
    bio: string;
  };
  isEditing: boolean;
  stats: {
    itemsShared: number;
    itemsReceived: number;
    rating: number;
    joinDate: string;
  };
  setIsEditing: (value: boolean) => void;
  handleSave: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  profileData,
  stats,
  isEditing,
  setIsEditing,
  handleSave
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
      {/* Avatar */}
      <div className="relative">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face'}
          alt={profileData.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-green-200 dark:border-green-700"
        />
        <Button
          size="sm"
          className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-green-500 hover:bg-green-600"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {profileData.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {profileData.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {stats.joinDate}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={isEditing ? "bg-green-500 hover:bg-green-600 text-white" : ""}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
          {profileData.bio}
        </p>

        <ProfileStats stats={stats} />
      </div>
    </div>
  );
};

export default ProfileHeader;
