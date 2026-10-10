import React from "react";
import type {  User, CartItem  } from "../../types";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell, Search, Menu } from "lucide-react";
import { storageService } from "../../services/storageService";
import { Button } from "../ui/Button";

interface TopbarProps {
  user: User;
  users: User[];
  onUserChange: (id: number) => void;
  cartCount: number;
}

export function Topbar({ user, users, onUserChange, cartCount }: TopbarProps) {
  return (
    <header className="h-16 bg-surface-secondary border-b border-border sticky top-0 z-10 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-primary-text hover:bg-primary-bg rounded-md">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center text-sm text-text-muted font-medium">
          Dashboard <span className="mx-2">/</span> <span className="text-primary-text">{user.role}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {user.role === "Buyer" && (
          <Link to="/cart" className="relative p-2 text-primary-text hover:bg-primary-bg rounded-md transition-colors">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary-accent text-primary-text brutal-border text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        )}
        
        <button className="p-2 text-primary-text hover:bg-primary-bg rounded-md transition-colors relative">
          <Bell size={24} />
        </button>

        <div className="h-8 w-px bg-border mx-2 hidden md:block"></div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold hidden md:block">Demo Role:</span>
          <select
            className="bg-surface-secondary border-2 border-border rounded-md px-2 py-1 text-sm font-medium outline-none focus:border-primary-text cursor-pointer"
            value={user.id}
            onChange={(e) => onUserChange(Number(e.target.value))}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
