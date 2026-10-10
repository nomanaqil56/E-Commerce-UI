import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type {  User, Product  } from "../../types";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils";
import { Plus, Search, Edit2, Trash2, X, Package } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function InventoryManagement() {
  const { user } = useOutletContext<{ user: User }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: ""
  });

  const fetchProducts = () => {
    setProducts(productService.getProductsBySeller(user.id));
  };

  useEffect(() => {
    fetchProducts();
    window.addEventListener("storage_change", fetchProducts);
    return () => window.removeEventListener("storage_change", fetchProducts);
  }, [user.id]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", description: "", category: "Electronics", price: "", stock: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Please fill out all required fields.");
      return;
    }
    
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock, 10);
    
    if (isNaN(price) || price <= 0) return alert("Price must be a valid positive number.");
    if (isNaN(stock) || stock < 0) return alert("Stock must be a non-negative integer.");

    if (editingProduct) {
      productService.updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price,
        stock,
        image: formData.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80"
      });
    } else {
      productService.createProduct({
        sellerId: user.id,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price,
        stock,
        image: formData.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80"
      });
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      productService.deleteProduct(id);
    }
  };

  const handleStockUpdate = (id: number, newStock: number) => {
    if (newStock < 0) return;
    productService.updateStock(id, newStock);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading mb-2">Inventory Management</h1>
          <p className="text-text-muted">Add, edit, and manage your products.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shrink-0">
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      <Card className="p-4 border-2 border-primary-text brutal-shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <Input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by product name or category..." 
            className="pl-10"
          />
        </div>
      </Card>

      <div className="bg-surface-secondary border border-border rounded-xl overflow-hidden skeu-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary-bg border-b-2 border-border text-sm font-bold text-text-muted uppercase tracking-wider">
                <th className="p-4 whitespace-nowrap">Product</th>
                <th className="p-4 whitespace-nowrap">Category</th>
                <th className="p-4 whitespace-nowrap">Price</th>
                <th className="p-4 whitespace-nowrap">Stock</th>
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
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-primary-bg/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-md object-cover border border-border bg-gray-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
                          }}
                        />
                        <div>
                          <div className="font-bold">{product.name}</div>
                          <div className="text-xs text-text-muted font-mono">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{product.category}</td>
                    <td className="p-4 font-bold">{formatCurrency(product.price)}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2 w-32">
                        <div className="flex items-center border border-border rounded-md overflow-hidden bg-white">
                          <button 
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border-r border-border font-bold text-lg leading-none transition-colors"
                            onClick={() => handleStockUpdate(product.id, product.stock - 1)}
                            disabled={product.stock <= 0}
                          >
                            -
                          </button>
                          <input 
                            type="number"
                            value={product.stock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) handleStockUpdate(product.id, val);
                            }}
                            className="w-full text-center font-mono font-bold text-sm outline-none no-spinners"
                            min="0"
                          />
                          <button 
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border-l border-border font-bold text-lg leading-none transition-colors"
                            onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                          >
                            +
                          </button>
                        </div>
                        {product.stock === 0 ? (
                          <Badge variant="error" className="text-[10px] justify-center">OUT OF STOCK</Badge>
                        ) : product.stock <= 5 ? (
                          <Badge variant="warning" className="text-[10px] justify-center">LOW STOCK</Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px] justify-center">IN STOCK</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-text-muted hover:text-semantic-error hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-secondary rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto brutal-shadow border-4 border-primary-text flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface-secondary z-10">
              <h2 className="text-2xl font-bold font-heading">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-primary-bg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">Product Name *</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold">Category *</label>
                <select 
                  className="w-full h-11 px-3 border border-border rounded-md bg-surface-secondary skeu-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-text"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home">Home</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Price ($) *</label>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Initial Stock *</label>
                  <Input 
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Description</label>
                <textarea 
                  className="w-full min-h-[100px] p-3 border border-border rounded-md bg-surface-secondary skeu-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-text resize-y"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your product..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Image URL</label>
                <Input 
                  type="url"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
