import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuantityFieldProps {
  quantity: number;
  unit: string;
  onChange: (field: string, value: string | number) => void;
}

export const QuantityField: React.FC<QuantityFieldProps> = ({ quantity, unit, onChange }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange("quantity", quantity - 1);
    }
  };

  const handleIncrease = () => {
    onChange("quantity", quantity + 1);
  };

  return (
    <div className="space-y-2">
      <Label>Quantity *</Label>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={quantity <= 1}
        >
          –
        </Button>

        <span className="text-lg font-semibold w-6 text-center">
          {quantity}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrease}
        >
          +
        </Button>

        {/* Unit dropdown */}
        <Select
          value={unit}
          onValueChange={(value) => onChange("unit", value)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="liters">Liters</SelectItem>
            <SelectItem value="ml">ml</SelectItem>
            <SelectItem value="pieces">Pieces</SelectItem>
            <SelectItem value="packs">Packs</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
