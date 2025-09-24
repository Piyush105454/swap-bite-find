
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: number;
  type: 'shared' | 'received';
  item: string;
  date: string;
  image: string;
}

interface ActivityListProps {
  activities: ActivityItem[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <img
                src={activity.image}
                alt={activity.item}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">
                  {activity.type === 'shared' ? 'Shared' : 'Received'} <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
              </div>
              <Badge className={activity.type === 'shared' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                {activity.type}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ActivityList;
