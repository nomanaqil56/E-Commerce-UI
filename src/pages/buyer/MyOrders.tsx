import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type {  User, Order, Product  } from "../../types";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import { formatCurrency, formatDate } from "../../utils";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

type OrderWithProduct = Order & { product: Product };

export function MyOrders() {
  const { user } = useOutletContext<{ user: User }>();
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const fetchOrders = () => {
      const userOrders = orderService.getOrdersByBuyer(user.id);
      const ordersWithProducts = userOrders.map(order => {
        const product = productService.getProductById(order.productId)!;
        return { ...order, product };
      });
      // Sort by date desc
      ordersWithProducts.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      setOrders(ordersWithProducts);
    };

    fetchOrders();
    window.addEventListener("storage_change", fetchOrders);
    return () => window.removeEventListener("storage_change", fetchOrders);
  }, [user.id]);

  const filteredOrders = statusFilter === "All" 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Placed": return <Clock size={20} className="text-blue-500" />;
      case "Packed": return <Package size={20} className="text-semantic-warning" />;
      case "Shipped": return <Truck size={20} className="text-purple-500" />;
      case "Delivered": return <CheckCircle2 size={20} className="text-semantic-success" />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Placed": return "default";
      case "Packed": return "warning";
      case "Shipped": return "outline";
      case "Delivered": return "success";
      default: return "default";
    }
  };

  const statuses = ["All", "Placed", "Packed", "Shipped", "Delivered"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold font-heading mb-2">My Orders</h1>
          <p className="text-text-muted">Track and manage your recent purchases.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-surface-secondary rounded-lg border border-border">
          {statuses.map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                statusFilter === status 
                  ? "bg-primary-text text-primary-bg" 
                  : "text-text-muted hover:bg-primary-bg"
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="py-20 text-center flex flex-col items-center border-dashed">
          <Package size={48} className="text-text-muted mb-4 opacity-50" />
          <h3 className="text-2xl font-bold font-heading mb-2">No orders found</h3>
          <p className="text-text-muted">You haven't placed any orders matching this status.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="overflow-hidden border-2 border-primary-text brutal-shadow group">
              <div className="bg-surface-dark text-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-primary-text">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs text-gray-400 font-bold tracking-wider mb-1">ORDER ID</div>
                    <div className="font-mono font-bold text-lg">#{order.id.toString().padStart(6, '0')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold tracking-wider mb-1">DATE PLACED</div>
                    <div className="font-semibold">{formatDate(order.orderDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold tracking-wider mb-1">TOTAL</div>
                    <div className="font-semibold">{formatCurrency(order.product.price * order.quantity)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                  {getStatusIcon(order.status)}
                  <span className="font-bold tracking-wide">{order.status.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-border">
                  <img 
                    src={order.product.image} 
                    alt={order.product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{order.product.name}</h3>
                  <div className="text-text-muted mb-4 font-medium">Qty: <span className="font-bold text-primary-text">{order.quantity}</span> &times; {formatCurrency(order.product.price)}</div>
                  
                  {/* Order timeline visualizer */}
                  <div className="mt-4 w-full max-w-lg">
                    <div className="flex justify-between relative mb-2">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0"></div>
                      
                      {["Placed", "Packed", "Shipped", "Delivered"].map((step, index) => {
                        const statusIndex = ["Placed", "Packed", "Shipped", "Delivered"].indexOf(order.status);
                        const isCompleted = index <= statusIndex;
                        const isCurrent = index === statusIndex;
                        
                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full border-2 border-surface-secondary ${
                              isCompleted ? "bg-primary-text" : "bg-border"
                            } ${isCurrent ? "ring-4 ring-primary-accent" : ""}`}></div>
                            <span className={`text-[10px] font-bold uppercase mt-2 tracking-wider ${
                              isCompleted ? "text-primary-text" : "text-text-muted"
                            }`}>{step}</span>
                          </div>
                        );
                      })}
                      
                      {/* Active line filler */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-primary-text -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ 
                          width: `${(["Placed", "Packed", "Shipped", "Delivered"].indexOf(order.status) / 3) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
