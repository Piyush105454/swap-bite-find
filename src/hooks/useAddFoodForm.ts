import { useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export const useAddFoodForm = () => {
  const [loading, setLoading] = useState(false);

  const addFood = async (foodItem: {
    name: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    image_url: string | null;
    location_lat: number;
    location_lng: number;
    location_address: string;
    user_id: string;
    expire_date: string;
  }) => {
    setLoading(true);
    try {
      // Insert food (trigger auto-calculates emissions)
      const { data, error } = await supabase
        .from("food_items")
        .insert([
          {
            title: foodItem.name,
            description: foodItem.description,
            category: foodItem.category,
            quantity: foodItem.quantity,
            unit: foodItem.unit,
            image_url: foodItem.image_url,
            location_lat: foodItem.location_lat,
            location_lng: foodItem.location_lng,
            location_address: foodItem.location_address,
            user_id: foodItem.user_id,
            expire_date: foodItem.expire_date,
          },
        ])
        .select();

      if (error) throw error;

      // ✅ Step 1: get user avg
      const { data: userAvgData, error: userErr } = await supabase
        .from("food_items")
        .select("carbon_emissions")
        .eq("user_id", foodItem.user_id);

      if (userErr) throw userErr;

      const userTotalEmissions = userAvgData.reduce((sum, f) => sum + f.carbon_emissions, 0);
      const userAvg = userAvgData.length > 0 ? userTotalEmissions / userAvgData.length : 0;

      // ✅ Step 2: get global avg
      const { data: globalAvgData, error: globalErr } = await supabase
        .from("food_items")
        .select("carbon_emissions");

      if (globalErr) throw globalErr;

      const globalTotalEmissions = globalAvgData.reduce((sum, f) => sum + f.carbon_emissions, 0);
      const globalAvg = globalAvgData.length > 0 ? globalTotalEmissions / globalAvgData.length : 0;

      // ✅ Step 3: Compare & show message
      if (userAvg < globalAvg) {
        toast.success("🌱 Great! Your choices are more sustainable.");
      } else {
        toast.warning("⚠ use this tips to reduce your carbon footprint"
          + "\n- 1.   Delete files from your phone keeps servers consume less energy"
        );
      }

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error adding food";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { addFood, loading };
};
