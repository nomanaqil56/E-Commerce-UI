import type {  Product  } from "../types";
import { storageService } from "./storageService";

export const productService = {
  getAllProducts: (): Product[] => {
    return storageService.getProducts();
  },
  
  getProductsBySeller: (sellerId: number): Product[] => {
    return storageService.getProducts().filter(p => p.sellerId === sellerId);
  },
  
  searchProducts: (keyword: string): Product[] => {
    const lowerKeyword = keyword.toLowerCase();
    return storageService.getProducts().filter(p => p.name.toLowerCase().includes(lowerKeyword));
  },
  
  getProductById: (id: number): Product | undefined => {
    return storageService.getProducts().find(p => p.id === id);
  },
  
  updateStock: (id: number, newStock: number): Product | undefined => {
    const products = storageService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    if (newStock < 0) throw new Error("Stock cannot be negative");
    
    products[index].stock = Math.floor(newStock);
    storageService.setProducts(products);
    return products[index];
  },
  
  deleteProduct: (id: number): boolean => {
    const products = storageService.getProducts();
    const newProducts = products.filter(p => p.id !== id);
    if (newProducts.length === products.length) return false;
    storageService.setProducts(newProducts);
    return true;
  },
  
  createProduct: (product: Omit<Product, "id" | "createdAt">): Product => {
    const products = storageService.getProducts();
    const newProduct: Product = {
      ...product,
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    storageService.setProducts([...products, newProduct]);
    return newProduct;
  },
  
  updateProduct: (id: number, updates: Partial<Product>): Product | undefined => {
    const products = storageService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    products[index] = { ...products[index], ...updates };
    storageService.setProducts(products);
    return products[index];
  }
};
