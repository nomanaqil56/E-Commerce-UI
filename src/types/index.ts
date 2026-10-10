export interface Product {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
}

export interface Order {
  id: number;
  buyerId: number;
  productId: number;
  quantity: number;
  status: "Placed" | "Packed" | "Shipped" | "Delivered";
  orderDate: string;
}

export interface User {
  id: number;
  name: string;
  role: "Buyer" | "Seller" | "Admin";
}

export interface CartItem {
  product: Product;
  quantity: number;
}
