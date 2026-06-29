'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { authService } from '@/lib/services/authService';
import { useCart } from '@/contexts/CartContext';

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const user = authService.getCurrentUser();
        if (user) {
          setUserType(user.userType);
        }
      }
    };
    
    checkAuth();
    
    // Setup an event listener for auth changes
    window.addEventListener('auth-change', checkAuth);
    
    // Cleanup
    return () => {
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    authService.logout();
    window.dispatchEvent(new Event('auth-change'));
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-green-600 font-bold text-xl">
                AgriTrade
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`${
                  pathname === '/'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className={`${
                  pathname === '/marketplace'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Marketplace
              </Link>
              <Link
                href="/farmers"
                className={`${
                  pathname === '/farmers'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Farmers
              </Link>
              <Link
                href="/buyers"
                className={`${
                  pathname === '/buyers'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Buyers
              </Link>
              <Link
                href="/about"
                className={`${
                  pathname === '/about'
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                About Us
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated && userType === 'buyer' && (
              <Link
                href="/cart"
                className="relative text-gray-600 hover:text-gray-900 p-2"
              >
                <FiShoppingCart className="h-6 w-6" />
                {cart && cart.totalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-block w-5 h-5 text-xs text-center text-white bg-red-500 rounded-full">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                {userType === 'farmer' && (
                  <Link
                    href="/farmer-dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                {userType === 'buyer' && (
                  <Link
                    href="/buyer-dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`${
                pathname === '/'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              onClick={closeMobileMenu}
              className={`${
                pathname === '/marketplace'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Marketplace
            </Link>
            <Link
              href="/farmers"
              onClick={closeMobileMenu}
              className={`${
                pathname === '/farmers'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Farmers
            </Link>
            <Link
              href="/buyers"
              onClick={closeMobileMenu}
              className={`${
                pathname === '/buyers'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Buyers
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className={`${
                pathname === '/about'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              About Us
            </Link>
            
            {isAuthenticated && userType === 'buyer' && (
              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className={`${
                  pathname === '/cart'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
              >
                Cart
                {cart && cart.totalItems > 0 && (
                  <span className="ml-2 inline-block w-5 h-5 text-xs text-center text-white bg-red-500 rounded-full leading-5">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Profile
                </Link>
                {userType === 'farmer' && (
                  <Link
                    href="/farmer-dashboard"
                    onClick={closeMobileMenu}
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  >
                    Dashboard
                  </Link>
                )}
                {userType === 'buyer' && (
                  <Link
                    href="/buyer-dashboard"
                    onClick={closeMobileMenu}
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 