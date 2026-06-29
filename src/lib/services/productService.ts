// Types
export interface Farmer {
  id: string;
  name: string;
  location: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  farmer: Farmer;
  category: string;
  createdAt: string;
}

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Locally grown, organic tomatoes picked at peak ripeness. Perfect for salads and cooking.',
    price: 2.99,
    unit: 'kg',
    quantity: 100,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    farmer: {
      id: 'f1',
      name: 'John Farmer',
      location: 'Roma, Lesotho',
      rating: 4.7,
    },
    category: 'Vegetables',
    createdAt: '2023-06-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Organic Potatoes',
    description: 'Freshly harvested organic potatoes. Versatile for various dishes and rich in nutrients.',
    price: 1.75,
    unit: 'kg',
    quantity: 250,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    farmer: {
      id: 'f2',
      name: 'Sarah Green',
      location: 'Mohale\'s Hoek, Lesotho',
      rating: 4.5,
    },
    category: 'Vegetables',
    createdAt: '2023-06-14T10:15:00Z',
  },
  {
    id: '3',
    name: 'Farm Fresh Eggs',
    description: 'Free-range chicken eggs from pasture-raised hens. No hormones or antibiotics.',
    price: 3.50,
    unit: 'dozen',
    quantity: 45,
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
    farmer: {
      id: 'f3',
      name: 'Michael Farms',
      location: 'Maseru, Lesotho',
      rating: 4.9,
    },
    category: 'Dairy & Eggs',
    createdAt: '2023-06-16T09:45:00Z',
  },
  {
    id: '4',
    name: 'Fresh Spinach',
    description: 'Nutrient-rich leafy green spinach, perfect for salads, smoothies, and cooking.',
    price: 2.25,
    unit: 'bunch',
    quantity: 80,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    farmer: {
      id: 'f2',
      name: 'Sarah Green',
      location: 'Mohale\'s Hoek, Lesotho',
      rating: 4.5,
    },
    category: 'Vegetables',
    createdAt: '2023-06-15T14:20:00Z',
  },
  {
    id: '5',
    name: 'Local Honey',
    description: 'Raw, unfiltered honey from local beekeepers. Rich in flavor and natural enzymes.',
    price: 8.99,
    unit: 'jar',
    quantity: 35,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    farmer: {
      id: 'f4',
      name: 'Bee Haven Farms',
      location: 'Butha-Buthe, Lesotho',
      rating: 4.8,
    },
    category: 'Specialty',
    createdAt: '2023-06-12T11:30:00Z',
  },
  {
    id: '6',
    name: 'Fresh Apples',
    description: 'Crisp and sweet apples, perfect for snacking or baking. Grown with sustainable practices.',
    price: 3.25,
    unit: 'kg',
    quantity: 150,
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80',
    farmer: {
      id: 'f1',
      name: 'John Farmer',
      location: 'Roma, Lesotho',
      rating: 4.7,
    },
    category: 'Fruits',
    createdAt: '2023-06-16T07:45:00Z',
  },
];

// Available categories
export const productCategories = ['All', 'Vegetables', 'Fruits', 'Dairy & Eggs', 'Grains', 'Meat', 'Specialty'];

export interface ProductFilter {
  searchTerm?: string;
  category?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high';
}

// Service functions
export const productService = {
  // Get all products with optional filtering
  getProducts: async (filter?: ProductFilter): Promise<Product[]> => {
    // This would be replaced with an actual API call in production
    // For now, we're simulating a network request with a small delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredProducts = [...mockProducts];
    
    // Apply filters
    if (filter) {
      // Search term filter
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.farmer.name.toLowerCase().includes(searchLower)
        );
      }
      
      // Category filter
      if (filter.category && filter.category !== 'All') {
        filteredProducts = filteredProducts.filter(product => 
          product.category === filter.category
        );
      }
      
      // Sorting
      if (filter.sortBy) {
        filteredProducts.sort((a, b) => {
          switch (filter.sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            default:
              return 0;
          }
        });
      }
    }
    
    return filteredProducts;
  },
  
  // Get a single product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    // This would be replaced with an actual API call in production
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = mockProducts.find(p => p.id === id);
    return product || null;
  },
  
  // Get all available categories
  getCategories: async (): Promise<string[]> => {
    // This would be an API call in production
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return productCategories;
  },
  
  // Create a new product
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    // This would be an API call in production
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate random ID for the mock product
    const productId = 'p' + Math.floor(Math.random() * 10000);
    
    // Create new product with current timestamp
    const newProduct: Product = {
      ...productData,
      id: productId,
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock products array
    mockProducts.unshift(newProduct);
    
    return newProduct;
  }
}; 