import { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { AdvancedFilters, FilterOptions } from './AdvancedFilters';
import { Product } from '@/types/product';
import { useReviewStore } from '@/store/reviewStore';

interface ProductListingProps {
  products: Product[];
  searchQuery: string;
}

export const ProductListing = ({ products, searchQuery }: ProductListingProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, Math.max(...products.map(p => p.price))],
    minRating: 0,
    inStockOnly: false
  });

  const { getProductAverageRating } = useReviewStore();

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category (basic filter)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply advanced filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category));
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(product => {
        const avgRating = getProductAverageRating(product.id);
        const rating = avgRating > 0 ? avgRating : product.rating;
        return rating >= filters.minRating;
      });
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          const ratingA = getProductAverageRating(a.id) || a.rating;
          const ratingB = getProductAverageRating(b.id) || b.rating;
          return ratingB - ratingA;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [products, searchQuery, selectedCategory, sortBy, filters, maxPrice, getProductAverageRating]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Our Products
        </h2>
        <p className="text-muted-foreground">
          Discover our amazing collection of premium tech products
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <ProductFilters
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            categories={categories}
          />
        </div>
        <AdvancedFilters
          categories={categories}
          maxPrice={maxPrice}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">No products found</p>
          <p className="text-muted-foreground">
            {searchQuery.trim() 
              ? `Try adjusting your search for "${searchQuery}"`
              : 'Try selecting a different category'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {filteredAndSortedProducts.length > 0 && (
        <div className="text-center mt-8 text-muted-foreground">
          Showing {filteredAndSortedProducts.length} of {products.length} products
        </div>
      )}
    </div>
  );
};