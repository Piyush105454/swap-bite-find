import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FoodItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  quantity: number;      // ✅ added
  unit: string;          // ✅ added
  location_lat: number;
  location_lng: number;
  location_address: string;
  user_id: string;
  created_at: string;
  expire_date: string | null;
  carbon_emissions: number;
  user: {
    full_name: string;
    avatar_url: string;
  };
}

interface User {
  id: string;
  name?: string;
  avatar?: string;
}

export const useFoodItems = (
  user: User | null,
  userLocation: { lat: number; lng: number } | null
) => {
  const [myFoodItems, setMyFoodItems] = useState<FoodItem[]>([]);
  const [nearbyItems, setNearbyItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyFoodItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map quantity, unit, and user info
      const itemsWithUser = (data || []).map(item => ({
        ...item,
        quantity: item.quantity || 1,
        unit: item.unit || 'pieces',
        user: {
          full_name: user.name || 'You',
          avatar_url: user.avatar || ''
        }
      }));

      setMyFoodItems(itemsWithUser);
    } catch (error: any) {
      console.error('Error loading my food items:', error);
      toast.error('Failed to load your food items');
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyItems = async () => {
    if (!user) return;

    try {
      const { data: foodItems, error } = await supabase
        .from('food_items')
        .select('*')
        .neq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!foodItems || foodItems.length === 0) {
        setNearbyItems([]);
        return;
      }

      const userIds = [...new Set(foodItems.map(item => item.user_id))];

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) console.error('Error fetching profiles:', profilesError);

      const itemsWithUsers = foodItems.map(item => {
        const userProfile = profiles?.find(profile => profile.id === item.user_id);
        return {
          ...item,
          quantity: item.quantity || 1,
          unit: item.unit || 'pieces',
          user: {
            full_name: userProfile?.full_name || 'Food Sharer',
            avatar_url: userProfile?.avatar_url || ''
          }
        };
      });

      setNearbyItems(itemsWithUsers);
    } catch (error: any) {
      console.error('Error loading nearby food items:', error);
      toast.error('Failed to load nearby food items');
    }
  };

  const refreshItems = async () => {
    if (user) {
      await Promise.all([loadMyFoodItems(), loadNearbyItems()]);
    }
  };

  useEffect(() => {
    if (user) {
      loadMyFoodItems();
      loadNearbyItems();
    }
  }, [user, userLocation]);

  return {
    myFoodItems,
    nearbyItems,
    loading,
    refreshItems
  };
};
