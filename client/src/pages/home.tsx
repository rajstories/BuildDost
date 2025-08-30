import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Github, FileText, Sparkles, Grid3X3 } from "lucide-react";
import Footer from "@/components/landing/footer";
import AIAssistant from "@/components/chat/ai-assistant";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";
import { LoadingSpinner, FullPageLoading } from "@/components/ui/loading-spinner";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const { isNavigating, navigateWithLoading } = useNavigationLoading();

  const handleStartBuilding = async () => {
    if (prompt.trim()) {
      // Navigate to generation page with the prompt
      await navigateWithLoading(`/generate?prompt=${encodeURIComponent(prompt)}`, 500);
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
      {/* Loading Overlay */}
      {isNavigating && <FullPageLoading text="Creating your app..." />}
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
                {/* Updated Orange Geometric Logo */}
                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {/* Clean Geometric Building Blocks */}
                  <div className="relative flex flex-col items-center justify-center space-y-0.5">
                    {/* Top Block - Triangle for dynamic building */}
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[3px] border-l-transparent border-r-transparent border-b-white"></div>
                    
                    {/* Middle Blocks - Squares for structure */}
                    <div className="flex space-x-0.5">
                      <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-white/80 rounded-sm"></div>
                    </div>
                    
                    {/* Base Block - Rectangle foundation */}
                    <div className="w-4 h-1 bg-white/90 rounded-sm"></div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/30 to-pink-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md scale-110"></div>
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight group-hover:text-orange-500 transition-colors duration-300">
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
              <Button 
                variant="ghost" 
                className="font-medium text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors" 
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-signin"
              >
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
                  disabled={isNavigating}
                  className={`group absolute right-3 top-3 h-14 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 ease-out ${
                    isNavigating ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0'
                  }`}
                  data-testid="button-start-building"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isNavigating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Sparkles className="relative mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  )}
                  <span className="relative">Build</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mb-8">
              <Button 
                onClick={() => navigateWithLoading('/templates')}
                variant="outline" 
                disabled={isNavigating}
                className={`group relative text-lg px-10 py-5 rounded-2xl border-2 border-white/80 bg-white backdrop-blur-xl text-gray-800 font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out ${
                  isNavigating ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-300/60 active:scale-[0.98] active:translate-y-0 transform -translate-y-0.5'
                }`}
                data-testid="button-choose-templates"
                style={{
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 10px 20px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50/30 to-purple-50/30 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                {isNavigating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Grid3X3 className="relative mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                )}
                <span className="relative">Choose Templates</span>
              </Button>
              <Button 
                onClick={() => navigateWithLoading('/showcase')}
                disabled={isNavigating}
                className={`group relative text-lg px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-600 to-blue-600 hover:from-purple-500 hover:via-purple-500 hover:to-blue-500 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 ease-out ${
                  isNavigating ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0'
                }`}
                data-testid="button-hackathon-demo"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {isNavigating ? (
                  <LoadingSpinner size="sm" />  
                ) : (
                  <Sparkles className="relative mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                )}
                <span className="relative">🏆 Hackathon Demo</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-pulse"></div>
              </Button>
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
      
      {/* AI Assistant - Hackathon Winning Feature */}
      <AIAssistant />
    </div>
  );
}
