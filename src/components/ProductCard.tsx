import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useReviewStore } from '@/store/reviewStore';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, addToWishlist, removeFromWishlist, isInWishlist } = useAuthStore();
  const { getProductAverageRating, getProductReviews } = useReviewStore();

  const averageRating = getProductAverageRating(product.id);
  const reviewCount = getProductReviews(product.id).length;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-brand hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gradient-subtle">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge 
          className="absolute top-3 left-3 bg-brand text-brand-foreground"
          variant="secondary"
        >
          {product.category}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm ${
            isWishlisted ? 'text-red-500' : 'text-muted-foreground'
          } hover:text-red-500 transition-colors`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
        {!product.inStock && (
          <Badge 
            className="absolute bottom-3 right-3 bg-destructive text-destructive-foreground"
            variant="destructive"
          >
            Out of Stock
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="text-sm font-medium">
            {averageRating > 0 ? averageRating : product.rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({reviewCount > 0 ? `${reviewCount} reviews` : '4.2k reviews'})
          </span>
        </div>
        
        <div className="text-2xl font-bold text-brand">
          ${product.price.toFixed(2)}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};