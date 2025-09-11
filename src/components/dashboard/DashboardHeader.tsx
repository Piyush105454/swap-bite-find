
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  onAddFood: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, onAddFood }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Share food, reduce waste, build community
        </p>
      </div>
      <Button 
        onClick={onAddFood}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Share Food
      </Button>
    </div>
  );
};
