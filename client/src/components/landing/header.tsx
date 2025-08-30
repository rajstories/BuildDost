import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Box, Moon, RotateCcw } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
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
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-features">Features</a>
            <a href="#builder" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-builder">Builder</a>
            <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-templates">Templates</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-pricing">Pricing</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" data-testid="button-theme-toggle">
              <Moon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-refresh">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" data-testid="button-signin">
              Sign In
            </Button>
            <Link href="/builder">
              <Button className="glow-effect" data-testid="button-get-started">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
