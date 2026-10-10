# MERCH — Premium E-Commerce Management Platform

MERCH is a complete frontend-only e-commerce management website designed with a blend of Skeuomorphism, Brutalism, and Minimalism. It simulates a fully functional storefront and management back-office without requiring a backend server.

## Overview

This project implements a multi-role e-commerce platform based on a Java application data model (`ProductDAO`, `OrderDAO`, `Order`). The frontend perfectly mirrors these data structures and simulates all business logic (order processing, stock validation, inventory management) strictly on the client side using LocalStorage for persistence.

## Technologies Used

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS 4**
* **React Router v7**
* **Lucide React** (Icons)
* **LocalStorage** (Simulated Database)

## Features

* **Three Distinct Demo Roles**:
  * **Buyer**: Browse catalog, add to cart, checkout, view order history.
  * **Seller**: Manage inventory, fulfill orders, view performance metrics.
  * **Admin**: Oversee the entire platform, manage all products and orders.
* **Persistent Local Data**: Uses `localStorage` to save mock data. If you refresh the page, your inventory changes and orders are preserved.
* **Responsive Design**: fully functional on desktop, tablet, and mobile.
* **Design System**: Unique aesthetics featuring thick borders (Brutalism), soft inset shadows (Skeuomorphism), and generous spacing (Minimalism).

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Architecture & Future Backend Integration

The application is structured to easily integrate with the original Java backend when ready.

* **Services Layer (`src/services/*`)**: All data access and business logic goes through dedicated services (`productService`, `orderService`). Right now, they talk to `storageService` (LocalStorage). To connect to a real backend, you simply swap the implementation inside these services to make `fetch()` or `axios` calls to your Java REST API, leaving the UI components completely untouched.
* **Models (`src/types/index.ts`)**: The TypeScript interfaces `Product`, `Order`, and `User` strictly mirror the Java classes. The `Order` model maps 1:1 with a single product purchase. Multi-product carts are split into individual orders to maintain compatibility.

## Limitations

Because this is a frontend-only demonstration:
* **Concurrency**: Simulated checkouts cannot prevent race conditions if multiple users attempt to purchase the last remaining stock simultaneously across different devices. Proper atomic database transactions are required in the Java backend.
* **Authentication**: There is no real login. The topbar includes a role-switcher dropdown to instantly preview the application from the perspective of different predefined mock users.
* **Payments**: The checkout process simply validates stock and deducts inventory. No real financial processing occurs.

## Available Routes

### Buyer (`role: "Buyer"`)
* `/` - Storefront Hero
* `/products` - Product Catalog with search and filters
* `/cart` - Shopping Cart and Checkout
* `/orders` - Buyer Order History

### Seller (`role: "Seller"`)
* `/` - Seller Analytics Overview
* `/inventory` - Seller Product Management (Create, Edit, Delete, Stock update)
* `/orders` - Fulfillment Dashboard (Placed → Packed → Shipped → Delivered)

### Admin (`role: "Admin"`)
* `/` - Global Platform Metrics
* `/products` - Global Product Management
* `/orders` - Global Order Management
* `/customers` - Customer Directory
* `/sellers` - Seller Directory
