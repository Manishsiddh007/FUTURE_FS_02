import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductListing } from '@/components/ProductListing';
import { ShoppingCart } from '@/components/ShoppingCart';
import { Checkout } from '@/components/Checkout';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { UserProfile } from '@/components/UserProfile';
import { products } from '@/data/products';

type View = 'products' | 'checkout';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<View>('products');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleBackToProducts = () => {
    setCurrentView('products');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoginClick={() => setShowLoginDialog(true)}
        onProfileClick={() => setShowUserProfile(true)}
      />
      
      {currentView === 'products' ? (
        <ProductListing
          products={products}
          searchQuery={searchQuery}
        />
      ) : (
        <Checkout onBack={handleBackToProducts} />
      )}

      <ShoppingCart onCheckout={handleCheckout} />
      
      <LoginDialog 
        open={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)} 
      />
      
      <UserProfile 
        open={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
    </div>
  );
};

export default Index;
