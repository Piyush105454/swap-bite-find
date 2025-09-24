
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FoodItem {
  id: string;
  title: string;
  user_id: string;
}

interface RequestFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foodItem: FoodItem | null;
  onRequestSent?: () => void;
}

export const RequestFoodModal: React.FC<RequestFoodModalProps> = ({
  open,
  onOpenChange,
  foodItem,
  onRequestSent
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !foodItem) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('food_requests')
        .insert({
          food_item_id: foodItem.id,
          requester_id: user.id,
          owner_id: foodItem.user_id,
          message: message.trim() || null
        });

      if (error) throw error;

      toast.success('Request sent successfully!');
      setMessage('');
      onOpenChange(false);
      onRequestSent?.();
    } catch (error: any) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Food Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Send a request for: <span className="font-semibold">{foodItem?.title}</span>
            </p>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message (optional)
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I'm interested in this food item. When would be a good time to pick it up?"
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
