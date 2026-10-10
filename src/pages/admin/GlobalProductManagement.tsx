import React, { useState, useEffect } from "react";
import type {  Product, User  } from "../../types";
import { productService } from "../../services/productService";
import { storageService } from "../../services/storageService";
import { formatCurrency } from "../../utils";
import { Search, Trash2 } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function GlobalProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [sellerFilter, setSellerFilter] = useState("All");

  const fetchProducts = () => {
    setProducts(productService.getAllProducts());
    setUsers(storageService.getUsers());
  };

  useEffect(() => {
    fetchProducts();
    window.addEventListener("storage_change", fetchProducts);
    return () => window.removeEventListener("storage_change", fetchProducts);
  }, []);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`ADMIN ACTION: Are you sure you want to delete "${name}"?`)) {
      productService.deleteProduct(id);
    }
  };

  const handleStockUpdate = (id: number, newStock: number) => {
    if (newStock < 0) return;
    productService.updateStock(id, newStock);
  };

  const sellers = users.filter(u => u.role === "Seller");

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesSeller = sellerFilter === "All" || p.sellerId.toString() === sellerFilter;
    return matchesSearch && matchesSeller;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-bold font-heading mb-2">Global Product Management</h1>
        <p className="text-text-muted">Manage all products across the platform.</p>
      </div>

      <Card className="p-4 border-2 border-primary-text brutal-shadow flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <Input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." 
            className="pl-10"
          />
        </div>
        
        <select 
          className="h-11 px-3 border border-border rounded-md bg-surface-secondary skeu-inset focus:ring-2 outline-none font-medium w-full md:w-64"
          value={sellerFilter}
          onChange={e => setSellerFilter(e.target.value)}
        >
          <option value="All">All Sellers</option>
          {sellers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </Card>

      <div className="bg-surface-secondary border border-border rounded-xl overflow-hidden skeu-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-primary-bg border-b-2 border-border text-sm font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4 whitespace-nowrap">Product</th>
                <th className="p-4 whitespace-nowrap">Seller</th>
                <th className="p-4 whitespace-nowrap">Category</th>
                <th className="p-4 whitespace-nowrap">Price & Stock</th>
                <th className="p-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const seller = users.find(u => u.id === product.sellerId);
                  
                  return (
                    <tr key={product.id} className="hover:bg-primary-bg/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-10 h-10 rounded object-cover border border-border bg-gray-100 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
                            }}
                          />
                          <div>
                            <div className="font-bold text-sm line-clamp-1">{product.name}</div>
                            <div className="text-xs text-text-muted font-mono">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-sm">
                        {seller ? seller.name : "Unknown"}
                      </td>
                      <td className="p-4 font-medium text-sm">{product.category}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="font-bold">{formatCurrency(product.price)}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-text-muted">Stock:</span>
                            <div className="flex items-center border border-border rounded overflow-hidden bg-white w-24">
                              <button 
                                className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 border-r border-border font-bold leading-none transition-colors"
                                onClick={() => handleStockUpdate(product.id, product.stock - 1)}
                              >-</button>
                              <input 
                                type="number"
                                value={product.stock}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val)) handleStockUpdate(product.id, val);
                                }}
                                className="w-full text-center font-mono font-bold text-xs outline-none no-spinners"
                              />
                              <button 
                                className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 border-l border-border font-bold leading-none transition-colors"
                                onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                              >+</button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-text-muted hover:text-semantic-error hover:bg-red-50 rounded-md transition-colors"
                          title="Admin Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .no-spinners::-webkit-inner-spin-button,
        .no-spinners::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinners {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
