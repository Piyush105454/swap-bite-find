class CarbonCalculator {
  static foodCarbonData = {
    'vegetables': 0.5,
    'fruits': 0.8,
    'grains': 1.4,
    'legumes': 0.9,
    'nuts': 2.3,
    'non-veg': 6.9,
    'baked': 1.2,
    'desserts': 2.1,
    'meals': 2.5,
    'processed': 3.2,
    'beverages': 0.7
  };

  static unitMultipliers = {
    'kg': 1,
    'g': 0.001,
    'liters': 1,
    'ml': 0.001,
    'pieces': 0.1,
    'packs': 0.5
  };

  static calculateEmissions(category, quantity = 1, unit = 'pieces') {
    try {
      const baseCarbonPerKg = this.foodCarbonData[category] || 1.0;
      const unitMultiplier = this.unitMultipliers[unit] || 0.1;
      
      const totalCarbon = baseCarbonPerKg * quantity * unitMultiplier;
      
      // Round to 2 decimal places
      return Math.round(totalCarbon * 100) / 100;
    } catch (error) {
      console.error('Error calculating carbon emissions:', error);
      return 1.0; // Default value
    }
  }

  static getUserAverageEmissions(userFoodItems) {
    if (!userFoodItems || userFoodItems.length === 0) {
      return 0;
    }

    const totalEmissions = userFoodItems.reduce((sum, item) => {
      return sum + (item.carbon_emissions || 0);
    }, 0);

    return totalEmissions / userFoodItems.length;
  }

  static getGlobalAverageEmissions(allFoodItems) {
    if (!allFoodItems || allFoodItems.length === 0) {
      return 0;
    }

    const totalEmissions = allFoodItems.reduce((sum, item) => {
      return sum + (item.carbon_emissions || 0);
    }, 0);

    return totalEmissions / allFoodItems.length;
  }

  static getSustainabilityTips(userAverage, globalAverage) {
    const tips = [];

    if (userAverage > globalAverage) {
      tips.push("Consider sharing more plant-based foods to reduce carbon footprint");
      tips.push("Try to share locally grown produce when possible");
      tips.push("Reduce packaging by sharing fresh, unprocessed foods");
    } else {
      tips.push("Great job! Your food choices are more sustainable than average");
      tips.push("Keep sharing fresh, local produce to maintain low emissions");
    }

    return tips;
  }
}

module.exports = CarbonCalculator;