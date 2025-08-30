import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Github, FileText, Sparkles, Grid3X3 } from "lucide-react";
import Footer from "@/components/landing/footer";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");

  const handleStartBuilding = () => {
    if (prompt.trim()) {
      // Navigate to generation page with the prompt
      window.location.href = `/generate?prompt=${encodeURIComponent(prompt)}`;
    } else {
      // Require a prompt for generation
      alert('Please describe your app idea first!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStartBuilding();
    }
  };

  return (
    <div className="min-h-screen text-foreground overflow-hidden">
      {/* Synchronized Patch Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base dark background */}
        <div className="absolute inset-0 bg-slate-950"></div>
        
        {/* Strategic color patches */}
        {/* Top-right blue patch */}
        <div className="absolute top-0 right-0 w-96 h-64 bg-gradient-to-br from-blue-600/20 to-transparent rounded-bl-[100px] blur-2xl"></div>
        
        {/* Top-left white patch */}
        <div className="absolute top-20 left-0 w-80 h-40 bg-gradient-to-r from-white/8 to-transparent rounded-r-[80px] blur-xl"></div>
        
        {/* Center-right slate patch */}
        <div className="absolute top-1/2 right-20 w-72 h-48 bg-gradient-to-l from-slate-600/15 to-transparent rounded-l-[60px] blur-lg"></div>
        
        {/* Bottom-left blue patch */}
        <div className="absolute bottom-32 left-0 w-64 h-56 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-tr-[80px] blur-2xl"></div>
        
        {/* Bottom-center white patch */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-white/6 to-transparent rounded-t-[100px] blur-xl"></div>
        
        {/* Synchronized geometric highlights */}
        <div className="absolute top-1/4 left-1/4 w-2 h-20 bg-white/20 rounded-full blur-sm transform rotate-45"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-16 bg-blue-400/30 rounded-full blur-sm transform -rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-12 bg-slate-300/25 rounded-full blur-sm transform rotate-30"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group" data-testid="logo-builddost">
                <div className="relative w-10 h-10">
                  {/* Gradient background with subtle glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl shadow-lg group-hover:shadow-primary/25 transition-all duration-300"></div>
                  {/* Inner gradient overlay */}
                  <div className="absolute inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-[10px]"></div>
                  {/* Logo symbol */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                      <path 
                        d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" 
                        fill="currentColor" 
                        fillOpacity="0.9"
                      />
                      <path 
                        d="M9 22V12H15V22" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <circle cx="12" cy="8" r="1.5" fill="currentColor" fillOpacity="0.7"/>
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                  BuildDost
                </span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-muted-foreground/70 hover:text-foreground transition-colors font-medium text-sm" data-testid="nav-community">Community</a>
              <a href="#" className="text-muted-foreground/70 hover:text-foreground transition-colors font-medium text-sm" data-testid="nav-enterprise">Enterprise</a>
              <a href="#" className="text-muted-foreground/70 hover:text-foreground transition-colors font-medium text-sm" data-testid="nav-resources">Resources</a>
              <a href="#" className="text-muted-foreground/70 hover:text-foreground transition-colors font-medium text-sm" data-testid="nav-careers">Careers</a>
              <a href="#" className="text-muted-foreground/70 hover:text-foreground transition-colors font-medium text-sm" data-testid="nav-pricing">Pricing</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="font-medium text-sm" data-testid="button-signin">
                Sign In
              </Button>
              <Link href="/builder">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm" data-testid="button-get-started">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 leading-tight tracking-tight whitespace-nowrap" data-testid="hero-title">
              What should we build today?
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto font-medium" data-testid="hero-description">
              Create stunning apps & websites by chatting with AI.
            </p>
            
            {/* Large Input Field */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <Input
                  placeholder="Describe your app idea (e.g., Food delivery website with login and cart)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-20 text-lg font-medium pl-8 pr-32 rounded-2xl border-border/40 bg-white/95 backdrop-blur-md text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-border/60 hover:bg-white hover:shadow-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                  data-testid="input-build-prompt"
                />
                <Button
                  onClick={handleStartBuilding}
                  className="absolute right-3 top-3 h-14 px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  data-testid="button-start-building"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Build
                </Button>
              </div>
            </div>

            {/* Choose Templates Button */}
            <div className="mb-8">
              <Link href="/templates">
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-4 rounded-2xl border-border/40 bg-white/50 backdrop-blur-md hover:bg-white/80 hover:shadow-lg transition-all duration-300 group"
                  data-testid="button-choose-templates"
                >
                  <Grid3X3 className="mr-2 h-5 w-5" />
                  Choose Templates
                </Button>
              </Link>
            </div>

            {/* Import Options */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground/60">
              <span className="font-medium">or import from</span>
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 hover:text-foreground transition-colors font-medium" data-testid="import-figma">
                  <FileText className="h-4 w-4" />
                  <span>Figma</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-foreground transition-colors font-medium" data-testid="import-github">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
