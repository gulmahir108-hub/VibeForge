"use client";

import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getCurrentUser, signOut } from "@/utils/supabase/auth";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
            <span className="text-xl font-bold text-foreground">VibeForge</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-10 bg-muted/50 border-muted focus:bg-background"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/explore">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Explore
            </Button>
          </Link>
          <Link href="/sell">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Start Selling
            </Button>
          </Link>
          
          {loading ? (
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-foreground">{user.email}</span>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:bg-muted"
                  onClick={() => router.push('/profile')}
                >
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:bg-muted"
                  onClick={async () => {
                    try {
                      await signOut();
                      router.push('/login');
                    } catch (err) {
                      console.error('Error signing out:', err);
                    }
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
              <div className="container px-4 py-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    className="pl-10 bg-muted/50 border-muted focus:bg-background"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                      Explore
                    </Button>
                  </Link>
                  <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                      Start Selling
                    </Button>
                  </Link>
                
                  {loading ? (
                    <div className="h-8 w-8 bg-muted rounded-full animate-pulse mx-auto"></div>
                  ) : user ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 p-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm text-foreground">{user.email}</span>
                      </div>
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                        Profile
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
