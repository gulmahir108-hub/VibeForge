import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"></div>
      
      <div className="container relative mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-purple-400 mr-2" />
            <span className="text-purple-400 font-medium text-sm uppercase tracking-wider">
              Welcome to the Future
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-purple-200 to-pink-200 bg-clip-text text-transparent">
            The Ultimate Marketplace
            <br />
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Vibe Coders</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover, buy, and sell premium digital assets. From n8n automation workflows 
            to AI bots and cutting-edge web templates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg">
              Explore Assets
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-3 text-lg">
              Start Selling
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
