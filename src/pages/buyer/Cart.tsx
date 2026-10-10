import React, { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import type {  User, CartItem  } from "../../types";
import { storageService } from "../../services/storageService";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function Cart() {
  const { user } = useOutletContext<{ user: User }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setCart(storageService.getCart());
  }, []);

  const updateQuantity = (productId: number, delta: number) => {
    const newCart = [...cart];
    const index = newCart.findIndex(item => item.product.id === productId);
    if (index === -1) return;

    const currentQty = newCart[index].quantity;
    const newQty = currentQty + delta;
    const stock = newCart[index].product.stock;

    if (newQty > stock) {
      alert(`Only ${stock} units available.`);
      return;
    }

    if (newQty <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].quantity = newQty;
    }

    setCart(newCart);
    storageService.setCart(newCart);
  };

  const removeItem = (productId: number) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    setCart(newCart);
    storageService.setCart(newCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      
      orderService.placeBatchOrders(user.id, items);
      
      // clear cart
      setCart([]);
      storageService.setCart([]);
      
      alert("Checkout successful! Your orders have been placed.");
      navigate("/orders");
    } catch (error: any) {
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-surface-secondary rounded-full flex items-center justify-center mb-6 border-4 border-primary-text brutal-shadow">
          <ShoppingBag size={40} className="text-primary-text" />
        </div>
        <h2 className="text-3xl font-bold font-heading mb-4">Your cart is empty</h2>
        <p className="text-text-muted mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Let's find some great products for you.
        </p>
        <Link to="/products">
          <Button size="lg" className="px-12">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold font-heading">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {cart.map(item => (
            <Card key={item.product.id} className="p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-stretch">
              <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-border">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1 text-center sm:text-left w-full">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{item.product.name}</h3>
                  <div className="text-text-muted text-sm">{formatCurrency(item.product.price)}</div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 border-2 border-primary-text rounded-md bg-surface-secondary px-2 py-1">
                    <button 
                      className="p-1 hover:bg-primary-bg rounded transition-colors"
                      onClick={() => updateQuantity(item.product.id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-bold font-mono">{item.quantity}</span>
                    <button 
                      className="p-1 hover:bg-primary-bg rounded transition-colors"
                      onClick={() => updateQuantity(item.product.id, 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="font-bold text-lg hidden sm:block">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end sm:py-1 w-full sm:w-auto">
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-text-muted hover:text-semantic-error hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                <div className="font-bold text-lg sm:hidden">
                  {formatCurrency(item.product.price * item.quantity)}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:w-96 shrink-0">
          <Card className="p-6 sticky top-24 border-2 border-primary-text brutal-shadow">
            <h2 className="text-2xl font-bold font-heading mb-6">Order Summary</h2>
            
            <div className="flex flex-col gap-4 text-sm font-medium border-b border-border pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Estimated Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span className="text-semantic-success">Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl">Total</span>
              <span className="font-bold text-3xl">{formatCurrency(total)}</span>
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg h-16 rounded-xl"
              onClick={handleCheckout}
              disabled={isCheckingOut || cart.length === 0}
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
              {!isCheckingOut && <ArrowRight className="ml-2" size={20} />}
            </Button>
            
            <div className="mt-4 text-center">
              <Link to="/products" className="text-sm font-medium text-text-muted hover:text-primary-text underline underline-offset-4">
                Continue Shopping
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
