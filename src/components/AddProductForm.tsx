import { useState, useEffect } from 'react';
import Image from 'next/image';
import { productService, productCategories } from '@/lib/services/productService';
import { unsplashService } from '@/lib/services/unsplashService';
import { authService } from '@/lib/services/authService';

interface AddProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddProductForm({ onSuccess, onCancel }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '1',
    unit: 'kg',
    category: 'Vegetables',
    isOrganic: false,
  });

  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update preview image when name or category changes
  useEffect(() => {
    if (formData.name.trim().length > 2) {
      const imageUrl = unsplashService.getProductImageUrl(formData.name, formData.category);
      setPreviewImage(imageUrl);
    }
  }, [formData.name, formData.category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const user = authService.getCurrentUser();
      
      if (!user) {
        throw new Error('You must be logged in to add a product');
      }
      
      // Create farmer object
      const farmer = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        location: user.location || 'Unknown',
        rating: 4.5,
      };
      
      // Create product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        unit: formData.unit,
        quantity: parseInt(formData.quantity, 10),
        image: previewImage,
        farmer: farmer,
        category: formData.category,
      };

      // Create the product using the service
      const newProduct = await productService.createProduct(productData);
      
      setSuccessMessage('Product added successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '1',
        unit: 'kg',
        category: 'Vegetables',
        isOrganic: false,
      });
      
      setPreviewImage('');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Add New Product</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Fresh Organic Tomatoes"
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {productCategories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Price and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unit *
                </label>
                <select
                  id="unit"
                  name="unit"
                  required
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="l">Liter (l)</option>
                  <option value="pc">Piece (pc)</option>
                  <option value="dz">Dozen (dz)</option>
                  <option value="bn">Bunch (bn)</option>
                  <option value="cr">Crate (cr)</option>
                  <option value="bg">Bag (bg)</option>
                </select>
              </div>
            </div>
            
            {/* Quantity and Organic */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity Available *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex items-end">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 h-5 w-5"
                  />
                  <span className="ml-2 text-sm text-gray-700">Organic Product</span>
                </label>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Describe your product's quality, size, origin, etc."
              />
            </div>
          </div>
          
          {/* Right Column - Image Preview */}
          <div>
            <div className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Product Image Preview
              </span>
              <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-100 w-full aspect-square relative">
                {previewImage ? (
                  <Image 
                    src={previewImage} 
                    alt="Product preview" 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Enter product name to see preview</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Images are automatically selected based on product name and category
              </p>
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="mt-8 flex justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
} 