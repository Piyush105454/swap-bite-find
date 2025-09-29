import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SentRequest {
  id: string;
  status: string;
  created_at: string;
  food_item: {
    title: string;
    image_url: string;
  };
}

export const SentRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSentRequests();
    }
  }, [user]);

  const loadSentRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('food_requests')
        .select(`
          id,
          status,
          created_at,
          food_items (
            title,
            image_url
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests = data.map(request => ({
        id: request.id,
        status: request.status || 'pending',
        created_at: request.created_at,
        food_item: request.food_items as { title: string; image_url: string; },
      }));

      setRequests(formattedRequests);
    } catch (error: unknown) {
      console.error('Error loading sent requests:', error);
      toast.error('Failed to load sent requests');
    } finally {
      setLoading(false);
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
        <p className="text-gray-500 dark:text-gray-400">You haven't sent any requests yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Sent Food Requests ({requests.length})
      </h2>
      
      {requests.map(request => (
        <Card key={request.id} className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-start space-x-4">
            <img
              src={request.food_item.image_url || '/placeholder.svg'}
              alt={request.food_item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {request.food_item.title}
                </h3>
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(request.created_at)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
