import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function Storefront() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="bg-primary-accent rounded-2xl brutal-shadow p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
        <div className="z-10 max-w-xl">
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight leading-[1.1]">
            GOOD DESIGN.<br />BETTER FINDS.
          </h1>
          <p className="text-lg md:text-xl font-medium mb-8 max-w-md">
            Discover premium essentials curated for modern living. Uncompromising quality meets striking aesthetics.
          </p>
          <Link to="/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag size={20} />
              Shop Collection
            </Button>
          </Link>
        </div>
        <div className="hidden md:block w-72 h-72 rounded-full border-4 border-primary-text bg-surface-secondary skeu-shadow relative z-10 flex items-center justify-center p-8">
            <div className="text-center">
              <span className="block text-4xl font-bold font-heading">MERCH</span>
              <span className="block text-sm font-semibold mt-2 tracking-widest">EST. 2026</span>
            </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 border-[12px] border-primary-text rounded-full opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-20px] left-1/2 w-32 h-32 bg-primary-text rounded-full opacity-10 pointer-events-none"></div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-heading">Featured Categories</h2>
          <Link to="/products" className="font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Electronics", "Home", "Accessories"].map((category) => (
            <Link key={category} to={`/products?category=${category}`} className="group">
              <div className="h-48 bg-surface-secondary border-2 border-primary-text brutal-shadow rounded-xl flex items-end p-6 transition-all group-hover:-translate-y-2 group-hover:bg-primary-text group-hover:text-primary-bg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0 group-hover:opacity-0"></div>
                <h3 className="text-2xl font-bold font-heading relative z-10">{category}</h3>
                <div className="absolute top-4 right-4 bg-primary-accent w-10 h-10 rounded-full flex items-center justify-center text-primary-text opacity-0 group-hover:opacity-100 transition-opacity brutal-border">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="bg-surface-dark text-white rounded-2xl brutal-shadow p-8 md:p-12 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-primary-accent">MEMBER EXCLUSIVE</h2>
        <p className="text-lg mb-8 max-w-2xl">
          Sign in to your buyer account to access limited-time releases and curated drops before anyone else.
        </p>
        <Link to="/products">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            Explore Releases
          </Button>
        </Link>
      </section>
    </div>
  );
}
