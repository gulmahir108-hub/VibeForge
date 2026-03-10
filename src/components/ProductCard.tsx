"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart, Star, Loader2 } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: string;
  rating?: number;
  reviews?: number;
  description?: string;
}

export default function ProductCard({ 
  id, 
  title, 
  category, 
  price, 
  rating = 4.5, 
  reviews = 12,
  description 
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      console.log("Data being sent to Stripe:", { id, title, price });
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: String(id), 
          title: String(title), 
          price: Number(price) 
        })
      });

      const responseData = await res.json();
      
      if (responseData.url) {
        window.location.href = responseData.url;
      } else {
        console.error('Checkout failed:', responseData.error);
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 bg-card border-border/50 cursor-pointer">
      <CardHeader className="p-4">
        <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
          <div className="h-12 w-12 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
        </div>
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit text-xs">
            {category}
          </Badge>
          <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </CardHeader>
        
      <CardContent className="p-4 pt-0">
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {rating} ({reviews} reviews)
          </span>
        </div>
      </CardContent>
        
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-2xl font-bold text-foreground">
          ${price}
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
