'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';

export default function Unauthorized() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    // Get current user type if authenticated
    const user = authService.getCurrentUser();
    if (user) {
      setUserType(user.userType);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <p className="text-md text-gray-700">
            This area is restricted to {userType === 'farmer' ? 'buyers' : 'farmers'} only.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Available Options</h3>
            {userType === 'farmer' ? (
              <ul className="mt-4 list-disc list-inside text-left text-gray-700 space-y-2">
                <li>Manage your farm products</li>
                <li>View your sales history</li>
                <li>Update your farm profile</li>
              </ul>
            ) : (
              <ul className="mt-4 list-disc list-inside text-left text-gray-700 space-y-2">
                <li>Browse products in the marketplace</li>
                <li>Place orders for agricultural products</li>
                <li>Track your order history</li>
              </ul>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center mt-6">
            {userType === 'farmer' ? (
              <Link 
                href="/my-products" 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Go to My Products
              </Link>
            ) : (
              <Link 
                href="/marketplace" 
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Go to Marketplace
              </Link>
            )}
            <button
              onClick={() => router.back()}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 