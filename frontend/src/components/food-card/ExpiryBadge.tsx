
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';
import { format, isAfter, differenceInHours, differenceInDays, parseISO } from 'date-fns';

interface ExpiryBadgeProps {
  expireDate: string;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({ expireDate }) => {
  const getExpiryInfo = () => {
    console.log('Processing expiry for expire_date:', expireDate);
    
    // Parse the ISO string properly to preserve the exact time
    const expireDateObj = parseISO(expireDate);
    const now = new Date();
    
    console.log('Expire date object:', expireDateObj);
    console.log('Current time:', now);
    console.log('Is expired?', isAfter(now, expireDateObj));
    
    // Don't show expired items at all
    if (isAfter(now, expireDateObj)) {
      return null;
    }
    
    const hoursLeft = differenceInHours(expireDateObj, now);
    const daysLeft = differenceInDays(expireDateObj, now);
    
    // Use the actual time from the expiry date, not a formatted version
    const timeString = format(expireDateObj, 'h:mm a');
    
    console.log('Hours left:', hoursLeft, 'Actual expiry time:', timeString);
    
    if (hoursLeft < 24) {
      return { 
        text: `Expires at ${timeString} (${hoursLeft}h left)`, 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        urgent: true 
      };
    } else if (daysLeft === 1) {
      return { 
        text: `Expires tomorrow at ${timeString}`, 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        urgent: false 
      };
    } else {
      return { 
        text: `Expires in ${daysLeft} days at ${timeString}`, 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        urgent: false 
      };
    }
  };

  const expiryInfo = getExpiryInfo();

  if (!expiryInfo) return null;

  return (
    <Badge className={`${expiryInfo.color} border flex items-center gap-1`}>
      {expiryInfo.urgent && <AlertTriangle className="h-3 w-3" />}
      <Clock className="h-3 w-3" />
      {expiryInfo.text}
    </Badge>
  );
};
