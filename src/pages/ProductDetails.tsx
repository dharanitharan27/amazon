
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";

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

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as Product;
    },
  });

  useEffect(() => {
    // Set page title
    document.title = product 
      ? `${product.name} - AmaStore` 
      : "Product Details - AmaStore";
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success(`${quantity} × ${product.name} added to cart`);
    }
  };

  const handleBuyNow = async () => {
    if (!product || quantity <= 0) return;
    
    try {
      if (!user) {
        toast.error("You need to be logged in to place an order");
        navigate("/auth", { state: { from: `/product/${productId}` } });
        return;
      }
      
      // First add to cart
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: product.price * quantity,
          status: 'pending'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_id: product.id,
          quantity: quantity,
          price: product.price
        });
        
      if (itemError) throw itemError;
      
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amazon-blue" />
          <span className="ml-2">Loading product details...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="aspect-square overflow-hidden rounded-md">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/800";
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
              </div>
              
              <div className="text-3xl font-bold text-amazon-blue mb-4">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 w-24"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                className="w-full bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange mb-3"
              >
                Add to Cart
              </Button>
              
              <Button 
                onClick={handleBuyNow}
                className="w-full"
              >
                Buy Now
              </Button>
            </div>
          </div>
          
          {/* Additional product details, reviews, etc. could be added here */}
        </div>
      </main>
      <Footer />
      <CartPanel />
    </div>
  );
};

export default ProductDetails;
