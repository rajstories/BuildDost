import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Box, Moon, RotateCcw, User, LogOut, Settings } from "lucide-react";
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
