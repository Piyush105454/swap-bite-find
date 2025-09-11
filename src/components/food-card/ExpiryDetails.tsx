
import React from 'react';
import { Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ExpiryDetailsProps {
  expireDate: string;
}

export const ExpiryDetails: React.FC<ExpiryDetailsProps> = ({ expireDate }) => {
  // Parse the ISO string properly to preserve the exact time
  const expireDateObj = parseISO(expireDate);
  
  return (
    <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Expires: {format(expireDateObj, 'PPp')}
      </div>
    </div>
  );
};
