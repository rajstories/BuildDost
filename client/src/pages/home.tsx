import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Github, FileText, Sparkles } from "lucide-react";
import Footer from "@/components/landing/footer";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");

  const handleStartBuilding = () => {
    if (prompt.trim()) {
      // Navigate to builder with the prompt
      window.location.href = `/builder?prompt=${encodeURIComponent(prompt)}`;
    } else {
      window.location.href = "/builder";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStartBuilding();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Bolt.new Style Orbital Background */}
      <div className="fixed inset-0 -z-10">
        {/* Dark space background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
        
        {/* Orbital planetary curve effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[300vw] h-[150vh]">
          {/* Outer atmospheric glow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full rounded-t-full bg-gradient-to-t from-blue-600/20 via-blue-500/10 to-transparent blur-3xl"></div>
          
          {/* Main bright orbital line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-[90%] rounded-t-full border-t-[3px] border-blue-400/80"></div>
          
          {/* Bright inner glow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[85%] h-[85%] rounded-t-full border-t-[2px] border-blue-300/90"></div>
          
          {/* Core bright white line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-[80%] rounded-t-full border-t border-white/95"></div>
          
          {/* Intense glow effect */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-[90%] rounded-t-full bg-gradient-to-t from-blue-400/30 via-blue-300/20 to-transparent blur-2xl"></div>
        </div>
        
        {/* Additional bright atmospheric glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-500/25 via-blue-400/15 to-transparent"></div>
        
        {/* Extra bright center glow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-white/20 via-blue-200/30 to-transparent blur-xl"></div>
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
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 leading-tight tracking-tight" data-testid="hero-title">
              What should we build today?
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto font-medium" data-testid="hero-description">
              Create stunning apps & websites by chatting with AI.
            </p>
            
            {/* Large Input Field */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Input
                  placeholder="Type your idea and we'll build it together..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-16 text-lg font-medium pl-6 pr-20 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-sm"
                  data-testid="input-build-prompt"
                />
                <Button
                  onClick={handleStartBuilding}
                  className="absolute right-2 top-2 h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-sm"
                  data-testid="button-start-building"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build
                </Button>
              </div>
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
