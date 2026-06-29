'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/lib/services/cartService';
import { cartService } from '@/lib/services/cartService';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  addToCart: (productId: string, productName: string, price: number, quantity: number, farmerId: string, farmerName: string, availableQuantity: number, imageUrl?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const userCart = await cartService.getCart();
        setCart(userCart);
      } catch (error) {
        console.error('Failed to initialize cart:', error);
        toast.error('Failed to load your cart. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, []);

  const addToCart = async (
    productId: string, 
    productName: string, 
    price: number, 
    quantity: number, 
    farmerId: string, 
    farmerName: string,
    availableQuantity: number,
    imageUrl?: string
  ) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartService.addToCart({
        productId,
        productName,
        price,
        quantity,
        farmerId,
        farmerName,
        availableQuantity,
        imageUrl
      });
      setCart(updatedCart);
      toast.success(`${productName} added to your cart`);
    } catch (error: any) {
      console.error('Failed to add item to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await cartService.updateQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await cartService.clearCart();
      setCart({ items: [], totalItems: 0, subtotal: 0 });
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 