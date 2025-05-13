
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();
  
  const handleViewNewTech = () => {
    navigate("/?category=Electronics");
  };

  return (
    <div className="relative bg-gradient-to-r from-amazon-blue to-blue-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Discover Amazing Products at Unbeatable Prices
            </h1>
            <p className="text-lg mb-6">
              Shop the latest electronics, home goods, and more with free shipping on eligible orders.
            </p>
            <div className="flex space-x-4">
              <Button 
                className="bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange"
                onClick={() => navigate("/")}
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white"
                onClick={() => navigate("/?category=All Categories")}
              >
                Today's Deals
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800"
                  alt="Hero product"
                  className="w-full h-auto max-h-80 object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amazon-dark to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-amazon-yellow font-medium">Top Rated</div>
                    <div className="font-bold">New Tech Arrivals</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-white hover:bg-amazon-dark/30"
                    onClick={handleViewNewTech}
                  >
                    View <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
