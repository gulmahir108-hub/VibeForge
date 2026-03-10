"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/utils/supabase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      router.push("/explore");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await signUp(email, password);
      router.push("/explore");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="h-12 w-12 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                VibeForge
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to access your account or create a new one to start selling.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-muted focus:bg-background"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/50 border-muted focus:bg-background pr-10"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
