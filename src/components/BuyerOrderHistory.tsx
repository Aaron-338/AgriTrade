import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { authService } from '@/lib/services/authService';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  unit: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  farmerId: string;
  farmerName: string;
}

interface BuyerOrderHistoryProps {
  limit?: number;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: 'ord-001',
    date: '2023-10-15T10:30:00Z',
    status: 'delivered',
    items: [
      {
        id: 'item-001',
        productId: '1',
        productName: 'Fresh Tomatoes',
        productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
        quantity: 2,
        price: 2.99,
        unit: 'kg',
      },
      {
        id: 'item-002',
        productId: '2',
        productName: 'Organic Potatoes',
        productImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
        quantity: 3,
        price: 1.75,
        unit: 'kg',
      },
    ],
    totalAmount: 11.23,
    farmerId: 'f1',
    farmerName: 'John Farmer',
  },
  {
    id: 'ord-002',
    date: '2023-11-02T15:45:00Z',
    status: 'shipped',
    items: [
      {
        id: 'item-003',
        productId: '3',
        productName: 'Farm Fresh Eggs',
        productImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
        quantity: 2,
        price: 3.50,
        unit: 'dozen',
      },
    ],
    totalAmount: 7.00,
    farmerId: 'f3',
    farmerName: 'Michael Farms',
  },
  {
    id: 'ord-003',
    date: '2023-11-10T09:15:00Z',
    status: 'processing',
    items: [
      {
        id: 'item-004',
        productId: '5',
        productName: 'Local Honey',
        productImage: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        price: 8.99,
        unit: 'jar',
      },
      {
        id: 'item-005',
        productId: '6',
        productName: 'Fresh Apples',
        productImage: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80',
        quantity: 2,
        price: 3.25,
        unit: 'kg',
      },
    ],
    totalAmount: 15.49,
    farmerId: 'f4',
    farmerName: 'Bee Haven Farms',
  },
];

export default function BuyerOrderHistory({ limit }: BuyerOrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to get the user's orders
        // We're simulating a small delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Apply limit if provided
        const limitedOrders = limit ? mockOrders.slice(0, limit) : mockOrders;
        
        setOrders(limitedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [limit]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600 mb-4">You don't have any orders yet.</p>
        <Link
          href="/marketplace"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Orders</h3>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Order header */}
            <div className="bg-gray-50 px-4 py-3 border-b flex flex-wrap justify-between items-center">
              <div>
                <span className="font-medium text-gray-900">Order #{order.id}</span>
                <span className="ml-4 text-sm text-gray-600">
                  {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="ml-4 font-medium text-gray-900">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Order items */}
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2">Purchased from: {order.farmerName}</p>
              <div className="divide-y">
                {order.items.map(item => (
                  <div key={item.id} className="py-3 flex items-center">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × ${item.price.toFixed(2)}/{item.unit}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="font-medium text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order actions */}
            <div className="bg-gray-50 px-4 py-3 border-t flex justify-end space-x-3">
              <Link
                href={`/order/${order.id}`}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                View Details
              </Link>
              {order.status === 'delivered' && (
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Leave a Review
                </button>
              )}
              {(order.status === 'pending' || order.status === 'processing') && (
                <button
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {limit && orders.length > limit && (
        <div className="mt-6 text-center">
          <Link 
            href="/orders" 
            className="text-green-600 hover:text-green-800 font-medium"
          >
            View All Orders
          </Link>
        </div>
      )}
    </div>
  );
} 