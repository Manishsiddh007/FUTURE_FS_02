import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductListing } from '@/components/ProductListing';
import { ShoppingCart } from '@/components/ShoppingCart';
import { Checkout } from '@/components/Checkout';
import { products } from '@/data/products';

type View = 'products' | 'checkout';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<View>('products');

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
    </div>
  );
};

export default Index;
