import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FoodRequest {
  id: string;
  message: string;
  status: string;
  created_at: string;
  food_item: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    category: string;
  };
  requester: {
    id: string;
    full_name: string;
    avatar_url: string;
    phone_number: string;
  };
}

export const RequestsManagement = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('food_requests')
        .select(`
          id,
          message,
          status,
          created_at,
          requester_id,
          food_items!inner (
            id,
            title,
            description,
            image_url,
            category
          )
        `)
        .eq('food_items.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // Get requester profiles separately
      const requesterIds = data.map(request => request.requester_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, phone_number')
        .in('id', requesterIds);

      if (profilesError) throw profilesError;

      const formattedRequests = data.map(request => {
        const requesterProfile = profiles?.find(profile => profile.id === request.requester_id);
        
        return {
          id: request.id,
          message: request.message || '',
          status: request.status || 'pending',
          created_at: request.created_at,
          food_item: request.food_items,
          requester: {
            id: request.requester_id,
            full_name: requesterProfile?.full_name || 'Unknown User',
            avatar_url: requesterProfile?.avatar_url || '',
            phone_number: requesterProfile?.phone_number || ''
          }
        };
      });

      setRequests(formattedRequests);
    } catch (error: any) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('food_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status }
            : request
        )
      );

      toast.success(`Request ${status} successfully`);
    } catch (error: any) {
      console.error('Error updating request:', error);
      toast.error(`Failed to ${status.slice(0, -2)} request`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <p className="text-gray-500 dark:text-gray-400">No requests received yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Food Requests ({requests.length})
      </h2>
      
      {requests.map(request => (
        <Card key={request.id} className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start space-x-4">
            {/* Food Item Image */}
            <img
              src={request.food_item.image_url || '/placeholder.svg'}
              alt={request.food_item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            
            <div className="flex-1 min-w-0">
              {/* Food Item Info */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {request.food_item.title}
                </h3>
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </div>
              
              {/* Requester Info */}
              <div className="flex items-center space-x-2 mb-3">
                {request.requester.avatar_url ? (
                  <img
                    src={request.requester.avatar_url}
                    alt={request.requester.full_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-400" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {request.requester.full_name}
                </span>
                {request.requester.phone_number && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    • {request.requester.phone_number}
                  </span>
                )}
              </div>

              {/* Request Message */}
              {request.message && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  "{request.message}"
                </p>
              )}

              {/* Time */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(request.created_at)}
              </div>

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    onClick={() => updateRequestStatus(request.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateRequestStatus(request.id, 'rejected')}
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
