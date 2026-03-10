import { Github, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <span className="text-xl font-bold text-foreground">VibeForge</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The ultimate marketplace for vibe coders to buy and sell digital assets.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Marketplace</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-foreground transition-colors">Explore Assets</button></li>
              <li><button className="hover:text-foreground transition-colors">Top Sellers</button></li>
              <li><button className="hover:text-foreground transition-colors">Categories</button></li>
              <li><button className="hover:text-foreground transition-colors">New Releases</button></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Sell</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-foreground transition-colors">Start Selling</button></li>
              <li><button className="hover:text-foreground transition-colors">Seller Guide</button></li>
              <li><button className="hover:text-foreground transition-colors">Pricing</button></li>
              <li><button className="hover:text-foreground transition-colors">Success Stories</button></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-foreground transition-colors">Help Center</button></li>
              <li><button className="hover:text-foreground transition-colors">Contact Us</button></li>
              <li><button className="hover:text-foreground transition-colors">Terms of Service</button></li>
              <li><button className="hover:text-foreground transition-colors">Privacy Policy</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 VibeForge. All rights reserved. Built with ❤️ for vibe coders.
          </p>
        </div>
      </div>
    </footer>
  );
}
