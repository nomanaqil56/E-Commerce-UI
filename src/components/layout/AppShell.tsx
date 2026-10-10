import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type {  User, CartItem  } from "../../types";
import { storageService } from "../../services/storageService";

export function AppShell() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Initialize data
    storageService.init();
    
    const loadData = () => {
      const allUsers = storageService.getUsers();
      setUsers(allUsers);
      
      const activeId = storageService.getActiveUserId();
      const user = allUsers.find(u => u.id === activeId) || allUsers[0];
      setActiveUser(user);
      
      setCart(storageService.getCart());
    };

    loadData();

    window.addEventListener("user_change", loadData);
    window.addEventListener("cart_change", loadData);
    window.addEventListener("storage_change", loadData);

    return () => {
      window.removeEventListener("user_change", loadData);
      window.removeEventListener("cart_change", loadData);
      window.removeEventListener("storage_change", loadData);
    };
  }, []);

  const handleUserChange = (id: number) => {
    storageService.setActiveUserId(id);
  };

  if (!activeUser) return <div className="h-screen w-screen flex items-center justify-center bg-primary-bg">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-primary-bg">
      <Sidebar user={activeUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar 
          user={activeUser} 
          users={users} 
          onUserChange={handleUserChange}
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet context={{ user: activeUser }} />
        </main>
      </div>
    </div>
  );
}
