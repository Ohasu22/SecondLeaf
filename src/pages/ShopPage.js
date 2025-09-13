import { useState, useMemo } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import FilterSidebar from "../components/FilterSidebar";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Mock data for demonstration - todo: remove mock functionality
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 12 Pro',
    description: 'Excellent condition iPhone 12 Pro, barely used. All accessories included.',
    price: 41000,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300',
    condition: 4,
    yearsUsed: 2,
    category: 'Electronics',
    sellerRating: 4.8,
    co2Saved: 70,
    damaged: false
  },
  {
    id: '2',
    name: 'Vintage Leather Armchair',
    description: 'Beautiful vintage leather armchair, some wear but very comfortable.',
    price: 20500,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
    condition: 3,
    yearsUsed: 15,
    category: 'Furniture',
    sellerRating: 4.2,
    co2Saved: 120,
    damaged: false
  },
  {
    id: '3',
    name: 'MacBook Air M1',
    description: 'Great condition MacBook Air with M1 chip. Perfect for students or professionals.',
    price: 66000,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300',
    condition: 4,
    yearsUsed: 1,
    category: 'Electronics',
    sellerRating: 4.9,
    co2Saved: 200,
    damaged: false
  },
  {
    id: '4',
    name: 'Designer Winter Coat',
    description: 'High-quality winter coat, barely worn. Originally ₹25,000.',
    price: 9900,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300',
    condition: 5,
    yearsUsed: 1,
    category: 'Clothing',
    sellerRating: 4.7,
    co2Saved: 15,
    damaged: false
  },
  {
    id: '5',
    name: 'Road Bicycle',
    description: 'Well-maintained road bike, perfect for commuting or weekend rides.',
    price: 15600,
    image: 'https://images.unsplash.com/photo-1558618047-fcd5c3d9b9f5?w=300',
    condition: 3,
    yearsUsed: 3,
    category: 'Sports',
    sellerRating: 4.3,
    co2Saved: 85,
    damaged: false
  },
  {
    id: '6',
    name: 'Coffee Table Books Collection',
    description: 'Beautiful collection of photography and art books.',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
    condition: 4,
    yearsUsed: 2,
    category: 'Books',
    sellerRating: 4.6,
    co2Saved: 12,
    damaged: false
  },
  {
    id: '7',
    name: 'Yoga Mat & Accessories',
    description: 'Premium yoga mat with blocks and straps. Lightly used.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300',
    condition: 4,
    yearsUsed: 1,
    category: 'Sports',
    sellerRating: 4.5,
    co2Saved: 8,
    damaged: false
  },
  {
    id: '8',
    name: 'Vintage Camera',
    description: 'Classic film camera in working condition. Great for photography enthusiasts.',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300',
    condition: 3,
    yearsUsed: 20,
    category: 'Electronics',
    sellerRating: 4.1,
    co2Saved: 45,
    damaged: false
  }
];

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    maxPrice: "",
    minCondition: 1,
    maxYearsUsed: ""
  });

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesPrice = !filters.maxPrice || product.price <= parseInt(filters.maxPrice);
      const matchesCondition = product.condition >= filters.minCondition;
      const matchesAge = !filters.maxYearsUsed || product.yearsUsed <= parseInt(filters.maxYearsUsed);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesCondition && matchesAge;
    });
  }, [searchTerm, filters]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleBuyClick = (product) => {
    console.log('Request item:', product);
    // todo: Implement actual request functionality
    setIsModalOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      maxPrice: "",
      minCondition: 1,
      maxYearsUsed: ""
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'minCondition') return value > 1;
    return value !== "";
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-shop">
            Discover Second-Hand Treasures
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find quality pre-owned items at great prices while reducing your environmental impact.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          
          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
            data-testid="button-filter-toggle"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, category: "" }))}
                />
              </Badge>
            )}
            {filters.maxPrice && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max Price: ₹{filters.maxPrice}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, maxPrice: "" }))}
                />
              </Badge>
            )}
            {filters.minCondition > 1 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min Condition: {filters.minCondition}/5
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, minCondition: 1 }))}
                />
              </Badge>
            )}
            {filters.maxYearsUsed && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max Age: {filters.maxYearsUsed} years
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, maxYearsUsed: "" }))}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-clear-filters"
            >
              Clear all
            </Button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          {isFilterOpen && (
            <div className="w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground" data-testid="text-results-count">
                {filteredProducts.length} products found
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">No products found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your search terms or filters</p>
                <Button onClick={clearFilters} data-testid="button-clear-filters-empty">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                    onBuy={handleBuyClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBuy={handleBuyClick}
      />
    </div>
  );
}