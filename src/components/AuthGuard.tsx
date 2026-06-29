'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/services/authService';

// Define public routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/register/success',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/forgot-password',
  '/marketplace'
];

// Define routes that should redirect to homepage if already authenticated
const GUEST_ONLY_ROUTES = [
  '/login',
  '/register',
  '/register/success',
  '/forgot-password'
];

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication status once
    const checkAuth = () => {
      // Get current user and authentication status
      const isAuthenticated = authService.isAuthenticated();
      const currentPath = pathname || '/';
      
      // Check if the route is public
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        currentPath === route || 
        currentPath.startsWith('/products') || 
        currentPath.startsWith('/marketplace')
      );
      
      // Check if the route is guest-only
      const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(currentPath);
      
      // Handle routing logic
      if (!isAuthenticated && !isPublicRoute) {
        // Not authenticated and trying to access protected route
        setAuthorized(false);
        setLoading(false);
        router.push('/login');
        return;
      } else if (isAuthenticated && isGuestOnlyRoute) {
        // Authenticated and trying to access guest-only route
        setAuthorized(false);
        setLoading(false);
        router.push('/');
        return;
      }
      
      // Authorized to view the page
      setAuthorized(true);
      setLoading(false);
    };
    
    // Run on mount and when pathname changes
    checkAuth();
    
    // Set up an event listener for route changes
    const handleRouteChange = () => {
      checkAuth();
    };
    
    // Clean-up
    return () => {
      // Any cleanup needed
    };
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
  
  // Render children once auth check is complete and authorized
  return <>{children}</>;
} 