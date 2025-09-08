import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { useReviewStore } from '@/store/reviewStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const { getProductReviews, getProductAverageRating, addReview, markHelpful } = useReviewStore();
  const { user, isAuthenticated } = useAuthStore();

  const reviews = getProductReviews(productId);
  const averageRating = getProductAverageRating(productId);

  const handleSubmitReview = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Login required',
        description: 'Please login to leave a review.',
        variant: 'destructive',
      });
      return;
    }

    if (rating === 0 || !comment.trim()) {
      toast({
        title: 'Incomplete review',
        description: 'Please provide both a rating and comment.',
        variant: 'destructive',
      });
      return;
    }

    addReview({
      userId: user.id,
      productId,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment: comment.trim(),
    });

    toast({
      title: 'Review submitted',
      description: 'Thank you for your feedback!',
    });

    setRating(0);
    setComment('');
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = interactive 
        ? starValue <= (hoveredRating || rating)
        : starValue <= rating;

      return (
        <Star
          key={index}
          className={`h-4 w-4 cursor-pointer transition-colors ${
            isFilled ? 'fill-warning text-warning' : 'text-muted-foreground'
          }`}
          onClick={() => interactive && onRate?.(starValue)}
          onMouseEnter={() => interactive && setHoveredRating(starValue)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
        />
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand" />
            Customer Reviews
          </div>
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Write Review
            </Button>
          )}
        </CardTitle>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="font-semibold">{averageRating}</span>
            </div>
            <span className="text-muted-foreground">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {showReviewForm && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Rating</label>
                <div className="flex items-center gap-1">
                  {renderStars(rating, true, setRating)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Your Review</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReview}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Submit Review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                      {review.userName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.userName}</p>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {review.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm mb-3">{review.comment}</p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markHelpful(review.id)}
                    className="text-xs h-auto p-1"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};