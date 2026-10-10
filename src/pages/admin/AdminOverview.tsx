import React, { useState, useEffect } from "react";
import type {  Product, Order, User  } from "../../types";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { storageService } from "../../services/storageService";
import { Card } from "../../components/ui/Card";
import { Package, Users, Store, ClipboardList, AlertTriangle } from "lucide-react";

export function AdminOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setProducts(productService.getAllProducts());
    setOrders(orderService.getAllOrders());
    setUsers(storageService.getUsers());
  }, []);

  const totalInventory = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const buyers = users.filter(u => u.role === "Buyer").length;
  const sellers = users.filter(u => u.role === "Seller").length;

  const ordersPlaced = orders.filter(o => o.status === "Placed").length;
  const ordersPacked = orders.filter(o => o.status === "Packed").length;
  const ordersShipped = orders.filter(o => o.status === "Shipped").length;
  const ordersDelivered = orders.filter(o => o.status === "Delivered").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold font-heading mb-2">Platform Overview</h1>
        <p className="text-text-muted">Global metrics across all sellers and buyers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-surface-secondary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-text-muted uppercase mb-1">Total Users</p>
              <h3 className="text-4xl font-bold font-heading">{users.length}</h3>
              <p className="text-xs font-semibold mt-2 text-text-muted">{buyers} Buyers, {sellers} Sellers</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-primary-accent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider uppercase mb-1">Total Products</p>
              <h3 className="text-4xl font-bold font-heading">{products.length}</h3>
              <p className="text-xs font-semibold mt-2">Across all sellers</p>
            </div>
            <div className="p-3 bg-primary-text text-primary-accent rounded-xl">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-surface-secondary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-text-muted uppercase mb-1">Total Orders</p>
              <h3 className="text-4xl font-bold font-heading">{orders.length}</h3>
              <p className="text-xs font-semibold mt-2 text-text-muted">Platform wide</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <ClipboardList size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-surface-dark text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-1">Inventory Alert</p>
              <h3 className="text-4xl font-bold font-heading">{outOfStock}</h3>
              <p className="text-xs font-semibold mt-2 text-gray-400">Products out of stock</p>
            </div>
            <div className="p-3 bg-semantic-error text-white rounded-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-2 border-primary-text brutal-shadow">
          <h2 className="text-xl font-bold font-heading mb-6">Order Fulfillment Status</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">Placed</span>
              <span className="font-mono bg-gray-100 px-3 py-1 rounded-md">{ordersPlaced}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: `${(ordersPlaced / orders.length) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="font-bold">Packed</span>
              <span className="font-mono bg-gray-100 px-3 py-1 rounded-md">{ordersPacked}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-500 h-full" style={{ width: `${(ordersPacked / orders.length) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="font-bold">Shipped</span>
              <span className="font-mono bg-gray-100 px-3 py-1 rounded-md">{ordersShipped}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full" style={{ width: `${(ordersShipped / orders.length) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="font-bold">Delivered</span>
              <span className="font-mono bg-gray-100 px-3 py-1 rounded-md">{ordersDelivered}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${(ordersDelivered / orders.length) * 100}%` }}></div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-surface-secondary">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold font-heading">Recent Activity</h2>
          </div>
          <div className="flex flex-col gap-4">
            {orders.slice(0, 5).map(order => {
              const buyer = users.find(u => u.id === order.buyerId);
              return (
                <div key={order.id} className="flex items-start gap-4 p-3 hover:bg-primary-bg rounded-lg transition-colors border border-transparent hover:border-border">
                  <div className="w-10 h-10 rounded-full bg-surface-dark text-white flex items-center justify-center font-bold shrink-0">
                    {buyer?.name.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {buyer?.name} <span className="font-normal text-text-muted">placed order</span> #{order.id}
                    </p>
                    <p className="text-xs text-text-muted mt-1">Status: {order.status}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
