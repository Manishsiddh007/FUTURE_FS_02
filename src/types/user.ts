export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    currency: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
}

export interface Wishlist {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
}