import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type {  Product  } from "../../types";
import { productService } from "../../services/productService";
import { storageService } from "../../services/storageService";
import { formatCurrency } from "../../utils";
import { Search, Filter, ShoppingCart, Info, X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";

export function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    setProducts(productService.getAllProducts());
  }, []);

  useEffect(() => {
    let result = products;

    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }
    
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-desc": return b.name.localeCompare(a.name);
        case "name-asc": default: return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(result);
  }, [products, search, category, inStockOnly, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setInStockOnly(false);
    setSortBy("name-asc");
    setSearchParams({});
  };

  const addToCart = (product: Product, quantity = 1) => {
    const cart = storageService.getCart();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    
    if (existingIndex >= 0) {
      const newQuantity = cart[existingIndex].quantity + quantity;
      if (newQuantity <= product.stock) {
        cart[existingIndex].quantity = newQuantity;
      } else {
        alert(`Cannot add more. Only ${product.stock} in stock.`);
        return;
      }
    } else {
      cart.push({ product, quantity });
    }
    
    storageService.setCart(cart);
    setSelectedProduct(null); // close modal if open
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading mb-2">Catalog</h1>
          <p className="text-text-muted">Find everything you need in one place.</p>
        </div>
      </div>

      <Card className="p-4 border-2 border-primary-text brutal-shadow">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 w-full flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." 
                className="pl-10 border-2 border-primary-text"
              />
            </div>
            {search && (
              <Button type="button" variant="outline" onClick={() => { setSearch(""); handleSearch(new Event('submit') as any); }}>
                Clear
              </Button>
            )}
          </form>

          <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
            <select 
              className="h-11 px-3 border-2 border-primary-text rounded-md bg-surface-secondary skeu-inset focus:ring-2 outline-none font-medium"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select 
              className="h-11 px-3 border-2 border-primary-text rounded-md bg-surface-secondary skeu-inset focus:ring-2 outline-none font-medium"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>

            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input 
                type="checkbox" 
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-5 h-5 accent-primary-accent border-2 border-primary-text rounded-sm cursor-pointer"
              />
              In Stock Only
            </label>

            <Button variant="ghost" onClick={clearFilters} className="text-text-muted hover:text-primary-text">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <Search size={48} className="text-text-muted mb-4 opacity-50" />
          <h3 className="text-2xl font-bold font-heading mb-2">No products found</h3>
          <p className="text-text-muted mb-6">Try adjusting your filters or search query.</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="group flex flex-col transition-transform hover:-translate-y-1 hover:shadow-soft border-2 border-transparent hover:border-primary-accent relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
              <div className="h-48 overflow-hidden bg-surface-secondary border-b border-border relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
                  }}
                />
                {!product.stock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <Badge variant="error" className="text-sm px-3 py-1 brutal-shadow">OUT OF STOCK</Badge>
                  </div>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="warning" className="text-xs">ONLY {product.stock} LEFT</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="text-xs font-bold tracking-wider text-text-muted uppercase mb-1">{product.category}</div>
                <h3 className="font-semibold text-lg leading-tight mb-2 flex-1 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="font-bold text-xl">{formatCurrency(product.price)}</div>
                  <Button 
                    size="sm" 
                    disabled={product.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="rounded-full w-10 h-10 p-0 brutal-shadow border-2 border-primary-text"
                  >
                    <ShoppingCart size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-secondary rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row brutal-shadow border-4 border-primary-text animate-in fade-in zoom-in-95 duration-200">
            <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
                }}
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto relative">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-bg transition-colors"
              >
                <X size={24} />
              </button>
              
              <Badge variant="outline" className="w-fit mb-4">{selectedProduct.category}</Badge>
              <h2 className="text-3xl font-bold font-heading mb-2">{selectedProduct.name}</h2>
              <div className="text-3xl font-bold text-primary-text mb-6">{formatCurrency(selectedProduct.price)}</div>
              
              <p className="text-text-muted mb-8 leading-relaxed">
                {selectedProduct.description}
              </p>
              
              <div className="mt-auto pt-8 border-t border-border flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-muted">Availability</span>
                  {selectedProduct.stock > 0 ? (
                    <span className="font-bold text-semantic-success flex items-center gap-2">
                      {selectedProduct.stock} in stock
                    </span>
                  ) : (
                    <span className="font-bold text-semantic-error">Out of stock</span>
                  )}
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full text-lg mt-2" 
                  disabled={selectedProduct.stock === 0}
                  onClick={() => addToCart(selectedProduct)}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
