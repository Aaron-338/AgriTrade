'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService, User } from '@/lib/services/authService';
import FarmerProductsList from '@/components/FarmerProductsList';
import AddProductForm from '@/components/AddProductForm';
import BuyerOrderHistory from '@/components/BuyerOrderHistory';
import { productService } from '@/lib/services/productService';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productListRefreshTrigger, setProductListRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    activeListings: 0,
    totalOrders: 0,
    totalRevenue: 0,
    ordersPlaced: 0,
    savedFarmers: 0,
  });

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Force redirect if not authenticated
        router.push('/login');
        return;
      }
      
      // Get the current user
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        // Initialize form data with current user's data
        setFormData({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser.phone || currentUser.phoneNumber || '',
          location: currentUser.location || '',
        });
      } else {
        // If getCurrentUser() returns null but isAuthenticated is true
        // Something is wrong with the auth state, redirect to login
        router.push('/login');
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  // Fetch dashboard metrics when user is loaded
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;
      
      try {
        if (user.userType === 'farmer') {
          // For a farmer, fetch products, orders, and revenue
          const products = await productService.getProducts();
          
          // Filter products for this farmer
          const farmerProducts = products.filter(
            product => product.farmer.id === user.id || product.farmer.name.includes(user.firstName)
          );
          
          // In a real app, we would fetch orders from an API
          // For now, simulate with mock data
          const activeListings = farmerProducts.length;
          const totalOrders = Math.floor(Math.random() * 50) + 10; // Random for demo
          const totalRevenue = farmerProducts.reduce((sum, product) => {
            // Estimate revenue as price * average sold quantity
            const estimatedSales = Math.floor(Math.random() * 20) + 5;
            return sum + (product.price * estimatedSales);
          }, 0);
          
          setMetrics({
            ...metrics,
            activeListings,
            totalOrders,
            totalRevenue,
          });
        } else {
          // For a buyer, fetch orders placed and saved farmers
          // In a real app, we would fetch this from an API
          const ordersPlaced = Math.floor(Math.random() * 10) + 1; // Random for demo
          const savedFarmers = Math.floor(Math.random() * 5) + 1; // Random for demo
          
          setMetrics({
            ...metrics,
            ordersPlaced,
            savedFarmers,
          });
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileEdit = () => {
    setShowEditProfile(true);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleAddProductSuccess = () => {
    setShowAddProduct(false);
    // Increment the refresh trigger to force the product list to reload
    setProductListRefreshTrigger(prev => prev + 1);
    
    // Update metrics
    if (metrics) {
      setMetrics({
        ...metrics,
        activeListings: metrics.activeListings + 1
      });
    }
  };

  const handleAddProductCancel = () => {
    setShowAddProduct(false);
  };

  const handleEditProfileCancel = () => {
    setShowEditProfile(false);
    setSaveSuccess(false);
    setSaveError(null);
    
    // Reset form data to current user's data
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || user.phoneNumber || '',
        location: user.location || '',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Clear previous states
      setSaveSuccess(false);
      setSaveError(null);
      
      // In a real app, this would call an API endpoint to update the user data
      // For this implementation, we'll update the mock data in localStorage
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Create updated user object
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        phoneNumber: formData.phone, // For compatibility with both fields
        location: formData.location,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update localStorage with the new user data
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Update user state
      setUser(updatedUser);
      
      // Show success message
      setSaveSuccess(true);
      
      // Close modal after a delay
      setTimeout(() => {
        setShowEditProfile(false);
        setSaveSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Safety check - should never render this if not authenticated due to the redirect
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl font-bold mb-4 md:mb-0 md:mr-6">
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  {user?.userType === 'farmer' ? 'Farmer' : 'Buyer'}
                </span>
                {user?.userType === 'farmer' && user?.location && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                    {user.location}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto mt-4 md:mt-0">
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{user?.phone || user?.phoneNumber}</p>
                </div>
                {user?.userType === 'farmer' && user?.location && (
                  <div>
                    <p className="text-sm text-gray-500">Farm Location</p>
                    <p className="font-medium">{user.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium">{user?.userType === 'farmer' ? 'Farmer' : 'Buyer'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  onClick={handleProfileEdit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Content based on user type */}
          <div className="md:col-span-2">
            {/* Main Dashboard */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Dashboard</h2>
              
              {user?.userType === 'farmer' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg text-green-700">{metrics.activeListings}</h3>
                      <p className="text-green-600">Active Listings</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg text-blue-700">{metrics.totalOrders}</h3>
                      <p className="text-blue-600">Total Orders</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg text-yellow-700">${metrics.totalRevenue.toFixed(2)}</h3>
                      <p className="text-yellow-600">Total Revenue</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Recent Orders</h3>
                    <div className="bg-gray-50 p-4 rounded text-center">
                      <p className="text-gray-500">No recent orders to display</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      onClick={handleAddProduct}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Add New Product
                    </button>
                    <Link 
                      href="/farmer-dashboard"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      View All Listings
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg text-green-700">{metrics.ordersPlaced}</h3>
                      <p className="text-green-600">Orders Placed</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg text-blue-700">{metrics.savedFarmers}</h3>
                      <p className="text-blue-600">Saved Farmers</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Recent Purchases</h3>
                    <div className="bg-gray-50 p-4 rounded text-center">
                      <p className="text-gray-500">No recent purchases to display</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Link 
                      href="/marketplace"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Browse Marketplace
                    </Link>
                    <Link 
                      href="/orders"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      View Order History
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Additional content based on user type */}
            {user?.userType === 'farmer' ? (
              // For farmers: show product listings
              !showAddProduct ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <FarmerProductsList 
                    limit={3} 
                    showAddButton 
                    onAddClick={handleAddProduct}
                    refreshTrigger={productListRefreshTrigger}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <AddProductForm 
                    onSuccess={handleAddProductSuccess} 
                    onCancel={handleAddProductCancel} 
                  />
                </div>
              )
            ) : (
              // For buyers: show order history
              <div className="bg-white rounded-lg shadow-md p-6">
                <BuyerOrderHistory limit={3} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal - will display when showEditProfile is true */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            
            {saveSuccess && (
              <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
                Profile updated successfully!
              </div>
            )}
            
            {saveError && (
              <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
                Error: {saveError}
              </div>
            )}
            
            <form className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              {user?.userType === 'farmer' && (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Farm Location</label>
                  <input 
                    type="text" 
                    id="location" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={handleEditProfileCancel}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 