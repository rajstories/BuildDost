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
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
              Choose Your Template
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
              Start with a professionally designed template and customize it with AI. 
              Build everything from landing pages to full applications in minutes.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
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
                  className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  data-testid={`template-${template.id}`}
                >
                  {/* Template Preview Area with Relevant Images */}
                  <div className="h-48 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {/* Template-specific visual representation */}
                    {template.id === 'landing' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-2">🏢</div>
                          <div className="text-sm font-semibold">Business Website</div>
                        </div>
                      </div>
                    )}
                    
                    {template.id === 'portfolio' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-2">🎨</div>
                          <div className="text-sm font-semibold">Creative Portfolio</div>
                        </div>
                      </div>
                    )}
                    
                    {template.id === 'ecommerce' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-2">🛒</div>
                          <div className="text-sm font-semibold">Online Store</div>
                        </div>
                      </div>
                    )}
                    
                    {template.id === 'blog' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-2">📝</div>
                          <div className="text-sm font-semibold">Blog & News</div>
                        </div>
                      </div>
                    )}
                    
                    {template.id === 'dashboard' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-2">📊</div>
                          <div className="text-sm font-semibold">Analytics Dashboard</div>
                        </div>
                      </div>
                    )}
                    
                    {template.id === 'todo' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-6xl mb-2">✅</div>
                          <div className="text-sm font-semibold">Task Manager</div>
                        </div>
                      </div>
                    )}

                    {/* Popular Badge */}
                    {template.popular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-500 font-semibold">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Popular
                        </Badge>
                      </div>
                    )}

                    {/* Hover Preview */}
                    <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                      hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <Button 
                        onClick={() => handleCreateFromTemplate(template.id, template.title)}
                        className="group/create bg-white text-gray-900 hover:bg-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 px-6 py-3"
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
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 border border-gray-200 font-medium text-xs ml-3">
                        {template.category}
                      </Badge>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => handleCreateFromTemplate(template.id, template.title)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group/btn"
                      data-testid={`button-${template.id}`}
                    >
                      <span className="relative">Start Building</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Prompt Option */}
          <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Need Something Custom?
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Don't see what you're looking for? Describe your unique app idea and let AI build it for you.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                const customPrompt = prompt("Describe your custom app idea:");
                if (customPrompt) {
                  window.location.href = `/generate?prompt=${encodeURIComponent(customPrompt)}`;
                }
              }}
              className="group px-8 py-4 rounded-xl border-2 border-blue-600 bg-white text-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white"
              data-testid="button-custom-prompt"
            >
              <Sparkles className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              <span>Describe Custom App</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </main>
      
      {/* AI Assistant - Available everywhere */}
      <AIAssistant />
    </div>
  );
}