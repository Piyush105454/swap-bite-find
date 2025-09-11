
import React from 'react';
import { Star } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    itemsShared: number;
    itemsReceived: number;
    rating: number;
    joinDate: string;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {stats.itemsShared}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Items Shared</div>
      </div>
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {stats.itemsReceived}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Items Received</div>
      </div>
      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
          <Star className="h-5 w-5 mr-1 fill-current" />
          {stats.rating}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
      </div>
      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          70
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Items Saved</div>
      </div>
    </div>
  );
};

export default ProfileStats;
