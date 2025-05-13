
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { categories } from "@/data/products";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  featured: boolean | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    image: "",
    featured: false
  });

  useEffect(() => {
    document.title = "Admin Dashboard - AmaStore";
  }, []);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Failed to load products");
        throw error;
      }
      
      return data as Product[];
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Electronics",
      image: "",
      featured: false
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || null,
        featured: formData.featured,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
          
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
          
        if (error) throw error;
        toast.success("Product added successfully");
      }
      
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
      featured: product.featured || false
    });
    setIsAddingProduct(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success("Product deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amazon-blue" />
          <span className="ml-2">Loading products...</span>
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button 
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange"
            >
              {isAddingProduct ? "Cancel" : (
                <>
                  <Plus size={16} className="mr-1" /> 
                  Add Product
                </>
              )}
            </Button>
          </div>

          {isAddingProduct && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name</label>
                      <Input 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Product name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Price ($)</label>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        required
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={value => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={e => setFormData({...formData, featured: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="featured">Featured Product</label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <Input 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="h-20 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        rows={5}
                        placeholder="Product description"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-amazon-yellow text-amazon-dark hover:bg-amazon-orange"
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              {products && products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Featured</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-10 h-10 rounded object-cover mr-3"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/150";
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                              )}
                              <span>{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{product.category}</td>
                          <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            {product.featured ? "Yes" : "No"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(product)}
                              className="mr-1"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No products found. Add your first product to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
