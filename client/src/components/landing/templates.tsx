import { Button } from "@/components/ui/button";

const templates = [
  {
    id: "1",
    name: "SaaS Landing",
    description: "Modern SaaS product landing page",
    category: "landing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "2",
    name: "E-commerce Store",
    description: "Complete online store solution",
    category: "ecommerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "3",
    name: "Portfolio",
    description: "Creative portfolio showcase",
    category: "portfolio",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
  },
  {
    id: "4",
    name: "Blog",
    description: "Content-rich blog platform",
    category: "blog",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
  },
];

export default function Templates() {
  return (
    <section id="templates" className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="templates-title">
            Start with Templates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="templates-description">
            Jump-start your project with our professionally designed templates.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="glass-effect rounded-xl overflow-hidden hover:glow-effect transition-all duration-300 cursor-pointer"
              data-testid={`template-${template.id}`}
            >
              {/* Template preview */}
              <img 
                src={template.image} 
                alt={`${template.name} Template`} 
                className="w-full h-32 object-cover"
                data-testid={`template-image-${template.id}`}
              />
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1" data-testid={`template-name-${template.id}`}>
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`template-description-${template.id}`}>
                  {template.description}
                </p>
                <Button 
                  className="w-full glow-effect" 
                  size="sm"
                  data-testid={`button-use-template-${template.id}`}
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
