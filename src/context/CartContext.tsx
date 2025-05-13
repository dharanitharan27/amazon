import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Load cart items when user changes
  useEffect(() => {
    async function loadCartItems() {
      setIsLoading(true);
      
      try {
        if (user) {
          // Load from Supabase if user is logged in
          const { data: cartData, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              products:product_id (
                id,
                name,
                price,
                image,
                description,
                category,
                rating,
                reviews,
                featured
              )
            `)
            .eq('user_id', user.id);

          if (error) {
            throw error;
          }

          if (cartData && cartData.length > 0) {
            const cartItemsWithProducts = cartData.map(cartItem => ({
              product: cartItem.products as unknown as Product,
              quantity: cartItem.quantity
            }));
            
            setCartItems(cartItemsWithProducts);
          } else {
            setCartItems([]);
          }
        } else {
          // Load from localStorage if user is not logged in
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error: any) {
        console.error("Error loading cart:", error);
        toast.error("Failed to load your cart");
      } finally {
        setIsLoading(false);
      }
    }

    loadCartItems();
  }, [user]);

  // Save cart to localStorage when it changes (for non-logged in users)
  useEffect(() => {
    if (!isLoading && !user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading, user]);

  const addToCart = async (product: Product) => {
    try {
      // Strict UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(product.id)) {
        throw new Error("Invalid product ID format");
      }

      if (user) {
        console.log("Adding product to cart:", product);
        
        // Check if product already exists in the cart
        const existingItem = cartItems.find(item => item.product.id === product.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        
        if (existingItem) {
          // Update existing cart item in Supabase
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('user_id', user.id)
            .eq('product_id', product.id);
            
          if (error) throw error;
        } else {
          // Insert new cart item in Supabase
          const { error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity: 1
            });
            
          if (error) throw error;
        }
        
        // Update local state
        setCartItems(prevItems => {
          if (existingItem) {
            return prevItems.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prevItems, { product, quantity: 1 }];
          }
        });
        
        toast.success(`Added ${product.name} to your cart`);
      } else {
        // Handle for non-logged in users (localStorage only)
        setCartItems(prevItems => {
          const existingItem = prevItems.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            toast.success(`Added another ${product.name} to your cart`);
            return prevItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            toast.success(`${product.name} added to your cart`);
            return [...prevItems, { product, quantity: 1 }];
          }
        });
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add item to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (user) {
        // Remove from Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) throw error;
      }
      
      // Update local state
      setCartItems((prevItems) => {
        const itemToRemove = prevItems.find(item => item.product.id === productId);
        if (itemToRemove) {
          toast.info(`${itemToRemove.product.name} removed from cart`);
        }
        return prevItems.filter((item) => item.product.id !== productId);
      });
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }

      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) throw error;
      }
      
      // Update local state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Clear from Supabase
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      // Clear local state
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
