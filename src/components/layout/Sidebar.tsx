import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils";
import { 
  Store, 
  ShoppingBag, 
  ShoppingCart, 
  ClipboardList, 
  Package, 
  Users, 
  Settings,
  LayoutDashboard
} from "lucide-react";
import type {  User  } from "../../types";

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const location = useLocation();

  const getLinks = () => {
    switch (user.role) {
      case "Buyer":
        return [
          { name: "Storefront", path: "/", icon: Store },
          { name: "Products", path: "/products", icon: ShoppingBag },
          { name: "My Orders", path: "/orders", icon: ClipboardList },
        ];
      case "Seller":
        return [
          { name: "Overview", path: "/", icon: LayoutDashboard },
          { name: "Inventory", path: "/inventory", icon: Package },
          { name: "Orders", path: "/orders", icon: ClipboardList },
        ];
      case "Admin":
        return [
          { name: "Overview", path: "/", icon: LayoutDashboard },
          { name: "Products", path: "/products", icon: Package },
          { name: "Orders", path: "/orders", icon: ClipboardList },
          { name: "Customers", path: "/customers", icon: Users },
          { name: "Sellers", path: "/sellers", icon: Store },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-surface-secondary border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link to="/" className="text-2xl font-bold font-heading tracking-wider">
          MERCH
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors",
                isActive 
                  ? "bg-primary-accent text-primary-text brutal-border" 
                  : "text-text-muted hover:bg-primary-bg hover:text-primary-text border-2 border-transparent"
              )}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-surface-dark text-white flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="text-xs text-text-muted">{user.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
