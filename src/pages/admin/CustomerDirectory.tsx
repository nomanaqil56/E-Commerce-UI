import React, { useState, useEffect } from "react";
import type {  User, Order  } from "../../types";
import { storageService } from "../../services/storageService";
import { orderService } from "../../services/orderService";
import { Search } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function CustomerDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUsers(storageService.getUsers().filter(u => u.role === "Buyer"));
    setOrders(orderService.getAllOrders());
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.id.toString().includes(search)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold font-heading mb-2">Customer Directory</h1>
        <p className="text-text-muted">View all buyers on the platform.</p>
      </div>

      <Card className="p-4 border-2 border-primary-text brutal-shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <Input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or ID..." 
            className="pl-10 max-w-md"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => {
          const userOrders = orders.filter(o => o.buyerId === user.id);
          
          return (
            <Card key={user.id} className="p-6 border-2 border-primary-text brutal-shadow flex flex-col gap-4">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="w-16 h-16 rounded-full bg-surface-dark text-white flex items-center justify-center text-xl font-bold brutal-border">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading">{user.name}</h3>
                  <p className="text-xs text-text-muted font-mono mt-1">ID: {user.id}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-text-muted">Total Orders Placed</span>
                <span className="font-bold font-mono bg-primary-bg px-2 py-1 rounded">{userOrders.length}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
