import { User } from './authService';

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

// Conversation interface
export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    userType: 'farmer' | 'buyer';
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Mock conversations for development
const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participants: [
      {
        id: 'u3',
        name: 'Michael Buyer',
        userType: 'buyer'
      },
      {
        id: 'f1',
        name: 'John Farmer',
        userType: 'farmer'
      }
    ],
    unreadCount: 2,
    createdAt: '2023-06-10T09:30:00Z',
    updatedAt: '2023-06-11T14:45:00Z'
  },
  {
    id: 'conv-002',
    participants: [
      {
        id: 'u3',
        name: 'Michael Buyer',
        userType: 'buyer'
      },
      {
        id: 'f2',
        name: 'Sarah Green',
        userType: 'farmer'
      }
    ],
    unreadCount: 0,
    createdAt: '2023-06-05T11:20:00Z',
    updatedAt: '2023-06-05T16:30:00Z'
  }
];

// Mock messages for development
const mockMessages: Message[] = [
  // Conversation 1
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'u3',
    senderName: 'Michael Buyer',
    receiverId: 'f1',
    receiverName: 'John Farmer',
    content: 'Hello, I\'m interested in your fresh tomatoes. Are they still available?',
    createdAt: '2023-06-10T09:30:00Z',
    isRead: true
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'f1',
    senderName: 'John Farmer',
    receiverId: 'u3',
    receiverName: 'Michael Buyer',
    content: 'Yes, they are still available. How many kg would you like to order?',
    createdAt: '2023-06-10T10:15:00Z',
    isRead: true
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderId: 'u3',
    senderName: 'Michael Buyer',
    receiverId: 'f1',
    receiverName: 'John Farmer',
    content: 'I would like to order 5kg. Can you deliver to Maseru?',
    createdAt: '2023-06-10T10:30:00Z',
    isRead: true
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    senderId: 'f1',
    senderName: 'John Farmer',
    receiverId: 'u3',
    receiverName: 'Michael Buyer',
    content: 'Yes, I can deliver to Maseru. There will be a small delivery fee of $2.',
    createdAt: '2023-06-11T14:30:00Z',
    isRead: false
  },
  {
    id: 'msg-005',
    conversationId: 'conv-001',
    senderId: 'f1',
    senderName: 'John Farmer',
    receiverId: 'u3',
    receiverName: 'Michael Buyer',
    content: 'Would you like to proceed with the order?',
    createdAt: '2023-06-11T14:45:00Z',
    isRead: false
  },
  
  // Conversation 2
  {
    id: 'msg-006',
    conversationId: 'conv-002',
    senderId: 'u3',
    senderName: 'Michael Buyer',
    receiverId: 'f2',
    receiverName: 'Sarah Green',
    content: 'Hi Sarah, do you have organic apples available?',
    createdAt: '2023-06-05T11:20:00Z',
    isRead: true
  },
  {
    id: 'msg-007',
    conversationId: 'conv-002',
    senderId: 'f2',
    senderName: 'Sarah Green',
    receiverId: 'u3',
    receiverName: 'Michael Buyer',
    content: 'Hello Michael, I don\'t have apples currently, but I have fresh organic potatoes and spinach available.',
    createdAt: '2023-06-05T11:45:00Z',
    isRead: true
  },
  {
    id: 'msg-008',
    conversationId: 'conv-002',
    senderId: 'u3',
    senderName: 'Michael Buyer',
    receiverId: 'f2',
    receiverName: 'Sarah Green',
    content: 'Great, I\'ll check out your products in the marketplace. Thank you!',
    createdAt: '2023-06-05T12:10:00Z',
    isRead: true
  },
  {
    id: 'msg-009',
    conversationId: 'conv-002',
    senderId: 'f2',
    senderName: 'Sarah Green',
    receiverId: 'u3',
    receiverName: 'Michael Buyer',
    content: 'You\'re welcome! Let me know if you have any questions.',
    createdAt: '2023-06-05T16:30:00Z',
    isRead: true
  }
];

export const messageService = {
  // Get all conversations for a user
  getUserConversations: async (userId: string): Promise<Conversation[]> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find conversations where the user is a participant
    const userConversations = mockConversations.filter(
      conv => conv.participants.some(p => p.id === userId)
    );
    
    // Add last message to each conversation
    return userConversations.map(conv => {
      const messages = mockMessages.filter(msg => msg.conversationId === conv.id);
      const lastMessage = messages.length > 0 
        ? messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : undefined;
      
      // Count unread messages for this user
      const unreadCount = messages.filter(
        msg => msg.receiverId === userId && !msg.isRead
      ).length;
      
      return {
        ...conv,
        lastMessage,
        unreadCount
      };
    });
  },
  
  // Get conversation messages
  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get messages for the conversation
    const messages = mockMessages.filter(msg => msg.conversationId === conversationId);
    
    // Sort by creation date
    return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
  
  // Start a new conversation
  startConversation: async (user: User, recipientId: string, recipientName: string, recipientType: 'farmer' | 'buyer', initialMessage: string): Promise<Conversation> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if conversation already exists
    const existingConversation = mockConversations.find(
      conv => conv.participants.some(p => p.id === user.id) && 
             conv.participants.some(p => p.id === recipientId)
    );
    
    if (existingConversation) {
      // If the conversation exists, add a message to it
      const newMessage: Message = {
        id: `msg-${mockMessages.length + 1}`,
        conversationId: existingConversation.id,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`,
        receiverId: recipientId,
        receiverName: recipientName,
        content: initialMessage,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      mockMessages.push(newMessage);
      
      // Update conversation's last updated time
      const convIndex = mockConversations.findIndex(c => c.id === existingConversation.id);
      mockConversations[convIndex].updatedAt = new Date().toISOString();
      mockConversations[convIndex].unreadCount += 1;
      
      return {
        ...mockConversations[convIndex],
        lastMessage: newMessage,
        unreadCount: mockConversations[convIndex].unreadCount
      };
    }
    
    // Create a new conversation
    const newConversation: Conversation = {
      id: `conv-${String(mockConversations.length + 1).padStart(3, '0')}`,
      participants: [
        {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          userType: user.userType
        },
        {
          id: recipientId,
          name: recipientName,
          userType: recipientType
        }
      ],
      unreadCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create the first message
    const newMessage: Message = {
      id: `msg-${String(mockMessages.length + 1).padStart(3, '0')}`,
      conversationId: newConversation.id,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      receiverId: recipientId,
      receiverName: recipientName,
      content: initialMessage,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    // Add conversation and message to the mocks
    mockConversations.push(newConversation);
    mockMessages.push(newMessage);
    
    return {
      ...newConversation,
      lastMessage: newMessage
    };
  },
  
  // Send message to an existing conversation
  sendMessage: async (conversationId: string, senderId: string, senderName: string, receiverId: string, receiverName: string, content: string): Promise<Message> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if conversation exists
    const conversation = mockConversations.find(conv => conv.id === conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${String(mockMessages.length + 1).padStart(3, '0')}`,
      conversationId,
      senderId,
      senderName,
      receiverId,
      receiverName,
      content,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    // Add message to mock data
    mockMessages.push(newMessage);
    
    // Update conversation's last updated time
    const convIndex = mockConversations.findIndex(c => c.id === conversationId);
    mockConversations[convIndex].updatedAt = new Date().toISOString();
    mockConversations[convIndex].unreadCount += 1;
    
    return newMessage;
  },
  
  // Mark messages as read
  markMessagesAsRead: async (conversationId: string, userId: string): Promise<number> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Find all unread messages sent to the user in this conversation
    const unreadMessages = mockMessages.filter(
      msg => msg.conversationId === conversationId && 
             msg.receiverId === userId && 
             !msg.isRead
    );
    
    // Mark messages as read
    unreadMessages.forEach(msg => {
      const msgIndex = mockMessages.findIndex(m => m.id === msg.id);
      if (msgIndex !== -1) {
        mockMessages[msgIndex].isRead = true;
      }
    });
    
    // Update conversation unread count
    const convIndex = mockConversations.findIndex(c => c.id === conversationId);
    if (convIndex !== -1) {
      mockConversations[convIndex].unreadCount = 0;
    }
    
    return unreadMessages.length;
  },
  
  // Get total unread message count for a user
  getUnreadMessageCount: async (userId: string): Promise<number> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Count all unread messages sent to the user
    return mockMessages.filter(
      msg => msg.receiverId === userId && !msg.isRead
    ).length;
  }
}; 