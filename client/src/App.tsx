import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/common/theme-provider";
import HomePage from "@/pages/home";
import GeneratePage from "@/pages/generate";
import PreviewPage from "@/pages/preview";
import BuilderPage from "@/pages/builder";
import DashboardPage from "@/pages/dashboard";
import TemplatesPage from "@/pages/templates";
import ShowcasePage from "@/pages/showcase";
import NotFound from "@/pages/not-found";

// Import template showcases
import LandingPageTemplate from "@/templates/landing-page";
import PortfolioTemplate from "@/templates/portfolio";
import EcommerceTemplate from "@/templates/ecommerce";
import BlogTemplate from "@/templates/blog";
import DashboardTemplate from "@/templates/dashboard";
import TaskManagerTemplate from "@/templates/task-manager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/showcase" component={ShowcasePage} />
      <Route path="/generate" component={GeneratePage} />
      <Route path="/preview" component={PreviewPage} />
      <Route path="/builder" component={BuilderPage} />
      <Route path="/builder/:id" component={BuilderPage} />
      <Route path="/dashboard" component={DashboardPage} />
      
      {/* Template Showcases */}
      <Route path="/template/landing" component={LandingPageTemplate} />
      <Route path="/template/portfolio" component={PortfolioTemplate} />
      <Route path="/template/ecommerce" component={EcommerceTemplate} />
      <Route path="/template/blog" component={BlogTemplate} />
      <Route path="/template/dashboard" component={DashboardTemplate} />
      <Route path="/template/todo" component={TaskManagerTemplate} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="builddost-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
