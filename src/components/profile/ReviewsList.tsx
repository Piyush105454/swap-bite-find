
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const ReviewsList = () => {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Reviews & Feedback</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://images.unsplash.com/photo-1${490000000 + i}?w=32&h=32&fit=crop&crop=face`}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">User {i}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Great experience! The food was fresh and the pickup was smooth. Highly recommend!
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ReviewsList;
