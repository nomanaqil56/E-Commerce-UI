import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import type {  User, Product, Order  } from "../../types";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { Card, CardContent } from "../../components/ui/Card";
import { Package, AlertTriangle, BoxSelect, TrendingUp, CheckCircle } from "lucide-react";

export function SellerOverview() {
  const { user } = useOutletContext<{ user: User }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setProducts(productService.getProductsBySeller(user.id));
    setOrders(orderService.getOrdersBySeller(user.id));
  }, [user.id]);

  const totalInventory = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const ordersAwaiting = orders.filter(o => o.status === "Placed" || o.status === "Packed").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold font-heading mb-2">Seller Overview</h1>
        <p className="text-text-muted">Manage your store performance and operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-primary-accent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider uppercase mb-1">Total Products</p>
              <h3 className="text-4xl font-bold font-heading">{products.length}</h3>
            </div>
            <div className="p-3 bg-primary-text text-primary-accent rounded-xl border-2 border-primary-text brutal-shadow">
              <Package size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-surface-secondary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-text-muted uppercase mb-1">Inventory Units</p>
              <h3 className="text-4xl font-bold font-heading">{totalInventory}</h3>
            </div>
            <div className="p-3 bg-surface-dark text-white rounded-xl">
              <BoxSelect size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-surface-secondary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-text-muted uppercase mb-1">Low Stock Alerts</p>
              <h3 className="text-4xl font-bold font-heading">{lowStock}</h3>
            </div>
            <div className="p-3 bg-semantic-warning text-black rounded-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-primary-text brutal-shadow bg-surface-dark text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-1">Out of Stock</p>
              <h3 className="text-4xl font-bold font-heading">{outOfStock}</h3>
            </div>
            <div className="p-3 bg-semantic-error text-white rounded-xl">
              <AlertTriangle size={24} />
            </div>
          </div>
        </Card>
      </div>

      <h2 className="text-2xl font-bold font-heading mt-4">Order Fulfillment</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 skeu-inset flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-text-muted uppercase">Awaiting Action</p>
            <h3 className="text-3xl font-bold">{ordersAwaiting}</h3>
          </div>
        </Card>
        
        <Card className="p-6 skeu-inset flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Package size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-text-muted uppercase">Shipped</p>
            <h3 className="text-3xl font-bold">{shippedOrders}</h3>
          </div>
        </Card>

        <Card className="p-6 skeu-inset flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-text-muted uppercase">Delivered</p>
            <h3 className="text-3xl font-bold">{deliveredOrders}</h3>
          </div>
        </Card>
      </div>
    </div>
  );
}
