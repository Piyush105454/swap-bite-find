import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAutoLocationDetection } from '@/hooks/useAutoLocationDetection';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user } = useAuth();
  const { isDetecting, detectAndSaveLocation } = useAutoLocationDetection();

  const [isEditing, setIsEditing] = useState(false);
  const [carbonEmissions, setCarbonEmissions] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@swapeat.com',
    bio: 'Passionate about reducing food waste and building community connections. Love sharing fresh produce from my garden!',
    location: 'San Francisco, CA',  // Will update once location detected or loaded
    phone: '+1 (555) 123-4567',
    requests_sent: 0
  });

  // Manage detailed location data separately for lat,lng,address
  const [locationData, setLocationData] = useState<{ lat: number; lng: number; address: string }>({
    lat: 0,
    lng: 0,
    address: ''
  });

  // Load saved location from Supabase on mount
  useEffect(() => {
    const loadSavedLocation = async () => {
      if (!user?.id) return;

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

          setLocationData(savedLocation);
          setProfileData(prev => ({
            ...prev,
            location: savedLocation.address
          }));
        }
      } catch (error) {
        console.error('Error loading saved location:', error);
      }
    };

    loadSavedLocation();
  }, [user?.id]);

  useEffect(() => {
    const fetchScore = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('requests_sent')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfileData(prev => ({
            ...prev,
            requests_sent: data.requests_sent || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching score:', error);
      }
    };

    fetchScore();
  }, [user?.id]);

  useEffect(() => {
    const fetchCarbonEmissions = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('food_items')
          .select('carbon_emissions')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const totalEmissions = data.reduce((acc, item) => acc + (item.carbon_emissions || 0), 0);
          setCarbonEmissions(totalEmissions);
        }
      } catch (error) {
        console.error('Error fetching carbon emissions:', error);
      }
    };

    fetchCarbonEmissions();
  }, [user?.id, refresh]);

  // When detected location changes and is valid, update state and profile data
  useEffect(() => {
    const detectLocation = async () => {
      const location = await detectAndSaveLocation();
      if (location) {
        setLocationData(location);
        setProfileData(prev => ({
          ...prev,
          location: location.address
        }));
      }
    };
    detectLocation();
  }, [detectAndSaveLocation]);


  // Save location to DB whenever locationData changes
  useEffect(() => {
    const saveLocationToDatabase = async (location: { lat: number; lng: number; address: string }) => {
      if (!user?.id) return;
      if (!location.lat || !location.lng) return;

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            location_lat: location.lat,
            location_lng: location.lng,
            location_address: location.address
          })
          .eq('id', user.id);

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

    if (locationData.lat && locationData.lng) {
      saveLocationToDatabase(locationData);
    }
  }, [locationData, user?.id]);

  const stats = {
    itemsShared: 47,
    itemsReceived: 23,
    rating: 4.9,
    joinDate: 'March 2024',
    carbonEmissions: carbonEmissions
  };

  const recentActivity = [
    { id: 1, type: 'shared' as const, item: 'Fresh Tomatoes', date: '2 hours ago', image: 'https://images.unsplash.com/photo-1546470427-e75e37c79c2b?w=100&h=100&fit=crop' },
    { id: 2, type: 'received' as const, item: 'Homemade Bread', date: '1 day ago', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop' },
    { id: 3, type: 'shared' as const, item: 'Apple Pie', date: '3 days ago', image: 'https://images.unsplash.com/photo-1535920527002-b35e96722da9?w=100&h=100&fit=crop' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Show location detection status */}
          {isDetecting && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                🌍 Detecting your location to enhance your experience...
              </p>
            </div>
          )}

          {/* Profile Header */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg mb-8">
            <div className="p-8">
              <ProfileHeader 
                user={user} 
                profileData={profileData}
                stats={stats}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
              />
            </div>
          </Card>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setRefresh(!refresh)}>Refresh Stats</Button>
          </div>

          {/* Tabs - Pass locationData + setters for editing and auto-save */}
          <ProfileTabs
            recentActivity={recentActivity}
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}

            // Pass location info & setter so you can edit and track location changes inside ProfileTabs or its child components
            locationData={locationData}
            setLocationData={setLocationData}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
