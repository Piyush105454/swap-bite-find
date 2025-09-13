// utils/carbonCalculator.ts

import { foodCarbonData } from "./foodCarbonData";

/**
 * Get carbon emission for a given food item.
 * @param foodName - Name of the food item
 * @param quantity - Quantity multiplier (e.g. 2 servings)
 * @returns Emission value (kg CO2e) or null if not found
 */
export const getCarbonEmission = (foodName: string, quantity: number = 1): number | null => {
  // Find the food in the dataset
  const food = foodCarbonData.find(
    (item) => item.name.toLowerCase() === foodName.toLowerCase()
  );

  if (!food) {
    console.warn(`Food item not found: ${foodName}`);
    return null;
  }

  // Multiply by quantity (default 1)
  return food.emission * quantity;
};
