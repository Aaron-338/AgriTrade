'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, isLoading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Handle quantity update
  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  // Handle removing an item from cart
  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  // Handle clearing the entire cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  // Handle checkout process
  const handleCheckout = () => {
    // In this implementation, we'll just redirect to the checkout page
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
          <div className="mt-6">
            <Link
              href="/marketplace"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        
        <div className="mt-12">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.productId} className="py-4 sm:py-5 sm:grid sm:grid-cols-12 sm:gap-4 sm:px-6 items-center">
                    <dt className="sm:col-span-2">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 bg-gray-200 flex items-center justify-center">
                            <FiShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-4">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-gray-500">Farmer: {item.farmerName}</div>
                      <div className="text-gray-500">${item.price.toFixed(2)} per unit</div>
                    </dd>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                          disabled={item.quantity >= item.availableQuantity}
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </dd>
                    <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </dd>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleClearCart}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Clear Cart
            </button>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
              <div className="mt-5 border-t border-gray-200 pt-5">
                <dl className="space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">${cart.subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">Calculated at checkout</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                    <dd className="text-base font-medium text-gray-900">${cart.subtotal.toFixed(2)}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 