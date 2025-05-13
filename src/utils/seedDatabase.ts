
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";

export async function seedProducts() {
  try {
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (checkError) {
      throw checkError;
    }
    
    // Only seed if no products exist
    if (!existingProducts || existingProducts.length === 0) {
      console.log("No products found, seeding database with sample data");
      
      // Create sample products
      const { error } = await supabase
        .from('products')
        .insert(products);
        
      if (error) {
        throw error;
      }
      
      return { success: true, message: "Database seeded successfully" };
    } else {
      return { success: true, message: "Database already has products" };
    }
  } catch (error: any) {
    console.error("Error seeding database:", error);
    return { success: false, message: error.message };
  }
}
