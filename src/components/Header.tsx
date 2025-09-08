import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingBag, Store } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-brand" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            TechStore
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Cart Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={toggleCart}
          className="relative hover:bg-brand hover:text-brand-foreground transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-brand text-brand-foreground text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
};