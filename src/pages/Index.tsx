
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductGrid from "@/components/ProductGrid";
import CartPanel from "@/components/CartPanel";
import { seedProducts } from "@/utils/seedDatabase";
import { toast } from "sonner";

const Index = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Set page title
  useEffect(() => {
    document.title = "AmaStore - Online Shopping";
  }, []);

  // Seed database with products if needed
  useEffect(() => {
    async function initializeProducts() {
      try {
        const result = await seedProducts();
        if (result.success && result.message === "Database seeded successfully") {
          console.log("Products seeded successfully");
          toast.success("Product catalog initialized");
        }
      } catch (error) {
        console.error("Failed to initialize products:", error);
      }
    }
    
    initializeProducts();
  }, []);
  
  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    // Update active category if present in URL
    if (categoryParam && categoryParam !== 'All Categories') {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("");
    }
    
    // Update search query if present in URL
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
  }, [location.search]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <HeroBanner />
        {!activeCategory && !searchQuery && <FeaturedProducts />}
        
        {(activeCategory || searchQuery) && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : `${activeCategory} Products`}
            </h2>
          </div>
        )}
        
        <ProductGrid 
          initialCategory={activeCategory || undefined} 
          searchQuery={searchQuery || undefined}
        />
      </main>
      <Footer />
      <CartPanel />
    </div>
  );
};

export default Index;
