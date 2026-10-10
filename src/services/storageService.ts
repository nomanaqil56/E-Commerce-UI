import type {  Product, Order, User, CartItem  } from "../types";
import { mockProducts, mockOrders, mockUsers } from "../data/mockData";

const KEYS = {
  PRODUCTS: "merch_products",
  ORDERS: "merch_orders",
  USERS: "merch_users",
  CART: "merch_cart",
  ACTIVE_USER_ID: "merch_active_user_id",
};

export const storageService = {
  init: () => {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(mockProducts));
    }
    if (!localStorage.getItem(KEYS.ORDERS)) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(mockOrders));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(KEYS.ACTIVE_USER_ID)) {
      localStorage.setItem(KEYS.ACTIVE_USER_ID, JSON.stringify(mockUsers[0].id));
    }
    if (!localStorage.getItem(KEYS.CART)) {
      localStorage.setItem(KEYS.CART, JSON.stringify([]));
    }
  },

  reset: () => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(mockProducts));
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(mockOrders));
    localStorage.setItem(KEYS.USERS, JSON.stringify(mockUsers));
    localStorage.setItem(KEYS.CART, JSON.stringify([]));
    window.dispatchEvent(new Event("storage_change"));
  },

  getProducts: (): Product[] => {
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || "[]");
  },
  setProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event("storage_change"));
  },

  getOrders: (): Order[] => {
    return JSON.parse(localStorage.getItem(KEYS.ORDERS) || "[]");
  },
  setOrders: (orders: Order[]) => {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event("storage_change"));
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
  },

  getActiveUserId: (): number => {
    return JSON.parse(localStorage.getItem(KEYS.ACTIVE_USER_ID) || "1");
  },
  setActiveUserId: (id: number) => {
    localStorage.setItem(KEYS.ACTIVE_USER_ID, JSON.stringify(id));
    window.dispatchEvent(new Event("user_change"));
  },

  getCart: (): CartItem[] => {
    return JSON.parse(localStorage.getItem(KEYS.CART) || "[]");
  },
  setCart: (cart: CartItem[]) => {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart_change"));
  }
};
