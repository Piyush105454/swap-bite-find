
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityList from './ActivityList';
import ProfileSettings from './ProfileSettings';
import ReviewsList from './ReviewsList';
import Leaderboard from './Leaderboard';

interface ProfileTabsProps {
  recentActivity: {
    id: number;
    type: 'shared' | 'received';
    item: string;
    date: string;
    image: string;
  }[];
  profileData: {
    name: string;
    email: string;
    location: string;
    phone: string;
    bio: string;
    requests_sent: number;
  };
  isEditing: boolean;
  setProfileData: (data: {
    name: string;
    email: string;
    location: string;
    phone: string;
    bio: string;
    requests_sent: number;
  }) => void;
  locationData: { lat: number; lng: number; address: string };
  setLocationData: (data: { lat: number; lng: number; address: string }) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  recentActivity,
  profileData,
  isEditing,
  setProfileData,
  locationData,
  setLocationData
}) => {
  return (
    <Tabs defaultValue="activity" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
      </TabsList>

      <TabsContent value="activity">
        <ActivityList activities={recentActivity} />
      </TabsContent>

      <TabsContent value="settings">
        <ProfileSettings 
          profileData={profileData} 
          isEditing={isEditing} 
          setProfileData={setProfileData} 
        />
      </TabsContent>

      <TabsContent value="reviews">
        <ReviewsList />
      </TabsContent>
      <TabsContent value="leaderboard">
        <Leaderboard />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
