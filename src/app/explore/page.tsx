"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

const categories = [
  "All Categories",
  "n8n Workflows", 
  "AI Agents",
  "Prompt Templates",
  "Game Scripts"
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || 
                           product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore Assets</h1>
          <p className="text-muted-foreground">
            Discover amazing digital assets created by the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-muted focus:bg-background"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex bg-muted/50 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                  : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} assets
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter</span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                category={product.category}
                price={product.price}
                rating={product.rating}
                reviews={product.reviews}
                description={product.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No digital assets found yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to sell your digital asset and start earning!
            </p>
            <Link href="/sell">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Start Selling
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
