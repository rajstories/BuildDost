import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  ShoppingCart, 
  User, 
  FileText, 
  BarChart3, 
  CheckSquare,
  Sparkles,
  ArrowRight,
  Star,
  ArrowLeft
} from "lucide-react";
import AIAssistant from "@/components/chat/ai-assistant";

const templates = [
  {
    id: "landing",
    title: "Landing Page",
    description: "Professional business websites with modern design",
    icon: Briefcase,
    gradient: "from-blue-600 to-cyan-600",
    category: "Business",
    features: ["Responsive Design", "Contact Forms", "SEO Optimized"],
    popular: true
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Showcase your work with beautiful portfolio sites",
    icon: User,
    gradient: "from-purple-600 to-pink-600",
    category: "Creative",
    features: ["Project Gallery", "About Section", "Contact Info"],
    popular: true
  },
  {
    id: "ecommerce",
    title: "E-commerce Store",
    description: "Full-featured online stores with shopping cart",
    icon: ShoppingCart,
    gradient: "from-green-600 to-emerald-600",
    category: "Business",
    features: ["Product Catalog", "Shopping Cart", "Checkout"],
    popular: false
  },
  {
    id: "blog",
    title: "Blog",
    description: "Content-rich blogs and news websites",
    icon: FileText,
    gradient: "from-orange-600 to-red-600",
    category: "Content",
    features: ["Article Management", "Categories", "Comments"],
    popular: false
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Admin panels and analytics dashboards",
    icon: BarChart3,
    gradient: "from-indigo-600 to-blue-600",
    category: "Business",
    features: ["Data Visualization", "User Management", "Reports"],
    popular: false
  },
  {
    id: "todo",
    title: "Task Manager",
    description: "Productivity apps and task management tools",
    icon: CheckSquare,
    gradient: "from-teal-600 to-green-600",
    category: "Productivity",
    features: ["Task Lists", "Progress Tracking", "Due Dates"],
    popular: false
  }
];

const categories = ["All", "Business", "Creative", "Content", "Productivity"];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleCreateFromTemplate = (templateId: string, title: string) => {
    // Navigate to generation page with template-specific prompt
    const prompt = `Create a ${title.toLowerCase()} website`;
    window.location.href = `/generate?prompt=${encodeURIComponent(prompt)}&type=${templateId}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group" data-testid="logo-builddost">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl shadow-lg group-hover:shadow-primary/25 transition-all duration-300"></div>
                  <div className="absolute inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-[10px]"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                      <path 
                        d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" 
                        fill="currentColor" 
                        fillOpacity="0.9"
                      />
                      <path 
                        d="M9 22V12H15V22" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <circle cx="12" cy="8" r="1.5" fill="currentColor" fillOpacity="0.7"/>
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                  BuildDost
                </span>
              </div>
            </Link>

            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Template Gallery Section */}
      <main className="py-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight tracking-tight" data-testid="hero-title">
              Choose Your Template
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground/80 mb-8 max-w-3xl mx-auto font-medium" data-testid="hero-description">
              Start with a professionally designed template and customize it with AI. 
              Build everything from landing pages to full applications in minutes.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-muted/50 backdrop-blur-sm rounded-xl p-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                  data-testid={`filter-${category.toLowerCase()}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <div
                  key={template.id}
                  className="group relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden hover:shadow-2xl hover:border-border transition-all duration-300 hover:scale-[1.02]"
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  data-testid={`template-${template.id}`}
                >
                  {/* Template Preview Area */}
                  <div className={`h-48 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Icon */}
                    <div className="absolute top-6 left-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Popular Badge */}
                    {template.popular && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      </div>
                    )}

                    {/* Hover Preview */}
                    <div className={`absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                      hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <Button 
                        onClick={() => handleCreateFromTemplate(template.id, template.title)}
                        className="group/create bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 border-2 border-white/50 hover:border-white"
                        data-testid={`create-${template.id}`}
                      >
                        <Sparkles className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/create:rotate-12 group-hover/create:scale-110" />
                        <span>Create Now</span>
                      </Button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-muted rounded-lg text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => handleCreateFromTemplate(template.id, template.title)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 group/btn"
                      data-testid={`button-${template.id}`}
                    >
                      <span className="relative">Start Building</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Prompt Option */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              Don't see what you're looking for?
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                const customPrompt = prompt("Describe your custom app idea:");
                if (customPrompt) {
                  window.location.href = `/generate?prompt=${encodeURIComponent(customPrompt)}`;
                }
              }}
              className="group relative px-8 py-4 rounded-2xl border-2 border-gray-200/60 bg-white/70 backdrop-blur-xl text-gray-700 font-semibold shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:bg-white hover:border-purple-300/60 active:scale-[0.98] active:translate-y-0"
              data-testid="button-custom-prompt"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Sparkles className="relative h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="relative">Describe Custom App</span>
              <ArrowRight className="relative h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            </Button>
          </div>
        </div>
      </main>
      
      {/* AI Assistant - Available everywhere */}
      <AIAssistant />
    </div>
  );
}