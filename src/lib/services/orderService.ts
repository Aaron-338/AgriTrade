import { Product } from './productService';
import { User } from './authService';
import { CartItem } from './cartService';

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Order item
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  farmerId: string;
  farmerName: string;
}

// Order
export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

// Mock orders for development
let mockOrders: Order[] = [
  {
    id: 'ord-001',
    buyerId: 'u3',
    buyerName: 'Michael Buyer',
    items: [
      {
        productId: '1',
        productName: 'Fresh Tomatoes',
        price: 2.99,
        quantity: 5,
        subtotal: 14.95,
        farmerId: 'f1',
        farmerName: 'John Farmer'
      },
      {
        productId: '2',
        productName: 'Organic Potatoes',
        price: 1.75,
        quantity: 10,
        subtotal: 17.5,
        farmerId: 'f2',
        farmerName: 'Sarah Green'
      }
    ],
    status: OrderStatus.DELIVERED,
    totalAmount: 32.45,
    createdAt: '2023-06-01T10:30:00Z',
    updatedAt: '2023-06-05T14:20:00Z',
    shippingAddress: '123 Main St, Maseru',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    estimatedDelivery: '2023-06-05',
    trackingNumber: 'TRK12345',
    notes: 'Leave at the front door'
  },
  {
    id: 'ord-002',
    buyerId: 'u3',
    buyerName: 'Michael Buyer',
    items: [
      {
        productId: '3',
        productName: 'Farm Fresh Eggs',
        price: 3.50,
        quantity: 2,
        subtotal: 7.00,
        farmerId: 'f3',
        farmerName: 'Michael Farms'
      }
    ],
    status: OrderStatus.PROCESSING,
    totalAmount: 7.00,
    createdAt: '2023-06-12T09:15:00Z',
    updatedAt: '2023-06-12T09:30:00Z',
    shippingAddress: '123 Main St, Maseru',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'paid',
    estimatedDelivery: '2023-06-18'
  }
];

export const orderService = {
  // Create a new order from cart items
  createOrder: async (user: User, cartItems: CartItem[], shippingAddress: string, paymentMethod: string): Promise<Order> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) {
      throw new Error('User must be authenticated to place an order');
    }
    
    if (cartItems.length === 0) {
      throw new Error('Cannot create an order with an empty cart');
    }
    
    // Create order items from cart items
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      farmerId: item.farmerId,
      farmerName: item.farmerName
    }));
    
    // Calculate total amount
    const totalAmount = orderItems.reduce((total, item) => total + item.subtotal, 0);
    
    // Create new order
    const newOrder: Order = {
      id: `ord-${String(mockOrders.length + 1).padStart(3, '0')}`,
      buyerId: user.id,
      buyerName: `${user.firstName} ${user.lastName}`,
      items: orderItems,
      status: OrderStatus.PENDING,
      totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending'
    };
    
    // In a real app, you would save this to the database
    mockOrders.push(newOrder);
    
    return newOrder;
  },
  
  // Get orders for a specific user (buyer or farmer)
  getUserOrders: async (userId: string, userType: 'buyer' | 'farmer'): Promise<Order[]> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (userType === 'buyer') {
      // Return orders where the user is the buyer
      return mockOrders.filter(order => order.buyerId === userId);
    } else {
      // Return orders where any order item is from the farmer
      return mockOrders.filter(order => 
        order.items.some(item => item.farmerId === userId)
      );
    }
  },
  
  // Get a specific order by ID
  getOrderById: async (orderId: string): Promise<Order | null> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = mockOrders.find(order => order.id === orderId);
    return order || null;
  },
  
  // Update order status
  updateOrderStatus: async (orderId: string, status: OrderStatus, farmerId?: string): Promise<Order | null> => {
    // In a real app, this would be an API call with proper permissions
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }
    
    // If farmerId is provided, only allow updating items from that farmer
    if (farmerId) {
      const canUpdate = mockOrders[orderIndex].items.some(item => item.farmerId === farmerId);
      if (!canUpdate) {
        throw new Error('Unauthorized to update this order');
      }
    }
    
    // Update the order
    mockOrders[orderIndex].status = status;
    mockOrders[orderIndex].updatedAt = new Date().toISOString();
    
    return mockOrders[orderIndex];
  },
  
  // Get order count for tracking
  getOrderCounts: async (userId: string, userType: 'buyer' | 'farmer'): Promise<Record<OrderStatus, number>> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get user's orders
    const userOrders = await orderService.getUserOrders(userId, userType);
    
    // Initialize counts
    const counts: Record<OrderStatus, number> = {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.PROCESSING]: 0,
      [OrderStatus.SHIPPED]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.CANCELLED]: 0
    };
    
    // Count orders by status
    userOrders.forEach(order => {
      counts[order.status]++;
    });
    
    return counts;
  }
}; 