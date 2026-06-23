"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoginGuard } from "@/components/auth-guard";
import { useParentAuth } from "@/context/parent-auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useParentAuth();
  
  // Pre-fill demo credentials by default
  const [email, setEmail] = useState("reena.sharma@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate authentication check delay so the user sees the spinner loader
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const result = await login(email, password);

      if (!result.success) {
        setError(result.message || "Login failed");
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message || "Invalid credentials.",
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome to NoteSwift Parents Portal!",
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError("An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginGuard>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6">
        {/* Decorative Geometric Elements */}
        {/* Top-left corner - Line box (half rectangle outline) */}
        <div className="hidden md:block absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 border-[8px] md:border-[12px] border-blue-200/50 rounded-br-[80px] md:rounded-br-[120px]"></div>
        
        {/* Bottom-right corner - Filled box */}
        <div className="hidden md:block absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tl from-blue-200/40 to-blue-100/20 rounded-tl-[100px] md:rounded-tl-[140px]"></div>
        
        {/* Additional subtle decorative elements */}
        <div className="hidden lg:block absolute top-32 right-32 w-48 h-48 border-[6px] border-blue-100/40 rounded-full"></div>
        <div className="hidden lg:block absolute bottom-40 left-40 w-40 h-40 bg-blue-100/30 rounded-2xl rotate-12"></div>

        {/* Centered Login Container */}
        <div className="relative z-10 w-full max-w-[440px] space-y-8">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-300">
              <Image src="/assets/logo.png" alt="NoteSwift Logo" width={60} height={60} className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Parent's Portal</h1>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1 px-4">Keep track of your child's academic journey and stay connected.</p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-gray-300 rounded-2xl">
            <CardHeader className="text-center pb-2 pt-8 px-6 sm:px-8 space-y-2">
              <CardTitle className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Sign in to your account</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
                Sign in to access your NoteSwift parent dashboard.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-8 px-6 sm:px-8">
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Email Address Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                
                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold text-gray-700">Password</Label>
                    <button
                      type="button"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      onClick={() => {
                        toast({
                          title: "Forgot Password",
                          description: "Password reset instructions would be sent to your email. (Demo only)",
                        });
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="h-12 pr-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>

                {/* Demo Credentials Info Note */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 space-y-1.5">
                  <p className="font-bold flex items-center gap-1">
                    <span>💡</span> Demo Login Credentials (Prefilled)
                  </p>
                  <p className="font-mono bg-white/60 p-2 rounded-lg border border-blue-100 leading-relaxed text-[11px] font-semibold">
                    Email: reena.sharma@example.com <br />
                    Password: password123
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-600 flex items-center gap-2">
                      <span className="text-red-500">⚠</span> {error}
                    </p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full font-bold text-xs sm:text-sm h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border border-blue-600" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Copyright Watermark */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 font-semibold">
              © {new Date().getFullYear()} Note Swift. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </LoginGuard>
  );
}
