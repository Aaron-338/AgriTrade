'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, productService } from '@/lib/services/productService';
import { authService } from '@/lib/services/authService';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(params.id);
        
        if (data) {
          setProduct(data);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    // Check authentication status
    const auth = authService.isAuthenticated();
    setIsAuthenticated(auth);

    if (auth) {
      const user = authService.getCurrentUser();
      if (user) {
        setUserType(user.userType);
      }
    }
  }, []);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Add the product to cart using the cart context
    if (product) {
      addToCart(
        product.id,
        product.name,
        product.price,
        quantity,
        product.farmer.id,
        product.farmer.name,
        product.quantity,
        product.image
      );
    }
  };

  const handleContactFarmer = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Here you would implement contacting the farmer
    alert(`Contact feature will be available soon!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 inline-block">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Product not found'}</p>
            </div>
          </div>
        </div>
        <Link href="/marketplace" className="btn-primary">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/marketplace" className="text-green-600 hover:text-green-800 flex items-center">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Marketplace
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="relative h-80 md:h-96 bg-gray-200 rounded-lg">
            {/* Fallback for images */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              {!product.image || imgError ? (
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-lg">{product.name}</p>
                </div>
              ) : null}
            </div>
            
            {product.image && !imgError && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
                onError={() => setImgError(true)}
              />
            )}
            
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
              {product.category}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-2xl text-green-600 font-bold mb-4">
              ${product.price.toFixed(2)} per {product.unit}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Availability</h2>
              <p className="text-gray-700">{product.quantity} {product.unit} available</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Farmer</h2>
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="font-medium">{product.farmer.name}</p>
                  <p className="text-gray-600 text-sm">{product.farmer.location}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < product.farmer.rating ? 'text-yellow-400' : 'text-gray-300'
                        } fill-current`} 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({product.farmer.rating})</span>
                  </div>
                </div>
                <button
                  onClick={handleContactFarmer}
                  className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Contact Farmer
                </button>
              </div>
            </div>
            
            {/* Order Section - Only show for buyers */}
            {isAuthenticated && userType === 'buyer' && (
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-4">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 shadow-sm focus:ring-green-500 focus:border-green-500 block sm:text-sm border-gray-300 rounded-md"
                  />
                  <span className="ml-2 text-gray-600">{product.unit}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    Total: ${(product.price * quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            )}
            
            {/* Message for farmers viewing other farmers' products */}
            {isAuthenticated && userType === 'farmer' && (
              <div className="border-t pt-6">
                <p className="text-gray-600 italic">
                  As a farmer, you can browse products but cannot place orders.
                </p>
              </div>
            )}
            
            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="border-t pt-6">
                <p className="text-gray-600">
                  <Link href="/login" className="text-green-600 hover:text-green-800">
                    Login
                  </Link> or <Link href="/register" className="text-green-600 hover:text-green-800">
                    Register
                  </Link> to place orders or contact farmers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related Products Section - Would be implemented in a future version */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">More from {product.farmer.name}</h2>
        <p className="text-gray-600">Coming soon! Browse more products from this farmer.</p>
      </div>
    </div>
  );
} 