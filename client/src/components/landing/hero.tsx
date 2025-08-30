import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Rocket, Play, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="hero-title">
            Don't just think it, 
            <span className="text-primary"> Build</span> it.
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="hero-description">
            Turn any idea into a beautiful, working full-stack app in seconds. 
            No coding required. AI-powered. Production-ready.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/builder">
              <Button size="lg" className="glow-effect" data-testid="button-start-building">
                <Rocket className="mr-2 h-4 w-4" />
                Start Building
              </Button>
            </Link>
            <Button variant="outline" size="lg" data-testid="button-watch-demo">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center" data-testid="feature-no-code">
              <Check className="text-primary mr-2 h-4 w-4" />
              No Code Required
            </div>
            <div className="flex items-center" data-testid="feature-ai-powered">
              <Check className="text-primary mr-2 h-4 w-4" />
              AI-Powered
            </div>
            <div className="flex items-center" data-testid="feature-one-click-deploy">
              <Check className="text-primary mr-2 h-4 w-4" />
              One-Click Deploy
            </div>
            <div className="flex items-center" data-testid="feature-full-stack">
              <Check className="text-primary mr-2 h-4 w-4" />
              Full Stack
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
