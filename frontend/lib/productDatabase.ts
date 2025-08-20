// Product database for sustainability information
// Ported from Python backend for Vercel deployment

interface ProductInfo {
  name: string;
  brand: string;
  category: string;
  barcode: string;
  sustainability_indicators: string[];
  confidence: number;
}

interface SustainabilityData {
  name: string;
  brand: string;
  category: string;
  description: string;
  ingredients: string[];
  sustainability_score: {
    overall_score: number;
    environmental_impact: number;
    carbon_footprint: number;
    packaging_score: number;
    recyclability: number;
    ethical_sourcing: number;
    certifications: string[];
    improvement_suggestions: string[];
  };
  eco_rating: string;
  environmental_tips: string[];
  alternatives: Array<{
    name: string;
    reason: string;
  }>;
}

// Mock product database
const productDatabase: Record<string, ProductInfo> = {
  "123456789012": {
    name: "Organic Pasta",
    brand: "EcoChoice",
    category: "food",
    barcode: "123456789012",
    sustainability_indicators: ["Organic", "Local", "Recyclable Packaging"],
    confidence: 0.95,
  },
  "987654321098": {
    name: "Bamboo Toothbrush",
    brand: "SustainableLife",
    category: "personal_care",
    barcode: "987654321098",
    sustainability_indicators: ["Biodegradable", "Plastic-Free", "Fair Trade"],
    confidence: 0.92,
  },
  "456789012345": {
    name: "Recycled Paper Towels",
    brand: "GreenHome",
    category: "household",
    barcode: "456789012345",
    sustainability_indicators: ["Recycled Content", "Compostable", "Forest Friendly"],
    confidence: 0.88,
  },
  "789012345678": {
    name: "Organic Cotton T-Shirt",
    brand: "EthicalWear",
    category: "clothing",
    barcode: "789012345678",
    sustainability_indicators: ["Organic Cotton", "Fair Trade", "Carbon Neutral"],
    confidence: 0.90,
  },
  "234567890123": {
    name: "Solar Power Bank",
    brand: "CleanTech",
    category: "electronics",
    barcode: "234567890123",
    sustainability_indicators: ["Solar Powered", "Recyclable", "Energy Efficient"],
    confidence: 0.87,
  },
  "567890123456": {
    name: "Tangfastics",
    brand: "Haribo",
    category: "food",
    barcode: "567890123456",
    sustainability_indicators: ["Palm Oil Free", "Natural Colors", "Recyclable Packaging"],
    confidence: 0.85,
  },
  "678901234567": {
    name: "Chocolate Bar",
    brand: "Divine",
    category: "food",
    barcode: "678901234567",
    sustainability_indicators: ["Fair Trade", "Organic Cocoa", "Rainforest Alliance"],
    confidence: 0.91,
  },
  "789012345679": {
    name: "Protein Bar",
    brand: "NutriGreen",
    category: "food",
    barcode: "789012345679",
    sustainability_indicators: ["Plant-Based", "Compostable Wrapper", "Locally Sourced"],
    confidence: 0.88,
  },
  "890123456780": {
    name: "Energy Drink",
    brand: "FreshBoost",
    category: "beverages",
    barcode: "890123456780",
    sustainability_indicators: ["Organic", "Recyclable Can", "Carbon Neutral"],
    confidence: 0.83,
  },
  "901234567891": {
    name: "Instant Noodles",
    brand: "QuickMeal",
    category: "food",
    barcode: "901234567891",
    sustainability_indicators: ["Reduced Sodium", "Recyclable Cup", "Vegetarian"],
    confidence: 0.76,
  },
};

export function getProductInfo(barcode: string): ProductInfo | null {
  return productDatabase[barcode] || null;
}

export function generateSustainabilityData(productInfo: ProductInfo): SustainabilityData {
  const baseScore = Math.floor(Math.random() * 40) + 40; // 40-80 range
  
  return {
    name: productInfo.name,
    brand: productInfo.brand,
    category: productInfo.category,
    description: `Sustainable ${productInfo.name.toLowerCase()} with eco-friendly features`,
    ingredients: generateIngredients(productInfo.category),
    sustainability_score: {
      overall_score: baseScore,
      environmental_impact: Math.floor(Math.random() * 30) + 50,
      carbon_footprint: Math.floor(Math.random() * 25) + 45,
      packaging_score: Math.floor(Math.random() * 35) + 50,
      recyclability: Math.floor(Math.random() * 40) + 60,
      ethical_sourcing: Math.floor(Math.random() * 30) + 65,
      certifications: productInfo.sustainability_indicators,
      improvement_suggestions: [
        "Choose refillable packaging when available",
        "Look for local alternatives to reduce transport",
        "Recycle packaging responsibly"
      ],
    },
    eco_rating: baseScore >= 70 ? "Excellent" : baseScore >= 55 ? "Good" : "Fair",
    environmental_tips: [
      `This ${productInfo.name.toLowerCase()} appears to be an eco-conscious choice`,
      "Consider supporting brands with sustainable practices",
      "Look for certifications like organic, fair trade, or recycled content",
      "Proper disposal or recycling helps complete the sustainability cycle",
    ],
    alternatives: generateAlternatives(productInfo),
  };
}

function generateIngredients(category: string): string[] {
  switch (category) {
    case "food":
      return ["Organic ingredients", "Natural flavoring", "Sustainable palm oil"];
    case "beverages":
      return ["Natural extracts", "Organic cane sugar", "Recyclable packaging"];
    case "personal_care":
      return ["Natural materials", "Biodegradable components", "No harmful chemicals"];
    case "household":
      return ["Recycled materials", "Plant-based fibers", "Non-toxic substances"];
    case "clothing":
      return ["Organic cotton", "Natural dyes", "Sustainable fibers"];
    case "electronics":
      return ["Recycled metals", "Energy-efficient components", "Conflict-free materials"];
    default:
      return ["Sustainable materials", "Eco-friendly components"];
  }
}

function generateAlternatives(productInfo: ProductInfo): Array<{ name: string; reason: string }> {
  return [
    {
      name: `Local ${productInfo.name}`,
      reason: "Supporting local producers reduces transport emissions"
    },
    {
      name: `Bulk ${productInfo.name}`,
      reason: "Reduces packaging waste per unit"
    },
  ];
}

export function getSustainabilityAlternatives(barcode: string): Array<{ name: string; reason: string }> {
  const productInfo = getProductInfo(barcode);
  return productInfo ? generateAlternatives(productInfo) : [];
}

// Generate a random barcode for mock scanning
export function generateRandomBarcode(preferredCategory?: string): string {
  const barcodes = Object.keys(productDatabase);
  
  // If a preferred category is specified, try to find items in that category first
  if (preferredCategory) {
    const categoryBarcodes = barcodes.filter(barcode => 
      productDatabase[barcode].category === preferredCategory
    );
    if (categoryBarcodes.length > 0) {
      return categoryBarcodes[Math.floor(Math.random() * categoryBarcodes.length)];
    }
  }
  
  // For food-related contexts, prioritize food and beverage items
  const foodBarcodes = barcodes.filter(barcode => 
    ['food', 'beverages'].includes(productDatabase[barcode].category)
  );
  
  // 70% chance to return food items if available
  if (foodBarcodes.length > 0 && Math.random() < 0.7) {
    return foodBarcodes[Math.floor(Math.random() * foodBarcodes.length)];
  }
  
  // Fall back to any random item
  return barcodes[Math.floor(Math.random() * barcodes.length)];
}

export function getAllProducts(): ProductInfo[] {
  return Object.values(productDatabase);
}
