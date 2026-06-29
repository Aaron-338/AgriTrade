// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'farmer' | 'buyer';
  location?: string;
  phone: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'farmer' | 'buyer';
  location?: string;
  phoneNumber: string;
  phone: string;
  createdAt: string;
}

// Auth token key in localStorage
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

// Mock user data for development
const mockUsers: User[] = [
  {
    id: 'u1',
    firstName: 'John',
    lastName: 'Farmer',
    email: 'john@example.com',
    userType: 'farmer',
    location: 'Roma, Lesotho',
    phoneNumber: '+26658552233',
    phone: '+26658552233',
    createdAt: '2023-01-15T08:30:00Z',
  },
  {
    id: 'u2',
    firstName: 'Sarah',
    lastName: 'Green',
    email: 'sarah@example.com',
    userType: 'farmer',
    location: 'Mohale\'s Hoek, Lesotho',
    phoneNumber: '+26658559876',
    phone: '+26658559876',
    createdAt: '2023-02-20T10:15:00Z',
  },
  {
    id: 'u3',
    firstName: 'Michael',
    lastName: 'Buyer',
    email: 'michael@example.com',
    userType: 'buyer',
    phoneNumber: '+26658551234',
    phone: '+26658551234',
    createdAt: '2023-03-10T14:45:00Z',
  },
  {
    id: 'u4',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    userType: 'buyer',
    phoneNumber: '+26658551111',
    phone: '+26658551111',
    createdAt: '2023-05-15T09:30:00Z',
  }
];

// Authentication service
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<User> => {
    // In a real application, this would be an API call to authenticate the user
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate login verification
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // In a real app, you'd check the password hash here
    
    // Store authentication state
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, 'fake-auth-token-' + Date.now());
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    }
    
    return user;
  },
  
  // Register user
  register: async (userData: RegisterData): Promise<User> => {
    // In a real application, this would be an API call to register the user
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user with this email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      userType: userData.userType,
      location: userData.location,
      phoneNumber: userData.phone,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
    };
    
    // In a production app, you'd store this in the database
    mockUsers.push(newUser);
    
    return newUser;
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    // In a real application, you might call an API endpoint to invalidate tokens
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear authentication state
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    }
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      // First check if user is authenticated
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        return null;
      }
      
      // Then try to get user data
      const userJson = localStorage.getItem(USER_DATA_KEY);
      if (userJson) {
        try {
          return JSON.parse(userJson) as User;
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clean up corrupted data
          localStorage.removeItem(USER_DATA_KEY);
        }
      }
      
      // If we have a token but no valid user data, we should clean up
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    return null;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
    }
    return false;
  },
}; 