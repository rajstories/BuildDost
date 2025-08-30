import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Github, FileText, Sparkles, Grid3X3 } from "lucide-react";
import Footer from "@/components/landing/footer";
import AIAssistant from "@/components/chat/ai-assistant";

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
      <main className="relative z-10 flex-1 flex items-center justify-center min-h-[85vh] py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            
            {/* Hackathon Badge */}
            <div className="mb-12">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Sparkles className="mr-2 h-4 w-4" />
                🏆 Hackathon Submission
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-foreground mb-8 leading-tight tracking-tight" data-testid="hero-title">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                BuildDost
              </span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-700 mb-6 leading-tight" data-testid="hero-subtitle">
              AI-Powered Full-Stack Website & Backend Builder
            </h2>
            
            {/* Description */}
            <p className="text-lg lg:text-xl text-slate-600 mb-16 max-w-4xl mx-auto font-medium leading-relaxed" data-testid="hero-description">
              The only platform that enables non-technical founders to create and deploy production-ready full-stack applications with zero coding knowledge
            </p>
            
            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
              <Link href="/showcase">
                <Button 
                  className="group relative text-lg px-12 py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 min-w-[200px]"
                  data-testid="button-try-demo"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Sparkles className="relative mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="relative">✨ Try Live Demo</span>
                </Button>
              </Link>
              
              <Link href="/builder">
                <Button 
                  variant="outline" 
                  className="group relative text-lg px-12 py-6 rounded-2xl border-2 border-slate-800 bg-transparent text-slate-800 font-bold shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:bg-slate-800 hover:text-white active:scale-[0.98] active:translate-y-0 min-w-[200px]"
                  data-testid="button-build-app"
                >
                  <Box className="relative mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="relative">🚀 Build Custom App</span>
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-black text-purple-600 mb-2">5</div>
                <div className="text-sm lg:text-base font-semibold text-slate-600">Game-Changing Features</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">0</div>
                <div className="text-sm lg:text-base font-semibold text-slate-600">Code Required</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-black text-green-600 mb-2">1-Click</div>
                <div className="text-sm lg:text-base font-semibold text-slate-600">Deployment</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-black text-orange-600 mb-2">Full</div>
                <div className="text-sm lg:text-base font-semibold text-slate-600">Code Ownership</div>
              </div>
            </div>

            {/* Hackathon Features Section */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-black text-slate-800 mb-8">
                Hackathon-Winning Features
              </h3>
              <p className="text-lg text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Five breakthrough innovations that set BuildDost apart from all competitors
              </p>
              
              {/* Quick Start Input */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative">
                  <Input
                    placeholder="Describe your app idea (e.g., Food delivery website with login and cart)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-16 text-lg font-medium pl-6 pr-32 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-slate-300 hover:shadow-lg shadow-md transition-all duration-300"
                    data-testid="input-build-prompt"
                  />
                  <Button
                    onClick={handleStartBuilding}
                    className="group absolute right-2 top-2 h-12 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-105 active:scale-[0.98]"
                    data-testid="button-start-building"
                  >
                    <Sparkles className="relative mr-2 h-4 w-4" />
                    <span className="relative">Build</span>
                  </Button>
                </div>
              </div>

              {/* Template Access */}
              <div className="flex justify-center">
                <Link href="/templates">
                  <Button 
                    variant="ghost" 
                    className="text-slate-600 hover:text-slate-800 font-semibold text-base"
                    data-testid="button-browse-templates"
                  >
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    or browse our professional templates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
      
      {/* AI Assistant - Hackathon Winning Feature */}
      <AIAssistant />
    </div>
  );
}
