
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { CartProvider } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set page title
  useEffect(() => {
    document.title = "My Profile - AmaStore";
  }, []);

  // Get initials for avatar
  const getInitials = () => {
    const name = user?.user_metadata?.name || "";
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Profile Header */}
              <div className="bg-amazon-blue text-white p-6">
                <div className="flex items-center">
                  <Avatar className="h-20 w-20 border-2 border-white mr-4">
                    <AvatarFallback className="text-2xl bg-amazon-yellow text-amazon-blue">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{user?.user_metadata?.name || "AmaStore User"}</h1>
                    <p className="text-gray-200">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Account Information */}
                  <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <User size={20} className="mr-2" />
                      Account Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{user?.user_metadata?.name || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium">
                            {new Date(user?.created_at || "").toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
                      <div className="bg-gray-50 p-4 rounded-md text-center">
                        <p>You don't have any orders yet.</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button 
                        variant="outline" 
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => signOut()}
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                    <div className="space-y-4">
                      <div 
                        className="bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => navigate('/')}
                      >
                        <p className="font-medium">Explore deals on electronics</p>
                        <p className="text-sm text-gray-500">Up to 40% off</p>
                      </div>
                      <div 
                        className="bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => navigate('/')}
                      >
                        <p className="font-medium">Complete your home setup</p>
                        <p className="text-sm text-gray-500">Furniture & decor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartPanel />
      </div>
    </CartProvider>
  );
};

export default Profile;
