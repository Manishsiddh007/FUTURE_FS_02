import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface CheckoutProps {
  onBack: () => void;
}

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export const Checkout = ({ onBack }: CheckoutProps) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

  const totalPrice = getTotalPrice();
  const shipping = 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Order placed successfully!",
      description: `Your order #${Math.random().toString(36).substr(2, 9).toUpperCase()} has been confirmed.`,
    });
    
    clearCart();
    setIsProcessing(false);
    onBack();
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Your cart is empty. Add some products to checkout.</p>
            <Button onClick={onBack} className="mt-4">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-brand/10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shopping
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    {...register('firstName', { required: 'First name is required' })}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    {...register('lastName', { required: 'Last name is required' })}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input 
                  {...register('address', { required: 'Address is required' })}
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    {...register('city', { required: 'City is required' })}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input 
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    className={errors.zipCode ? 'border-destructive' : ''}
                  />
                  {errors.zipCode && (
                    <p className="text-destructive text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand" />
                Payment Information
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                Your payment information is secure and encrypted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  placeholder="1234 5678 9012 3456"
                  {...register('cardNumber', { required: 'Card number is required' })}
                  className={errors.cardNumber ? 'border-destructive' : ''}
                />
                {errors.cardNumber && (
                  <p className="text-destructive text-sm mt-1">{errors.cardNumber.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    placeholder="MM/YY"
                    {...register('expiryDate', { required: 'Expiry date is required' })}
                    className={errors.expiryDate ? 'border-destructive' : ''}
                  />
                  {errors.expiryDate && (
                    <p className="text-destructive text-sm mt-1">{errors.expiryDate.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    placeholder="123"
                    {...register('cvv', { required: 'CVV is required' })}
                    className={errors.cvv ? 'border-destructive' : ''}
                  />
                  {errors.cvv && (
                    <p className="text-destructive text-sm mt-1">{errors.cvv.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-12 w-12 rounded object-cover bg-muted"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-brand">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={handleSubmit(onSubmit)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};