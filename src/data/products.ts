export interface Product {
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

export const categories = [
  "All Categories",
  "Electronics",
  "Home & Office",
  "Kitchen",
  "Furniture",
  "Sports & Outdoors",
  "Books",
  "Toys & Games"
];

// This is a fallback for when the database connection fails
export const products: Product[] = [
  {
    id: "e89c02a4-8f4d-308c-5d8c-5ab8d77c13a4",
    name: "Wireless Bluetooth Earbuds",
    description: "High-quality sound with noise cancellation technology for an immersive listening experience.",
    price: 59.99,
    rating: 4.5,
    reviews: 120,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    featured: true
  },
  {
    id: "f72c11b4-5e4d-9a8a-3c5b-3a9f6d2e5b4c",
    name: "Smart Home Assistant",
    description: "Voice-controlled smart assistant with integrated smart home controls and entertainment features.",
    price: 129.99,
    rating: 4.7,
    reviews: 85,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    featured: false
  },
  {
    id: "d45a23c6-7d4e-8f9a-2b3c-5d7e9f8a1b2c",
    name: "Ergonomic Office Chair",
    description: "Comfortable and adjustable office chair with lumbar support for long working hours.",
    price: 199.99,
    rating: 4.3,
    reviews: 62,
    category: "Home & Office",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "b32d45e7-8f4a-9c8b-2d3e-6f7a8d9b0c1d",
    name: "Premium Coffee Maker",
    description: "Programmable coffee maker with built-in grinder for the freshest morning brew.",
    price: 149.99,
    rating: 4.8,
    reviews: 103,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    featured: true
  },
  {
    id: "a98c76d5-4e4f-3c9b-2a1d-4e5f6a7b8c9d",
    name: "Modern Coffee Table",
    description: "Stylish coffee table with minimalist design, perfect for any living room.",
    price: 249.99,
    rating: 4.6,
    reviews: 48,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    featured: false
  },
  {
    id: "c65b43a2-9d4e-8b7c-6a1b-4c5d6e7f8a9b",
    name: "Yoga Mat Set",
    description: "Complete yoga set with non-slip mat, blocks, and strap for all your fitness needs.",
    price: 39.99,
    rating: 4.4,
    reviews: 75,
    category: "Sports & Outdoors",
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    featured: false
  },
  {
    id: "e43f21b9-8a4c-7d6e-5f4a-3b2c1d0e9f8a",
    name: "Bestselling Novel Collection",
    description: "Set of five bestselling novels from acclaimed authors, perfect for book lovers.",
    price: 79.99,
    rating: 4.9,
    reviews: 92,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    featured: true
  },
  {
    id: "f32e10c8-7b5d-4e3f-2a9b-8c7d6e5f4a3b",
    name: "Building Blocks Set",
    description: "Creative building blocks set with 500 pieces for endless hours of fun and learning.",
    price: 34.99,
    rating: 4.7,
    reviews: 115,
    category: "Toys & Games",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    featured: false
  }
];
