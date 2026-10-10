import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type {  User, Order, Product  } from "../../types";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import { storageService } from "../../services/storageService";
import { formatCurrency, formatDate } from "../../utils";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";

type OrderDetail = Order & { product: Product; buyerName: string };

export function SellerOrderManagement() {
  const { user } = useOutletContext<{ user: User }>();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = () => {
    const sellerOrders = orderService.getOrdersBySeller(user.id);
    const users = storageService.getUsers();
    
    const detailed = sellerOrders.map(o => {
      const product = productService.getProductById(o.productId)!;
      const buyer = users.find(u => u.id === o.buyerId);
      return { ...o, product, buyerName: buyer?.name || "Unknown Buyer" };
    });
    
    detailed.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    setOrders(detailed);
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener("storage_change", fetchOrders);
    return () => window.removeEventListener("storage_change", fetchOrders);
  }, [user.id]);

  const handleStatusUpdate = (orderId: number, currentStatus: string) => {
    const statuses = ["Placed", "Packed", "Shipped", "Delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      
      let confirmMsg = `Move order #${orderId} to ${nextStatus}?`;
      if (nextStatus === "Shipped" || nextStatus === "Delivered") {
        if (!window.confirm(confirmMsg)) return;
      }
      
      try {
        orderService.updateStatus(orderId, nextStatus as any);
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toString().includes(search) || 
      o.product.name.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading mb-2">Order Management</h1>
          <p className="text-text-muted">Fulfill orders and track shipments.</p>
        </div>
      </div>

      <Card className="p-4 border-2 border-primary-text brutal-shadow flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <Input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID, Product, or Buyer..." 
            className="pl-10"
          />
        </div>
        
        <select 
          className="h-11 px-3 border border-border rounded-md bg-surface-secondary skeu-inset focus:ring-2 outline-none font-medium w-full md:w-48"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Placed">Placed</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </Card>

      <div className="bg-surface-secondary border border-border rounded-xl overflow-hidden skeu-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-primary-bg border-b-2 border-border text-sm font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4 whitespace-nowrap">Order Info</th>
                <th className="p-4 whitespace-nowrap">Product</th>
                <th className="p-4 whitespace-nowrap">Buyer</th>
                <th className="p-4 whitespace-nowrap text-center">Status</th>
                <th className="p-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-primary-bg/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold">#{order.id.toString().padStart(6, '0')}</div>
                      <div className="text-xs text-text-muted">{formatDate(order.orderDate)}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={order.product.image} 
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-border bg-gray-100 shrink-0"
                          onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80"}
                        />
                        <div>
                          <div className="font-bold text-sm line-clamp-1">{order.product.name}</div>
                          <div className="text-xs text-text-muted">{order.quantity} &times; {formatCurrency(order.product.price)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-sm">
                      {order.buyerName}
                    </td>
                    <td className="p-4 text-center">
                      <Badge 
                        variant={
                          order.status === "Placed" ? "default" :
                          order.status === "Packed" ? "warning" :
                          order.status === "Shipped" ? "outline" : "success"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {order.status !== "Delivered" && (
                        <button 
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-text text-primary-bg rounded-md text-xs font-bold hover:bg-black transition-colors brutal-shadow"
                          onClick={() => handleStatusUpdate(order.id, order.status)}
                        >
                          Mark as {
                            order.status === "Placed" ? "Packed" :
                            order.status === "Packed" ? "Shipped" : "Delivered"
                          }
                          <ArrowRight size={14} />
                        </button>
                      )}
                      {order.status === "Delivered" && (
                        <span className="text-xs font-bold text-semantic-success inline-flex items-center">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
