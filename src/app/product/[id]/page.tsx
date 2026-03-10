"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Download, 
  Star, 
  User, 
  Calendar, 
  FileText, 
  Shield,
  Heart,
  Share2,
  Loader2
} from "lucide-react";

// Mock product data - in a real app, this would come from an API
const productData: { [key: string]: any } = {
  "1": {
    id: "1",
    title: "n8n Lead Gen Bot",
    category: "n8n Workflows",
    price: "49",
    rating: 4.8,
    reviews: 24,
    description: "Complete lead generation automation workflow for n8n with email sequences and CRM integration. This comprehensive solution includes lead capture, scoring, automated follow-ups, and seamless CRM synchronization.",
    longDescription: `Transform your lead generation process with this powerful n8n automation workflow. This solution is designed to help businesses capture, nurture, and convert leads more efficiently.

## Key Features:
- **Lead Capture**: Automatically capture leads from multiple sources (webforms, social media, email)
- **Lead Scoring**: Intelligent scoring system based on engagement and demographics
- **Email Sequences**: Automated personalized email campaigns
- **CRM Integration**: Seamless integration with popular CRM platforms
- **Real-time Notifications**: Instant alerts for high-priority leads
- **Analytics Dashboard**: Comprehensive reporting and insights

## What's Included:
- Complete n8n workflow template
- Email template library (20+ templates)
- CRM integration guides
- Setup documentation
- Video tutorials
- Priority support

## Technical Specifications:
- Compatible with n8n v1.0+
- Supports 15+ CRM platforms
- REST API integrations
- Webhook support
- Custom field mapping
- Error handling and retry logic

Perfect for small businesses, marketing agencies, and sales teams looking to automate their lead generation process.`,
    author: {
      name: "Alex Thompson",
      avatar: "AT",
      rating: 4.9,
      totalProducts: 12,
      joinedDate: "January 2024"
    },
    features: [
      "Automated lead capture",
      "Email sequence automation", 
      "CRM integration",
      "Lead scoring system",
      "Real-time notifications",
      "Analytics dashboard"
    ],
    requirements: [
      "n8n v1.0 or higher",
      "CRM account (recommended)",
      "Email service provider",
      "Basic technical knowledge"
    ],
    fileSize: "2.4 MB",
    fileType: "JSON Workflow",
    lastUpdated: "2 days ago",
    downloads: 1247,
    tags: ["automation", "lead generation", "n8n", "crm", "email marketing"]
  },
  "2": {
    id: "2",
    title: "Llama 3 Local Setup Script",
    category: "AI Agents",
    price: "29",
    rating: 4.6,
    reviews: 18,
    description: "One-click setup script for running Llama 3 locally with optimized configurations.",
    longDescription: "Get Llama 3 running locally on your machine with this optimized setup script. Includes all necessary dependencies and configurations for optimal performance.",
    author: {
      name: "Sarah Chen",
      avatar: "SC",
      rating: 4.7,
      totalProducts: 8,
      joinedDate: "March 2024"
    },
    features: ["One-click setup", "Optimized configurations", "Dependency management", "Performance tuning"],
    requirements: ["Python 3.8+", "8GB RAM minimum", "GPU recommended"],
    file_size: "1.2 MB",
    file_type: "Python Script",
    last_updated: "1 week ago",
    downloads: 892,
    tags: ["AI", "Llama 3", "local setup", "optimization"]
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const product = productData[productId] || productData["1"]; // Fallback to product 1

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          title: product.title,
          price: product.price,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data.error);
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would handle the download
    alert("Download would start here");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-foreground">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.title}</h1>
              
              <p className="text-lg text-muted-foreground mb-6">{product.description}</p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Buy & Download - ${product.price}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  {isLiked ? "Saved" : "Save"}
                </Button>
                <Button variant="ghost" className="text-muted-foreground">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Product Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{product.downloads}</div>
                    <div className="text-sm text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{product.fileSize}</div>
                    <div className="text-sm text-muted-foreground">File Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{product.fileType}</div>
                    <div className="text-sm text-muted-foreground">File Type</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{product.lastUpdated}</div>
                    <div className="text-sm text-muted-foreground">Last Updated</div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mb-6">
                  <h3 className="font-medium text-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Long Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
                <div className="prose prose-invert max-w-none">
                  {product.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="text-muted-foreground mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <div className="h-2 w-2 bg-purple-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {product.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-400 mr-3" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Author</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {product.author.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{product.author.name}</div>
                    <div className="text-sm text-muted-foreground">Member since {product.author.joinedDate}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="text-foreground">{product.author.rating} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products</span>
                    <span className="text-foreground">{product.author.totalProducts}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
