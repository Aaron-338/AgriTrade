'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useCart } from '@/contexts/CartContext';
import { authService } from '@/lib/services/authService';
import { toast } from 'react-hot-toast';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: 'credit_card' | 'mobile_money' | 'cash_on_delivery';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  mobileNumber?: string;
  mobileProvider?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isLoading: isCartLoading } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<FormData>();
  
  const selectedPaymentMethod = watch('paymentMethod');
  
  useEffect(() => {
    // Verify the user is authenticated
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
      router.push('/login?redirectTo=/checkout');
      return;
    }
    
    // Only buyers can checkout
    if (currentUser.userType !== 'buyer') {
      router.push('/unauthorized');
      return;
    }
    
    setUser(currentUser);
    
    // Pre-fill form fields if user data is available
    if (currentUser.firstName && currentUser.lastName) {
      setValue('fullName', `${currentUser.firstName} ${currentUser.lastName}`);
    }
    if (currentUser.email) {
      setValue('email', currentUser.email);
    }
    if (currentUser.phoneNumber) {
      setValue('phone', currentUser.phoneNumber);
    }
    
  }, [router, setValue]);
  
  useEffect(() => {
    // Redirect if cart is empty
    if (cart && cart.items.length === 0 && !isCartLoading) {
      toast.error('Your cart is empty');
      router.push('/marketplace');
    }
  }, [cart, isCartLoading, router]);
  
  const onSubmit = async (data: FormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Cannot place order with an empty cart');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would call an API to process the order
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock order success
      toast.success('Order placed successfully!');
      
      // Clear the cart
      await clearCart();
      
      // Redirect to confirmation page or order history
      router.push('/buyer-dashboard');
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isCartLoading) {
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
          <p className="mt-1 text-sm text-gray-500">You cannot proceed to checkout with an empty cart.</p>
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
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Cart
          </Link>
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="fullName"
                        {...register('fullName', { required: 'Full name is required' })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="address"
                        {...register('address', { required: 'Address is required' })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="city"
                        {...register('city', { required: 'City is required' })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        {...register('country', { required: 'Country is required' })}
                        className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Select Country</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Eswatini">Eswatini</option>
                      </select>
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 gap-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="credit_card"
                          type="radio"
                          value="credit_card"
                          {...register('paymentMethod', { required: 'Payment method is required' })}
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        />
                        <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700">
                          Credit Card
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="mobile_money"
                          type="radio"
                          value="mobile_money"
                          {...register('paymentMethod', { required: 'Payment method is required' })}
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        />
                        <label htmlFor="mobile_money" className="ml-3 block text-sm font-medium text-gray-700">
                          Mobile Money
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="cash_on_delivery"
                          type="radio"
                          value="cash_on_delivery"
                          {...register('paymentMethod', { required: 'Payment method is required' })}
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        />
                        <label htmlFor="cash_on_delivery" className="ml-3 block text-sm font-medium text-gray-700">
                          Cash on Delivery
                        </label>
                      </div>
                      
                      {errors.paymentMethod && (
                        <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
                      )}
                    </div>
                    
                    {/* Credit Card Fields */}
                    {selectedPaymentMethod === 'credit_card' && (
                      <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                            Card Number
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              {...register('cardNumber', { 
                                required: 'Card number is required',
                                pattern: {
                                  value: /^[0-9]{16}$/,
                                  message: 'Card number must be 16 digits'
                                }
                              })}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                            {errors.cardNumber && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                              Expiry Date
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="cardExpiry"
                                placeholder="MM/YY"
                                {...register('cardExpiry', { 
                                  required: 'Expiry date is required',
                                  pattern: {
                                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                                    message: 'Expiry date format should be MM/YY'
                                  }
                                })}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                              {errors.cardExpiry && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardExpiry.message}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">
                              CVC
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="cardCvc"
                                placeholder="123"
                                {...register('cardCvc', { 
                                  required: 'CVC is required',
                                  pattern: {
                                    value: /^[0-9]{3,4}$/,
                                    message: 'CVC must be 3 or 4 digits'
                                  }
                                })}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                              {errors.cardCvc && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardCvc.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Mobile Money Fields */}
                    {selectedPaymentMethod === 'mobile_money' && (
                      <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                        <div>
                          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                            Mobile Number
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="mobileNumber"
                              placeholder="+266 12345678"
                              {...register('mobileNumber', { 
                                required: 'Mobile number is required'
                              })}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                            {errors.mobileNumber && (
                              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="mobileProvider" className="block text-sm font-medium text-gray-700">
                            Mobile Money Provider
                          </label>
                          <div className="mt-1">
                            <select
                              id="mobileProvider"
                              {...register('mobileProvider', { required: 'Provider is required' })}
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="">Select Provider</option>
                              <option value="m_pesa">M-Pesa</option>
                              <option value="eco_cash">EcoCash</option>
                              <option value="orange_money">Orange Money</option>
                              <option value="airtel_money">Airtel Money</option>
                            </select>
                            {errors.mobileProvider && (
                              <p className="mt-1 text-sm text-red-600">{errors.mobileProvider.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flow-root">
                    <ul className="-my-4 divide-y divide-gray-200">
                      {cart.items.map((item) => (
                        <li key={item.productId} className="py-4 flex">
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {item.productName} 
                              <span className="text-gray-500 ml-1">x {item.quantity}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">
                              From: {item.farmerName}
                            </div>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 pb-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Subtotal</p>
                    <p className="font-medium text-gray-900">${cart.subtotal.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-3">
                    <p className="text-gray-500">Shipping</p>
                    <p className="font-medium text-gray-900">$5.00</p>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-3">
                    <p className="text-gray-500">Taxes</p>
                    <p className="font-medium text-gray-900">${(cart.subtotal * 0.15).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 pb-4">
                  <div className="flex justify-between text-base font-medium">
                    <p className="text-gray-900">Total</p>
                    <p className="text-gray-900">
                      ${(cart.subtotal + 5 + (cart.subtotal * 0.15)).toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 