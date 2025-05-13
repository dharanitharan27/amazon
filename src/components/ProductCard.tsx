import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const goToProductDetails = () => {
    navigate(`/product/${product.id}`);
  };
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col",
      featured ? "border-2 border-amazon-yellow" : ""
    )}>
      <div 
        className="relative pb-[60%] overflow-hidden cursor-pointer"
        onClick={goToProductDetails}
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/400x300?text=Product+Image";
          }}
        />
        {featured && (
          <span className="absolute top-2 left-2 bg-amazon-orange text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 
          className="text-lg font-semibold line-clamp-2 mb-1 cursor-pointer hover:text-amazon-blue"
          onClick={goToProductDetails}
        >
          {product.name}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{product.description}</p>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
