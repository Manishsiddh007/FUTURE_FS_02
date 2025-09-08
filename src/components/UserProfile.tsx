import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle,
  Star 
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useReviewStore } from '@/store/reviewStore';
import { products } from '@/data/products';

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
}

export const UserProfile = ({ open, onClose }: UserProfileProps) => {
  const { user, orders, wishlist, logout, isInWishlist, removeFromWishlist } = useAuthStore();
  const { getProductReviews } = useReviewStore();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'processing':
        return <Package className="h-4 w-4 text-brand" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-brand" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'processing':
        return 'bg-brand text-brand-foreground';
      case 'shipped':
        return 'bg-brand text-brand-foreground';
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const wishlistProducts = products.filter(product => 
    isInWishlist(product.id)
  );

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-brand" />
            My Account
          </SheetTitle>
          <SheetDescription>
            Manage your profile, orders, and preferences
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1">
                Member since {user.createdAt.toLocaleDateString()}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Wishlist ({wishlistProducts.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <p className="text-sm text-muted-foreground">When you place orders, they'll appear here</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Order #{order.id}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Placed on {order.createdAt.toLocaleDateString()}
                        {order.trackingNumber && (
                          <span className="block">Tracking: {order.trackingNumber}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="h-10 w-10 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-brand">${order.total.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-4">
              {wishlistProducts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your wishlist is empty</p>
                    <p className="text-sm text-muted-foreground">Add products you love to save for later</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {wishlistProducts.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-muted-foreground text-sm">{product.category}</p>
                          <p className="text-brand font-semibold text-lg">${product.price.toFixed(2)}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromWishlist(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardContent className="text-center py-8">
                  <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews yet</p>
                  <p className="text-sm text-muted-foreground">Leave reviews for products you've purchased</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};