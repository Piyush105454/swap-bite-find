import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { toast } from 'sonner';

// Generic hook for API calls
export function useApi<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    staleTime?: number;
  }
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
  });
}

// Food items hooks
export function useFoodItems(params?: {
  page?: number;
  limit?: number;
  category?: string;
  location_lat?: number;
  location_lng?: number;
  radius?: number;
}) {
  return useApi(
    ['foodItems', params],
    () => apiService.getFoodItems(params)
  );
}

export function useFoodItem(id: string) {
  return useApi(
    ['foodItem', id],
    () => apiService.getFoodItem(id),
    { enabled: !!id }
  );
}

export function useCreateFoodItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (foodData: any) => apiService.createFoodItem(foodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      toast.success('Food item created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create food item');
    },
  });
}

export function useUpdateFoodItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiService.updateFoodItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      queryClient.invalidateQueries({ queryKey: ['foodItem', id] });
      toast.success('Food item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update food item');
    },
  });
}

export function useDeleteFoodItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteFoodItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      toast.success('Food item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete food item');
    },
  });
}

// Chat hooks
export function useConversations(params?: { page?: number; limit?: number }) {
  return useApi(
    ['conversations', params],
    () => apiService.getConversations(params)
  );
}

export function useMessages(conversationId: string, params?: { page?: number; limit?: number }) {
  return useApi(
    ['messages', conversationId, params],
    () => apiService.getMessages(conversationId, params),
    { enabled: !!conversationId }
  );
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { participant_id: string; food_request_id?: string }) => 
      apiService.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create conversation');
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) => 
      apiService.sendMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
}

// User hooks
export function useUserProfile() {
  return useApi(
    ['userProfile'],
    () => apiService.getUserProfile()
  );
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData: any) => apiService.updateUserProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useUserStats() {
  return useApi(
    ['userStats'],
    () => apiService.getUserStats()
  );
}

// Notification hooks
export function useNotifications(params?: { page?: number; limit?: number }) {
  return useApi(
    ['notifications', params],
    () => apiService.getNotifications(params)
  );
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });
}