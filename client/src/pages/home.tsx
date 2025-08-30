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
    <div className="min-h-screen bg-background text-foreground">
      {/* Background with subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_50%)]"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer" data-testid="logo-builddost">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Box className="text-primary-foreground text-sm" size={16} />
                </div>
                <span className="text-xl font-bold text-foreground">BuildDost</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-community">Community</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-enterprise">Enterprise</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-resources">Resources</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-careers">Careers</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-pricing">Pricing</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" data-testid="button-signin">
                Sign In
              </Button>
              <Link href="/builder">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium" data-testid="button-get-started">
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
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="hero-title">
              What should we build today?
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto" data-testid="hero-description">
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
                  className="h-16 text-lg pl-6 pr-20 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  data-testid="input-build-prompt"
                />
                <Button
                  onClick={handleStartBuilding}
                  className="absolute right-2 top-2 h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
                  data-testid="button-start-building"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build
                </Button>
              </div>
            </div>

            {/* Import Options */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <span>or import from</span>
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 hover:text-foreground transition-colors" data-testid="import-figma">
                  <FileText className="h-4 w-4" />
                  <span>Figma</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-foreground transition-colors" data-testid="import-github">
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
