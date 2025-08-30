import { Palette, Brain, Server, Eye, Cloud, Download } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Visual Builder",
    description: "Drag and drop components to build your app visually. No coding required.",
  },
  {
    icon: Brain,
    title: "AI Code Generation",
    description: "Describe what you want and watch AI generate production-ready code instantly.",
  },
  {
    icon: Server,
    title: "Backend APIs",
    description: "Generate complete backend APIs, databases, and authentication flows automatically.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your changes instantly with real-time preview across all devices.",
  },
  {
    icon: Cloud,
    title: "One-Click Deploy",
    description: "Deploy your app to production with a single click using Vercel, Render, or Supabase.",
  },
  {
    icon: Download,
    title: "Export Code",
    description: "Download your complete source code and own your project fully.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="features-title">
            Everything You Need to Build & Deploy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="features-description">
            From design to deployment, BuildDost provides all the tools you need to bring your ideas to life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="glass-effect rounded-xl p-6 hover:glow-effect transition-all duration-300"
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary-foreground" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
