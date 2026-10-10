import type {  Order  } from "../types";
import { storageService } from "./storageService";
import { productService } from "./productService";

export const orderService = {
  placeOrder: (buyerId: number, productId: number, quantity: number): Order => {
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error("Quantity must be a positive integer.");
    }
    
    // Simulate transaction by locking/checking first
    const product = productService.getProductById(productId);
    if (!product) throw new Error("Product not found.");
    
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Only ${product.stock} left.`);
    }
    
    // Update stock
    productService.updateStock(productId, product.stock - quantity);
    
    // Create order
    const orders = storageService.getOrders();
    const newOrder: Order = {
      id: Math.max(0, ...orders.map(o => o.id)) + 1,
      buyerId,
      productId,
      quantity,
      status: "Placed",
      orderDate: new Date().toISOString(),
    };
    
    storageService.setOrders([...orders, newOrder]);
    return newOrder;
  },

  placeBatchOrders: (buyerId: number, items: {productId: number, quantity: number}[]): Order[] => {
    // Validate all first
    for (const item of items) {
       if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
         throw new Error("Quantity must be a positive integer.");
       }
       const product = productService.getProductById(item.productId);
       if (!product) throw new Error(`Product ${item.productId} not found.`);
       if (product.stock < item.quantity) {
         throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
       }
    }

    // Process all
    const createdOrders: Order[] = [];
    const orders = storageService.getOrders();
    let maxId = Math.max(0, ...orders.map(o => o.id));

    for (const item of items) {
      const product = productService.getProductById(item.productId)!;
      productService.updateStock(item.productId, product.stock - item.quantity);
      
      maxId++;
      const newOrder: Order = {
        id: maxId,
        buyerId,
        productId: item.productId,
        quantity: item.quantity,
        status: "Placed",
        orderDate: new Date().toISOString(),
      };
      createdOrders.push(newOrder);
    }

    storageService.setOrders([...orders, ...createdOrders]);
    return createdOrders;
  },
  
  getOrdersByBuyer: (buyerId: number): Order[] => {
    return storageService.getOrders().filter(o => o.buyerId === buyerId);
  },
  
  getOrdersBySeller: (sellerId: number): Order[] => {
    const sellerProductIds = productService.getProductsBySeller(sellerId).map(p => p.id);
    return storageService.getOrders().filter(o => sellerProductIds.includes(o.productId));
  },
  
  getAllOrders: (): Order[] => {
    return storageService.getOrders();
  },
  
  updateStatus: (orderId: number, status: Order["status"]): Order | undefined => {
    const orders = storageService.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return undefined;
    
    const currentStatus = orders[index].status;
    const statuses: Order["status"][] = ["Placed", "Packed", "Shipped", "Delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    const newIndex = statuses.indexOf(status);
    
    if (newIndex !== currentIndex + 1) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
    }
    
    orders[index].status = status;
    storageService.setOrders(orders);
    return orders[index];
  }
};
