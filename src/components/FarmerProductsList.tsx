import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { productService, Product } from '@/lib/services/productService';
import { authService } from '@/lib/services/authService';
import { toast } from 'react-hot-toast';

interface FarmerProductsListProps {
  limit?: number;
  showAddButton?: boolean;
  onAddClick?: () => void;
  refreshTrigger?: number; // A prop that triggers refreshing the list when it changes
}

export default function FarmerProductsList({ 
  limit, 
  showAddButton = true,
  onAddClick,
  refreshTrigger = 0
}: FarmerProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // In a real app, we would filter by farmer ID on the server
      // For now, we simulate this by filtering the mock data
      const allProducts = await productService.getProducts();
      
      // Filter to only show this farmer's products
      // In our mock data, we're using farmer.id to match with user.id
      const farmerProducts = allProducts.filter(product => 
        product.farmer.id === user.id || 
        product.farmer.name.includes(user.firstName)  // Fallback for mock data
      );
      
      // Apply limit if provided
      const limitedProducts = limit ? farmerProducts.slice(0, limit) : farmerProducts;
      
      setProducts(limitedProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load your products');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Fetch products on mount and when refreshTrigger changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshTrigger]);

  const handleRemoveProduct = async (productId: string) => {
    try {
      // In a real app, this would call an API to delete the product
      // For now, we're just simulating the deletion in the UI
      
      // Show loading toast
      toast.loading('Removing product...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the local state to remove the product
      setProducts(currentProducts => 
        currentProducts.filter(product => product.id !== productId)
      );
      
      // Show success message
      toast.dismiss();
      toast.success('Product removed successfully');
      
    } catch (error) {
      console.error('Error removing product:', error);
      toast.dismiss();
      toast.error('Failed to remove product');
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600 mb-4">You don't have any products listed yet.</p>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Your First Product
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Your Products</h3>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            + Add New
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white overflow-hidden rounded-lg shadow">
            <div className="relative h-48 w-full">
              <Image
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h4 className="text-md font-semibold text-gray-900 mb-1">{product.name}</h4>
                <span className="text-green-600 font-semibold">${product.price.toFixed(2)}/{product.unit}</span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
              
              <div className="flex justify-between items-center mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {product.category}
                </span>
                <span className="text-sm text-gray-500">
                  Qty: {product.quantity} {product.unit}
                </span>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Link
                  href={`/product/${product.id}`}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleRemoveProduct(product.id)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 