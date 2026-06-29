'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '@/lib/services/authService';
import { productCategories } from '@/lib/services/productService';

// Product schema validation
const productSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  unit: Yup.string()
    .required('Unit is required'),
  quantity: Yup.number()
    .integer('Quantity must be a whole number')
    .positive('Quantity must be positive')
    .required('Quantity is required'),
  category: Yup.string()
    .required('Category is required')
    .oneOf(productCategories.filter(c => c !== 'All'), 'Please select a valid category'),
  image: Yup.mixed()
    .nullable()
});

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Common units for agricultural products
  const unitOptions = ['kg', 'g', 'lb', 'piece', 'bunch', 'dozen', 'liter', 'ml', 'jar', 'box'];
  
  // Check authentication and redirect if not a farmer
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      const user = authService.getCurrentUser();
      
      if (!user || user.userType !== 'farmer') {
        router.push('/unauthorized');
        return;
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      quantity: '',
      category: '',
      image: null
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError(null);
        
        // This would be an API call to save product in production
        // For now, just simulate a network request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate success
        router.push('/my-products?added=true');
      } catch (err: any) {
        console.error('Error adding product:', err);
        setError(err.message || 'Failed to add product. Please try again later.');
        setSubmitting(false);
      }
    },
  });

  // Helper function to check if a field has an error
  const hasError = (fieldName: string) => {
    return formik.touched[fieldName as keyof typeof formik.touched] && 
           Boolean(formik.errors[fieldName as keyof typeof formik.errors]);
  };
  
  // Helper function to get error message for a field
  const getErrorMessage = (fieldName: string) => {
    return hasError(fieldName) ? formik.errors[fieldName as keyof typeof formik.errors] : '';
  };
  
  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    formik.setFieldValue('image', file);
    
    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
          <p className="text-gray-600">List your agricultural products on the marketplace</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Fresh Tomatoes"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded ${
                hasError('name') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {hasError('name') && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage('name')}</p>
            )}
          </div>
          
          {/* Product Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe your product, including quality, farming methods, etc."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded ${
                hasError('description') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {hasError('description') && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage('description')}</p>
            )}
          </div>
          
          {/* Price and Unit */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                Price per Unit *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-8 p-2 border rounded ${
                    hasError('price') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {hasError('price') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('price')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-gray-700 text-sm font-bold mb-2">
                Unit *
              </label>
              <select
                id="unit"
                name="unit"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 border rounded ${
                  hasError('unit') ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {unitOptions.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {hasError('unit') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('unit')}</p>
              )}
            </div>
          </div>
          
          {/* Quantity and Category */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
                Available Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 border rounded ${
                  hasError('quantity') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {hasError('quantity') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('quantity')}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 border rounded ${
                  hasError('category') ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="" disabled>Select a category</option>
                {productCategories.filter(c => c !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {hasError('category') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('category')}</p>
              )}
            </div>
          </div>
          
          {/* Product Image */}
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              Product Image
            </label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </span>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Upload a clear image of your product for better visibility in the marketplace.
            </p>
          </div>
          
          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-4">
            <Link 
              href="/my-products" 
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 