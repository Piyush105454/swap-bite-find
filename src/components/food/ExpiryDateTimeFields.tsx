
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ExpiryDateTimeFieldsProps {
  expireDate: string;
  expireTime: string;
  onInputChange: (field: string, value: string) => void;
}

export const ExpiryDateTimeFields: React.FC<ExpiryDateTimeFieldsProps> = ({
  expireDate,
  expireTime,
  onInputChange
}) => {
  const handleSameDayExpiry = () => {
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const endOfDay = '23:59';
    
    onInputChange('expireDate', todayString);
    onInputChange('expireTime', endOfDay);
    
    toast.success('Set to expire at end of today');
  };

  // Helper function to combine date and time into ISO timestamp
  const getCombinedDateTime = () => {
    if (expireDate && expireTime) {
      const combinedDateTime = `${expireDate}T${expireTime}:00`;
      console.log('Combined datetime for storage:', combinedDateTime);
      return combinedDateTime;
    }
    return null;
  };

  // Update the parent component with the combined datetime whenever date or time changes
  React.useEffect(() => {
    const combined = getCombinedDateTime();
    if (combined) {
      onInputChange('expireDateTime', combined);
    }
  }, [expireDate, expireTime]);

  return (
    <div className="space-y-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
      <div className="flex items-center justify-between">
        <Label className="text-orange-800 dark:text-orange-300 font-medium">
          Expiry Date & Time *
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSameDayExpiry}
          className="text-orange-600 border-orange-300 hover:bg-orange-100"
        >
          <CalendarDays className="h-4 w-4 mr-1" />
          Same Day
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="expireDate" className="text-sm">Date</Label>
          <Input
            id="expireDate"
            type="date"
            value={expireDate}
            onChange={(e) => onInputChange('expireDate', e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expireTime" className="text-sm">Time</Label>
          <Input
            id="expireTime"
            type="time"
            value={expireTime}
            onChange={(e) => onInputChange('expireTime', e.target.value)}
            required
          />
        </div>
      </div>
      
      <p className="text-xs text-orange-600 dark:text-orange-400">
        <Clock className="h-3 w-3 inline mr-1" />
        Food will be automatically removed after this time
      </p>
    </div>
  );
};
