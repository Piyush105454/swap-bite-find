
import React from 'react';
import { Clock } from 'lucide-react';

interface UserInfoProps {
  user: {
    name: string;
    avatar: string;
  };
  postedAt: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, postedAt }) => {
  return (
    <div className="flex items-center space-x-3 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <img
        src={user.avatar || '/placeholder.svg'}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover border-2 border-green-300"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-800 dark:text-green-300">
          Shared by: {user.name}
        </p>
        <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {postedAt}
        </div>
      </div>
    </div>
  );
};
