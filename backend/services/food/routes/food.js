const express = require('express');
const { validateFoodItem } = require('../../../shared/middleware/validation');
const { authenticateToken } = require('../../../shared/middleware/auth');
const { uploadLimiter } = require('../../../shared/middleware/rateLimiter');
const ApiResponse = require('../../../shared/utils/response');
const logger = require('../../../shared/utils/logger');
const database = require('../../../config/database');
const CarbonCalculator = require('../utils/carbonCalculator');

const router = express.Router();

// Get all food items with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, location_lat, location_lng, radius = 25 } = req.query;
    const offset = (page - 1) * limit;
    const supabase = database.getClient();

    let query = supabase
      .from('food_items')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .gt('expire_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: foodItems, error, count } = await query;

    if (error) {
      throw error;
    }

    // Filter by location if provided
    let filteredItems = foodItems || [];
    if (location_lat && location_lng) {
      filteredItems = filteredItems.filter(item => {
        const distance = calculateDistance(
          parseFloat(location_lat),
          parseFloat(location_lng),
          item.location_lat,
          item.location_lng
        );
        return distance <= radius;
      });
    }

    res.json(
      ApiResponse.paginated(
        filteredItems,
        { page: parseInt(page), limit: parseInt(limit), total: count || 0 }
      )
    );

  } catch (error) {
    logger.error('Error fetching food items:', error);
    res.status(500).json(
      ApiResponse.error('Failed to fetch food items', 500)
    );
  }
});

// Get food item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = database.getClient();

    const { data: foodItem, error } = await supabase
      .from('food_items')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          phone_number
        )
      `)
      .eq('id', id)
      .single();

    if (error || !foodItem) {
      return res.status(404).json(
        ApiResponse.error('Food item not found', 404)
      );
    }

    res.json(
      ApiResponse.success(foodItem, 'Food item retrieved successfully')
    );

  } catch (error) {
    logger.error('Error fetching food item:', error);
    res.status(500).json(
      ApiResponse.error('Failed to fetch food item', 500)
    );
  }
});

// Create new food item
router.post('/', authenticateToken, uploadLimiter, validateFoodItem, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      unit,
      location_lat,
      location_lng,
      location_address,
      expire_date,
      image_url
    } = req.body;

    const supabase = database.getClient();

    // Calculate carbon emissions
    const carbonEmissions = CarbonCalculator.calculateEmissions(category, quantity, unit);

    const { data: foodItem, error } = await supabase
      .from('food_items')
      .insert({
        title,
        description,
        category,
        quantity,
        unit,
        location_lat: parseFloat(location_lat),
        location_lng: parseFloat(location_lng),
        location_address,
        expire_date,
        image_url,
        user_id: req.user.id,
        carbon_emissions: carbonEmissions
      })
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    logger.info('Food item created:', { 
      id: foodItem.id, 
      userId: req.user.id,
      title: foodItem.title 
    });

    res.status(201).json(
      ApiResponse.success(foodItem, 'Food item created successfully', 201)
    );

  } catch (error) {
    logger.error('Error creating food item:', error);
    res.status(500).json(
      ApiResponse.error('Failed to create food item', 500)
    );
  }
});

// Update food item
router.put('/:id', authenticateToken, validateFoodItem, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const supabase = database.getClient();

    // Check if user owns the food item
    const { data: existingItem, error: fetchError } = await supabase
      .from('food_items')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json(
        ApiResponse.error('Food item not found', 404)
      );
    }

    if (existingItem.user_id !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to update this item', 403)
      );
    }

    // Recalculate carbon emissions if category/quantity changed
    if (updateData.category || updateData.quantity || updateData.unit) {
      updateData.carbon_emissions = CarbonCalculator.calculateEmissions(
        updateData.category,
        updateData.quantity,
        updateData.unit
      );
    }

    const { data: updatedItem, error } = await supabase
      .from('food_items')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    logger.info('Food item updated:', { id, userId: req.user.id });

    res.json(
      ApiResponse.success(updatedItem, 'Food item updated successfully')
    );

  } catch (error) {
    logger.error('Error updating food item:', error);
    res.status(500).json(
      ApiResponse.error('Failed to update food item', 500)
    );
  }
});

// Delete food item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = database.getClient();

    // Check if user owns the food item
    const { data: existingItem, error: fetchError } = await supabase
      .from('food_items')
      .select('user_id, image_url')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json(
        ApiResponse.error('Food item not found', 404)
      );
    }

    if (existingItem.user_id !== req.user.id) {
      return res.status(403).json(
        ApiResponse.error('Not authorized to delete this item', 403)
      );
    }

    // Delete image from storage if exists
    if (existingItem.image_url) {
      // Extract file path and delete from Supabase storage
      // Implementation depends on your storage setup
    }

    const { error } = await supabase
      .from('food_items')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    logger.info('Food item deleted:', { id, userId: req.user.id });

    res.json(
      ApiResponse.success(null, 'Food item deleted successfully')
    );

  } catch (error) {
    logger.error('Error deleting food item:', error);
    res.status(500).json(
      ApiResponse.error('Failed to delete food item', 500)
    );
  }
});

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;