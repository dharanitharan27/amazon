
import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Home, Monitor, Utensils, Sofa, Heart, Book, Gamepad } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { categories, products } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract search query and category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For this example, we'll just redirect to home with the search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle category click
  const handleCategoryClick = (category: string) => {
    // Navigate to home with category filter
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  // Get appropriate icon for each category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Electronics":
        return <Monitor size={16} />;
      case "Home & Office":
        return <Home size={16} />;
      case "Kitchen":
        return <Utensils size={16} />;
      case "Furniture":
        return <Sofa size={16} />;
      case "Sports & Outdoors":
        return <Heart size={16} />;
      case "Books":
        return <Book size={16} />;
      case "Toys & Games":
        return <Gamepad size={16} />;
      default:
        return null;
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "Sign In";
    
    return user.user_metadata?.name 
      ? `Hello, ${user.user_metadata.name.split(' ')[0]}`
      : "Hello, User";
  };

  return (
    <header className="bg-amazon-blue text-white">
      {/* Top Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-amazon-orange">
            AmaStore
          </a>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-3xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 rounded-md text-black outline-none focus:ring-2 focus:ring-amazon-orange"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 h-full bg-amazon-yellow text-amazon-dark px-4 rounded-r-md"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* User Nav */}
        <div className="flex items-center space-x-6">
          <div 
            className="hidden sm:block cursor-pointer"
            onClick={() => navigate(user ? "/profile" : "/auth")}
          >
            <div className="text-xs">{user ? getUserDisplayName() : "Hello, Sign In"}</div>
            <div className="font-bold">{user ? "Account & Lists" : "Sign In"}</div>
          </div>
          <div 
            className="hidden sm:block cursor-pointer"
            onClick={() => navigate("/orders")}
          >
            <div className="text-xs">Returns</div>
            <div className="font-bold">& Orders</div>
          </div>
          <button 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amazon-orange text-amazon-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Category Navigation */}
      <nav className="bg-amazon-blue bg-opacity-80 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex items-center overflow-x-auto space-x-6 py-2 text-sm whitespace-nowrap">
            <li 
              className="flex items-center space-x-1 cursor-pointer hover:text-amazon-orange transition duration-200"
              onClick={() => navigate('/')}
            >
              <User size={16} />
              <span>All</span>
            </li>
            {categories.slice(0, 8).map((category) => (
              <li 
                key={category} 
                className="hover:text-amazon-orange transition duration-200 cursor-pointer flex items-center space-x-1"
                onClick={() => handleCategoryClick(category)}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
