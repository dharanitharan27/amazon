
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_id: string;
  price: number;
  quantity: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  order_items: OrderItem[];
}

interface SupabaseOrderItem {
  id: string;
  product_id: string;
  price: number;
  quantity: number;
  products: {
    name: string;
    image: string;
  };
}

interface SupabaseOrder {
  id: string;
  created_at: string;
  total: number;
  status: string | null;
  updated_at: string;
  user_id: string;
  order_items: SupabaseOrderItem[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Get all orders for the current user
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        
        if (!ordersData || ordersData.length === 0) {
          return [];
        }
        
        // For each order, get the order items with product details
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: orderItems, error: itemsError } = await supabase
              .from('order_items')
              .select(`
                id, 
                price, 
                quantity, 
                product_id,
                products:product_id (
                  name, 
                  image
                )
              `)
              .eq('order_id', order.id);
            
            if (itemsError) throw itemsError;
            
            return {
              ...order,
              order_items: orderItems || []
            };
          })
        );
        
        // Map the Supabase data structure to our Order interface
        const formattedOrders: Order[] = (ordersWithItems as SupabaseOrder[]).map(order => ({
          id: order.id,
          created_at: order.created_at,
          total: order.total,
          status: order.status || 'pending',
          order_items: order.order_items.map(item => ({
            id: item.id,
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
            product: item.products
          }))
        }));
        
        return formattedOrders;
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
        return [];
      }
    },
    enabled: !!user,
  });

  // Set page title
  useEffect(() => {
    document.title = "Your Orders - AmaStore";
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 max-w-md mx-auto">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">Sign in to view your orders</h1>
            <p className="mb-6 text-gray-600">You need to be signed in to view your order history.</p>
            <Button onClick={() => navigate('/auth')} className="bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange">
              Sign In
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
            Back to Shopping
          </Button>

          <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amazon-blue" />
              <span className="ml-2">Loading your orders...</span>
            </div>
          ) : orders?.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-4">When you place orders, they will appear here.</p>
              <Button onClick={() => navigate('/')} className="bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders?.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex py-4 border-b last:border-0">
                        <div className="w-16 h-16 flex-shrink-0 mr-4">
                          <img 
                            src={item.product?.image || "https://via.placeholder.com/150"} 
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="font-medium" 
                            onClick={() => navigate(`/product/${item.product_id}`)} 
                            style={{cursor: 'pointer'}}
                          >
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="text-gray-600">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartPanel />
    </div>
  );
};

export default Orders;
