
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useExpiredFoodCleanup = () => {
  useEffect(() => {
    const cleanupExpiredItems = async () => {
      try {
        const now = new Date().toISOString();
        
        // Get expired items to delete their photos from storage
        const { data: expiredItems, error: fetchError } = await supabase
          .from('food_items')
          .select('id, image_url')
          .lt('expire_date', now)
          .not('image_url', 'is', null);

        if (fetchError) {
          console.error('Error fetching expired items:', fetchError);
          return;
        }

        // Delete photos from storage if they exist
        if (expiredItems && expiredItems.length > 0) {
          for (const item of expiredItems) {
            if (item.image_url && item.image_url.includes('supabase')) {
              // Extract file path from URL
              const urlParts = item.image_url.split('/');
              const fileName = urlParts[urlParts.length - 1];
              const userFolder = urlParts[urlParts.length - 2];
              const filePath = `${userFolder}/${fileName}`;
              
              await supabase.storage
                .from('food-photos')
                .remove([filePath]);
            }
          }

          // Delete expired food items from database
          const { error: deleteError } = await supabase
            .from('food_items')
            .delete()
            .lt('expire_date', now);

          if (deleteError) {
            console.error('Error deleting expired items:', deleteError);
          } else {
            console.log(`Cleaned up ${expiredItems.length} expired food items`);
          }
        }
      } catch (error) {
        console.error('Error in cleanup process:', error);
      }
    };

    // Run cleanup immediately
    cleanupExpiredItems();

    // Set up interval to run cleanup every hour
    const interval = setInterval(cleanupExpiredItems, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
