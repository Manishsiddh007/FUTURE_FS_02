import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review } from '@/types/user';

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  getProductReviews: (productId: string) => Review[];
  getProductAverageRating: (productId: string) => number;
  markHelpful: (reviewId: string) => void;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    productId: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent sound quality and comfortable to wear for long periods. Highly recommended!',
    createdAt: new Date('2024-01-15'),
    helpful: 12
  },
  {
    id: '2',
    userId: '2',
    productId: '1',
    userName: 'Sarah Wilson',
    rating: 4,
    comment: 'Great headphones, but the price is a bit high. Overall satisfied with the purchase.',
    createdAt: new Date('2024-01-20'),
    helpful: 8
  },
  {
    id: '3',
    userId: '3',
    productId: '2',
    userName: 'Mike Johnson',
    rating: 5,
    comment: 'Amazing smartphone with incredible camera quality. Battery life is outstanding.',
    createdAt: new Date('2024-01-18'),
    helpful: 15
  },
  {
    id: '4',
    userId: '4',
    productId: '3',
    userName: 'Emily Davis',
    rating: 5,
    comment: 'Perfect laptop for work and gaming. Fast performance and sleek design.',
    createdAt: new Date('2024-01-22'),
    helpful: 10
  }
];

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: mockReviews,

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: Date.now().toString(),
          createdAt: new Date(),
          helpful: 0
        };
        set({ reviews: [...get().reviews, newReview] });
      },

      getProductReviews: (productId) => {
        return get().reviews.filter(review => review.productId === productId);
      },

      getProductAverageRating: (productId) => {
        const productReviews = get().reviews.filter(review => review.productId === productId);
        if (productReviews.length === 0) return 0;
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        return Math.round((totalRating / productReviews.length) * 10) / 10;
      },

      markHelpful: (reviewId) => {
        set({
          reviews: get().reviews.map(review =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          )
        });
      }
    }),
    {
      name: 'review-storage',
    }
  )
);