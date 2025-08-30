import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, RotateCcw, User, LogOut, Settings, Layers, Globe, Hammer } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSignIn = () => {
    toast({
      title: "Redirecting",
      description: "Taking you to sign in...",
    });
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    toast({
      title: "Signing out",
      description: "See you later!",
    });
    window.location.href = "/api/logout";
  };

  const getInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer group" data-testid="logo-builddost">
              <div className="relative flex items-center">
                {/* Professional Website Builder Logo */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-all duration-500 border border-blue-500/20">
                  {/* Sophisticated Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-indigo-600/10"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]"></div>
                  
                  {/* Website Building Symbol - Layered Structure */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    {/* Website Layers representing building blocks */}
                    <div className="relative">
                      {/* Top layer - Header */}
                      <div className="w-6 h-1.5 bg-white rounded-sm mb-0.5 opacity-90 shadow-sm"></div>
                      {/* Middle layer - Content with Globe */}
                      <div className="relative w-7 h-2.5 bg-gradient-to-r from-white to-blue-100 rounded-sm flex items-center justify-center mb-0.5 shadow-sm">
                        <Globe className="w-2 h-2 text-blue-600" />
                      </div>
                      {/* Bottom layer - Footer */}
                      <div className="w-6 h-1 bg-white/80 rounded-sm opacity-90 shadow-sm"></div>
                      
                      {/* Building/Construction Symbol */}
                      <div className="absolute -top-1 -right-1">
                        <Hammer className="w-2.5 h-2.5 text-yellow-300 transform rotate-45" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium Glow Effects */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-transparent to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm scale-110"></div>
                  <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                </div>
                
                {/* Enhanced Typography */}
                <div className="ml-4 flex flex-col justify-center leading-none">
                  <div className="flex items-center">
                    <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent tracking-tight">
                      Build
                    </span>
                    <span className="text-2xl font-black bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-800 bg-clip-text text-transparent tracking-tight">
                      Dost
                    </span>
                    <div className="ml-1 w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-[9px] font-bold text-blue-600/60 tracking-[0.2em] uppercase mt-1 flex items-center">
                    <Layers className="w-2 h-2 mr-1" />
                    Website Builder
                  </div>
                </div>
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-chat">AI Chat</Link>
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
            
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" data-testid="loading-avatar" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={user.profileImageUrl || undefined} alt="Profile" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none" data-testid="user-name">
                      {user.firstName || user.lastName 
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground" data-testid="user-email">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer" data-testid="menu-profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full cursor-pointer" data-testid="menu-dashboard">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                    data-testid="menu-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                onClick={handleSignIn}
                data-testid="button-signin"
              >
                Sign In
              </Button>
            )}
            
            <Link href="/build">
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
