// This is a simplified version of an Unsplash API service
// In a production environment, you would use the actual Unsplash API

// Fallback image in case the primary image fails to load
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1627483297886-49710ae1fc22?auto=format&fit=crop&w=800&q=80';

// Product image mapping by category
const productImagesByCategory: Record<string, string[]> = {
  'Vegetables': [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', // Tomatoes
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', // Potatoes
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', // Spinach
    'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80', // Carrots
    'https://images.unsplash.com/photo-1566842600175-97dca3c5bd12?auto=format&fit=crop&w=800&q=80', // Broccoli
    'https://images.unsplash.com/photo-1594282486552-05a30d0f1f70?auto=format&fit=crop&w=800&q=80', // Onions
    'https://images.unsplash.com/photo-1613743990305-d6c8700dd8f8?auto=format&fit=crop&w=800&q=80', // Cucumber
    'https://images.unsplash.com/photo-1572451479139-6a308211d8be?auto=format&fit=crop&w=800&q=80', // Bell Peppers
  ],
  'Fruits': [
    'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80', // Apples
    'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80', // Bananas
    'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=800&q=80', // Avocados
    'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80', // Berries
    'https://images.unsplash.com/photo-1546636889-ba9fdd63583e?auto=format&fit=crop&w=800&q=80', // Peaches
    'https://images.unsplash.com/photo-1521243495304-138a02be58e2?auto=format&fit=crop&w=800&q=80', // Pineapples
  ],
  'Dairy & Eggs': [
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80', // Eggs
    'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=800&q=80', // Milk
    'https://images.unsplash.com/photo-1626957341926-98752fc2ba47?auto=format&fit=crop&w=800&q=80', // Cheese
    'https://images.unsplash.com/photo-1633432695467-fd68f1dc8fd2?auto=format&fit=crop&w=800&q=80', // Yogurt
    'https://images.unsplash.com/photo-1589985270826-4b7bb135ab9d?auto=format&fit=crop&w=800&q=80', // Butter
  ],
  'Grains': [
    'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?auto=format&fit=crop&w=800&q=80', // Rice
    'https://images.unsplash.com/photo-1586444248836-27a6bf31c931?auto=format&fit=crop&w=800&q=80', // Wheat/Flour
    'https://images.unsplash.com/photo-1510081093134-c8a062268c38?auto=format&fit=crop&w=800&q=80', // Bread
    'https://images.unsplash.com/photo-1626078299034-c50613442ca0?auto=format&fit=crop&w=800&q=80', // Pasta
  ],
  'Meat': [
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80', // Beef
    'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=800&q=80', // Chicken
    'https://images.unsplash.com/photo-1624174516055-0cbd1ac2cb57?auto=format&fit=crop&w=800&q=80', // Pork
    'https://images.unsplash.com/photo-1603048297172-c93544237bda?auto=format&fit=crop&w=800&q=80', // Fish/Seafood
  ],
  'Specialty': [
    'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80', // Honey
    'https://images.unsplash.com/photo-1582749990332-aa39597de3e8?auto=format&fit=crop&w=800&q=80', // Herbs
    'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?auto=format&fit=crop&w=800&q=80', // Spices
    'https://images.unsplash.com/photo-1622040806062-07d46ac83c52?auto=format&fit=crop&w=800&q=80', // Nuts
    'https://images.unsplash.com/photo-1515779122185-2390ccdf60b3?auto=format&fit=crop&w=800&q=80', // Jams
  ],
  // Add a "Featured" category with known working image URLs
  'Featured': [
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80', // Fresh produce 
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80', // Marketplace
    'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?auto=format&fit=crop&w=800&q=80', // Farmer
  ],
};

// Product-specific image mapping
const productImageMappings: Record<string, string> = {
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  'tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  'potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  'egg': 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
  'eggs': 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
  'honey': 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
  'apple': 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80',
  'apples': 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80',
  'carrot': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
  'carrots': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
  'broccoli': 'https://images.unsplash.com/photo-1566842600175-97dca3c5bd12?auto=format&fit=crop&w=800&q=80',
  'onion': 'https://images.unsplash.com/photo-1594282486552-05a30d0f1f70?auto=format&fit=crop&w=800&q=80',
  'onions': 'https://images.unsplash.com/photo-1594282486552-05a30d0f1f70?auto=format&fit=crop&w=800&q=80',
  'cucumber': 'https://images.unsplash.com/photo-1613743990305-d6c8700dd8f8?auto=format&fit=crop&w=800&q=80',
  'pepper': 'https://images.unsplash.com/photo-1572451479139-6a308211d8be?auto=format&fit=crop&w=800&q=80',
  'peppers': 'https://images.unsplash.com/photo-1572451479139-6a308211d8be?auto=format&fit=crop&w=800&q=80',
  'banana': 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80',
  'bananas': 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=800&q=80',
  'avocado': 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=800&q=80',
  'avocados': 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=800&q=80',
  // Add replacements for broken images
  'farmer': 'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?auto=format&fit=crop&w=800&q=80',
  'marketplace': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
  'produce': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
};

// Add replacements for the broken images
const brokenImageReplacements: Record<string, string> = {
  'https://images.unsplash.com/photo-1592982551635-069e7b9a171d?q=80&w=1000&auto=format&fit=crop': 
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
  
  'https://images.unsplash.com/photo-1623775435336-10c16d7f923d?q=80&w=1000&auto=format&fit=crop': 
    'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?auto=format&fit=crop&w=800&q=80',
  
  'https://images.unsplash.com/photo-1599373670414-47663615fb41?q=80&w=1000&auto=format&fit=crop': 
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80'
};

export const unsplashService = {
  /**
   * Get an image URL for a product based on its name and category
   * @param productName - The name of the product
   * @param category - The category of the product
   * @returns A URL to an appropriate image from Unsplash
   */
  getProductImageUrl: (productName: string, category: string = 'Vegetables'): string => {
    // First, check if we have a direct mapping for this product name
    const normalizedName = productName.toLowerCase().trim();
    
    // Check if we have a direct mapping
    if (productImageMappings[normalizedName]) {
      return productImageMappings[normalizedName];
    }
    
    // Check individual words in the product name
    const words = normalizedName.split(' ');
    for (const word of words) {
      if (productImageMappings[word]) {
        return productImageMappings[word];
      }
    }
    
    // If no direct mapping, get a random image from the category
    const categoryImages = productImagesByCategory[category] || productImagesByCategory['Featured'];
    const randomIndex = Math.floor(Math.random() * categoryImages.length);
    return categoryImages[randomIndex];
  },
  
  /**
   * Get random images for a specific category
   * @param category - The category to get images for
   * @param count - Number of images to return
   * @returns An array of image URLs
   */
  getCategoryImages: (category: string, count: number = 1): string[] => {
    const categoryImages = productImagesByCategory[category] || 
                          (category === 'Featured' ? 
                           productImagesByCategory['Featured'] : 
                           productImagesByCategory['Vegetables']);
    
    // If requesting more images than available, duplicate the array
    if (count > categoryImages.length) {
      const result: string[] = [];
      for (let i = 0; i < count; i++) {
        result.push(categoryImages[i % categoryImages.length]);
      }
      return result;
    }
    
    // Otherwise, get random images from the category
    const shuffled = [...categoryImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  /**
   * Get a replacement for a known broken image URL
   * @param url - The broken image URL
   * @returns A working replacement URL or the fallback image
   */
  getReplacementImage: (url: string): string => {
    return brokenImageReplacements[url] || FALLBACK_IMAGE;
  },

  /**
   * Get the fallback image URL
   * @returns The fallback image URL
   */
  getFallbackImage: (): string => {
    return FALLBACK_IMAGE;
  }
}; 