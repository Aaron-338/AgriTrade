'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService, User } from '@/lib/services/authService';

// Define routes that are restricted to specific user types
const FARMER_ONLY_ROUTES = [
  '/farmer-dashboard',
  '/add-product', 
  '/my-products'
];

const BUYER_ONLY_ROUTES = [
  '/buyer-dashboard',
  '/my-orders',
  '/saved-items'
];

interface RoleGuardProps {
  children: React.ReactNode;
}

export default function RoleGuard({ children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUserRole = () => {
      const isAuthenticated = authService.isAuthenticated();
      const currentPath = pathname || '/';
      
      // Allow access to public routes for everyone
      if (!FARMER_ONLY_ROUTES.includes(currentPath) && !BUYER_ONLY_ROUTES.includes(currentPath)) {
        setAuthorized(true);
        setLoading(false);
        return;
      }
      
      // If trying to access a role-specific route without being authenticated
      if (!isAuthenticated) {
        setAuthorized(false);
        setLoading(false);
        router.push('/login');
        return;
      }
      
      // Get current user
      const user = authService.getCurrentUser();
      
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        router.push('/login');
        return;
      }
      
      // Check if user has permission for the route
      const isFarmerRoute = FARMER_ONLY_ROUTES.includes(currentPath);
      const isBuyerRoute = BUYER_ONLY_ROUTES.includes(currentPath);
      
      if (isFarmerRoute && user.userType !== 'farmer') {
        // Buyer trying to access farmer route
        setAuthorized(false);
        setLoading(false);
        router.push('/unauthorized');
        return;
      }
      
      if (isBuyerRoute && user.userType !== 'buyer') {
        // Farmer trying to access buyer route
        setAuthorized(false);
        setLoading(false);
        router.push('/unauthorized');
        return;
      }
      
      // User has correct role for this route
      setAuthorized(true);
      setLoading(false);
    };
    
    checkUserRole();
  }, [pathname, router]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  // If not authorized, show nothing while redirecting
  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }
  
  // Render children
  return <>{children}</>;
} 