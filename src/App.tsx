import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import type {  User  } from "./types";

// Buyer Pages
import { Storefront } from "./pages/buyer/Storefront";
import { ProductCatalog } from "./pages/buyer/ProductCatalog";
import { Cart } from "./pages/buyer/Cart";
import { MyOrders } from "./pages/buyer/MyOrders";

// Seller Pages
import { SellerOverview } from "./pages/seller/SellerOverview";
import { InventoryManagement } from "./pages/seller/InventoryManagement";
import { SellerOrderManagement } from "./pages/seller/SellerOrderManagement";

// Admin Pages
import { AdminOverview } from "./pages/admin/AdminOverview";
import { GlobalProductManagement } from "./pages/admin/GlobalProductManagement";
import { GlobalOrderManagement } from "./pages/admin/GlobalOrderManagement";
import { CustomerDirectory } from "./pages/admin/CustomerDirectory";
import { SellerDirectory } from "./pages/admin/SellerDirectory";

function RoleBasedRouter() {
  const { user } = useOutletContext<{ user: User }>();

  if (user.role === "Buyer") {
    return (
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (user.role === "Seller") {
    return (
      <Routes>
        <Route path="/" element={<SellerOverview />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/orders" element={<SellerOrderManagement />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (user.role === "Admin") {
    return (
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/products" element={<GlobalProductManagement />} />
        <Route path="/orders" element={<GlobalOrderManagement />} />
        <Route path="/customers" element={<CustomerDirectory />} />
        <Route path="/sellers" element={<SellerDirectory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return <div>Unknown role</div>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/*" element={<RoleBasedRouter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
