
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function CartPanel() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    cartTotal, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300",
      isCartOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Cart header */}
        <div className="flex items-center justify-between bg-amazon-blue text-white p-4">
          <div className="flex items-center">
            <ShoppingCart className="mr-2" />
            <h2 className="text-xl font-bold">Your Cart ({cartItems.length})</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="text-white hover:text-amazon-yellow"
          >
            <X />
          </button>
        </div>
        
        {/* Cart items */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingCart size={64} className="text-gray-300 mb-4" />
            <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
            <Button 
              onClick={() => setIsCartOpen(false)}
              className="bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex border-b pb-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-amazon-blue font-bold mt-1">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="border rounded-l p-1 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="border-t border-b px-3 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="border rounded-r p-1 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Cart footer */}
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange">
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
