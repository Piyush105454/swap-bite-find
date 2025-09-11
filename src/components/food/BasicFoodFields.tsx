
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicFoodFieldsProps {
  title: string;
  description: string;
  category: string;
  onInputChange: (field: string, value: string) => void;
}

export const BasicFoodFields: React.FC<BasicFoodFieldsProps> = ({
  title,
  description,
  category,
  onInputChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Food Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder="What food are you sharing?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Describe the food item..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={category} onValueChange={(value) => onInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="baked">Baked Goods</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
            <SelectItem value="meals">Prepared Meals</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
