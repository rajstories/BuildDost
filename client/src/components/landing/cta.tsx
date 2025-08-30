import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="cta-title">
            Ready to Build Your Dream App?
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="cta-description">
            Join thousands of builders who have brought their ideas to life with BuildDost. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/builder">
              <Button size="lg" className="glow-effect" data-testid="button-start-free">
                Start Building for Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" data-testid="button-book-demo">
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
