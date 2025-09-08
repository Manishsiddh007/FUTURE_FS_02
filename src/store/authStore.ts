import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Order, Wishlist } from '@/types/user';

interface AuthStore {
  user: User | null;
  orders: Order[];
  wishlist: Wishlist | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

// Mock users for demo
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date(),
    preferences: {
      theme: 'light',
      notifications: true,
      currency: 'USD'
    }
  }
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      wishlist: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true,
            wishlist: {
              id: '1',
              userId: user.id,
              productIds: [],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          return true;
        }
        return false;
      },

      register: async (userData) => {
        // Mock registration
        const newUser: User = {
          id: Date.now().toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          createdAt: new Date(),
          preferences: {
            theme: 'light',
            notifications: true,
            currency: 'USD'
          }
        };
        
        mockUsers.push({ ...newUser, password: userData.password });
        set({ 
          user: newUser, 
          isAuthenticated: true,
          wishlist: {
            id: Date.now().toString(),
            userId: newUser.id,
            productIds: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, orders: [], wishlist: null });
      },

      updateProfile: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          trackingNumber: `FS02${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };
        set({ orders: [newOrder, ...get().orders] });
      },

      addToWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (wishlist && !wishlist.productIds.includes(productId)) {
          set({
            wishlist: {
              ...wishlist,
              productIds: [...wishlist.productIds, productId],
              updatedAt: new Date()
            }
          });
        }
      },

      removeFromWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (wishlist) {
          set({
            wishlist: {
              ...wishlist,
              productIds: wishlist.productIds.filter(id => id !== productId),
              updatedAt: new Date()
            }
          });
        }
      },

      isInWishlist: (productId) => {
        const wishlist = get().wishlist;
        return wishlist ? wishlist.productIds.includes(productId) : false;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);