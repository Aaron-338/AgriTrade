import { authService } from './authService';

// Cart item with quantity
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  farmerId: string;
  farmerName: string;
  availableQuantity: number;
  imageUrl?: string;
}

// Cart interface
export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// Local storage key for cart
const CART_STORAGE_KEY = 'agritrade_cart';

// Initialize an empty cart structure
const emptyCart: Cart = {
  items: [],
  totalItems: 0,
  subtotal: 0
};

/**
 * Helper function to calculate cart totals
 */
const calculateCartTotals = (items: CartItem[]): Cart => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return {
    items,
    totalItems,
    subtotal
  };
};

/**
 * Helper function to retrieve cart from localStorage
 */
const getStoredCart = (): Cart => {
  if (typeof window === 'undefined') {
    return emptyCart;
  }
  
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) {
    return emptyCart;
  }
  
  try {
    return JSON.parse(storedCart);
  } catch (error) {
    console.error('Failed to parse stored cart:', error);
    return emptyCart;
  }
};

/**
 * Helper function to save cart to localStorage
 */
const saveCartToStorage = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

/**
 * Cart Service Implementation
 */
export const cartService = {
  /**
   * Get the current user's cart
   */
  getCart: async (): Promise<Cart> => {
    // Simulating an API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const cart = getStoredCart();
        resolve(cart);
      }, 300);
    });
  },
  
  /**
   * Add an item to the cart
   */
  addToCart: async (item: CartItem): Promise<Cart> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Check if user is authenticated for certain operations
          const currentUser = authService.getCurrentUser();
          
          // Get the current cart
          const cart = getStoredCart();
          
          // Check if product already exists in cart
          const existingItemIndex = cart.items.findIndex(
            cartItem => cartItem.productId === item.productId
          );
          
          if (existingItemIndex !== -1) {
            // Update existing item
            const updatedItems = [...cart.items];
            const newQuantity = updatedItems[existingItemIndex].quantity + item.quantity;
            
            // Check if new quantity exceeds available quantity
            if (newQuantity > item.availableQuantity) {
              reject(new Error(`Cannot add more than ${item.availableQuantity} units of this product`));
              return;
            }
            
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: newQuantity
            };
            
            const updatedCart = calculateCartTotals(updatedItems);
            saveCartToStorage(updatedCart);
            resolve(updatedCart);
          } else {
            // Add new item
            if (item.quantity > item.availableQuantity) {
              reject(new Error(`Cannot add more than ${item.availableQuantity} units of this product`));
              return;
            }
            
            const updatedItems = [...cart.items, item];
            const updatedCart = calculateCartTotals(updatedItems);
            saveCartToStorage(updatedCart);
            resolve(updatedCart);
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          reject(new Error('Failed to add item to cart'));
        }
      }, 300);
    });
  },
  
  /**
   * Remove an item from the cart
   */
  removeFromCart: async (productId: string): Promise<Cart> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const cart = getStoredCart();
          const updatedItems = cart.items.filter(item => item.productId !== productId);
          const updatedCart = calculateCartTotals(updatedItems);
          saveCartToStorage(updatedCart);
          resolve(updatedCart);
        } catch (error) {
          console.error('Error removing from cart:', error);
          reject(new Error('Failed to remove item from cart'));
        }
      }, 300);
    });
  },
  
  /**
   * Update quantity of an item in the cart
   */
  updateQuantity: async (productId: string, quantity: number): Promise<Cart> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const cart = getStoredCart();
          const itemIndex = cart.items.findIndex(item => item.productId === productId);
          
          if (itemIndex === -1) {
            reject(new Error('Item not found in cart'));
            return;
          }
          
          // Check if the new quantity exceeds available quantity
          if (quantity > cart.items[itemIndex].availableQuantity) {
            reject(new Error(`Cannot add more than ${cart.items[itemIndex].availableQuantity} units of this product`));
            return;
          }
          
          // Check if quantity is zero or negative
          if (quantity <= 0) {
            // Remove the item from cart
            return cartService.removeFromCart(productId).then(resolve).catch(reject);
          }
          
          // Update quantity
          const updatedItems = [...cart.items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity
          };
          
          const updatedCart = calculateCartTotals(updatedItems);
          saveCartToStorage(updatedCart);
          resolve(updatedCart);
        } catch (error) {
          console.error('Error updating cart quantity:', error);
          reject(new Error('Failed to update quantity'));
        }
      }, 300);
    });
  },
  
  /**
   * Clear all items from the cart
   */
  clearCart: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveCartToStorage(emptyCart);
        resolve();
      }, 300);
    });
  }
}; 