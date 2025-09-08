import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Filter, X, Star } from 'lucide-react';

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
}

interface AdvancedFiltersProps {
  categories: string[];
  maxPrice: number;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const AdvancedFilters = ({ 
  categories, 
  maxPrice, 
  filters, 
  onFiltersChange 
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]]
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating
    });
  };

  const handleStockFilterChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStockOnly: checked
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, maxPrice],
      minRating: 0,
      inStockOnly: false
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  const renderStars = (rating: number, interactive: boolean = true) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      const isActive = filters.minRating >= starValue;

      return (
        <Star
          key={index}
          className={`h-4 w-4 transition-colors ${
            interactive ? 'cursor-pointer' : ''
          } ${
            isFilled 
              ? isActive 
                ? 'fill-brand text-brand' 
                : 'fill-warning text-warning'
              : 'text-muted-foreground'
          }`}
          onClick={() => interactive && handleRatingChange(starValue)}
        />
      );
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-brand text-brand-foreground text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Refine your search with advanced filtering options
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label htmlFor={category} className="text-sm font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Price Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={maxPrice}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Rating */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Minimum Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[4, 3, 2, 1].map((rating) => (
                <div 
                  key={rating} 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleRatingChange(rating)}
                >
                  <Checkbox
                    checked={filters.minRating === rating}
                  />
                  <div className="flex items-center gap-1">
                    {renderStars(rating, false)}
                    <span className="text-sm ml-1">& Up</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStockOnly}
                  onCheckedChange={handleStockFilterChange}
                />
                <Label htmlFor="inStock" className="text-sm font-normal">
                  In Stock Only
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t pt-4">
          <Button 
            onClick={() => setIsOpen(false)} 
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};