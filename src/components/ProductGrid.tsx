
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/products";
import ProductCard from "./ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  featured: boolean;
}

interface ProductGridProps {
  initialCategory?: string;
  searchQuery?: string;
}

export default function ProductGrid({ initialCategory, searchQuery }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All Categories");
  const [sortBy, setSortBy] = useState("featured");
  const location = useLocation();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, sortBy],
    queryFn: async () => {
      try {
        console.log("Fetching products for category:", selectedCategory);
        let query = supabase
          .from('products')
          .select('*');
        
        // Apply category filter if not "All Categories"
        if (selectedCategory && selectedCategory !== "All Categories") {
          query = query.eq('category', selectedCategory);
        }
        
        // Get all products
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
        
        if (data && data.length === 0) {
          console.log("No products found in database, using fallback data");
          // If no products in database, return some sample data from our local fallback
          const { products } = await import("@/data/products"); 
          return products;
        }
        
        console.log("Products fetched:", data);
        return data as Product[];
      } catch (error) {
        console.error("Error in product query:", error);
        toast.error("Failed to load products. Using fallback data.");
        // Fallback to local data if fetching fails
        const { products } = await import("@/data/products");
        return products;
      }
    }
  });

  // Get search params from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    // Update selected category if present in URL
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Apply search filter
  const filteredProducts = products ? products.filter(product => {
    const searchFilter = searchQuery ? 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return searchFilter;
  }) : [];

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return ((b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  });

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-amazon-blue" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">
            {filteredProducts.length === 0 
              ? "No products found" 
              : `${filteredProducts.length} Products Found`}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} featured={product.featured} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
