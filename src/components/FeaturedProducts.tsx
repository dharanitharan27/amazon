
import { useRef } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProducts() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const featuredProducts = products.filter(product => product.featured);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainer.current) return;
    
    const { current } = scrollContainer;
    const scrollAmount = direction === "left" ? -current.offsetWidth / 2 : current.offsetWidth / 2;
    
    current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollContainer}
        className="flex overflow-x-auto gap-4 pb-4 px-4 hide-scrollbar snap-x snap-mandatory"
      >
        {featuredProducts.map((product) => (
          <div 
            key={product.id} 
            className="min-w-[300px] snap-start"
          >
            <ProductCard product={product} featured />
          </div>
        ))}
      </div>
    </div>
  );
}
