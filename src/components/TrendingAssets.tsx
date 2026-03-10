import ProductCard from "./ProductCard";
import { TrendingUp } from "lucide-react";

const trendingProducts = [
  {
    title: "n8n Lead Gen Bot",
    category: "Automation",
    price: "49",
    rating: 4.8,
    reviews: 24,
    description: "Complete lead generation automation workflow for n8n with email sequences and CRM integration."
  },
  {
    title: "Llama 3 Local Setup Script",
    category: "AI Tools",
    price: "29",
    rating: 4.6,
    reviews: 18,
    description: "One-click setup script for running Llama 3 locally with optimized configurations."
  },
  {
    title: "Discord AI Agent",
    category: "Bots",
    price: "79",
    rating: 4.9,
    reviews: 31,
    description: "Advanced Discord bot with AI capabilities, moderation tools, and custom commands."
  }
];

export default function TrendingAssets() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-purple-400 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Trending Assets
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular digital assets that vibe coders are loving right now
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trendingProducts.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              category={product.category}
              price={product.price}
              rating={product.rating}
              reviews={product.reviews}
              description={product.description}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center mx-auto group">
            View all trending assets
            <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
