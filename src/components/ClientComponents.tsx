'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

export default function ClientComponents({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </CartProvider>
    </AuthGuard>
  );
} 