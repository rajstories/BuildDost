import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  MessageCircle, 
  Upload, 
  Rocket, 
  Database, 
  Palette, 
  Trophy,
  Star,
  ArrowRight,
  Code,
  Zap,
  CheckCircle
} from "lucide-react";
import AIAssistant from "@/components/chat/ai-assistant";
import CodeUpload from "@/components/features/code-upload";
import OneClickDeploy from "@/components/features/one-click-deploy";
import DatabaseVisualizer from "@/components/features/database-visualizer";

export default function ShowcasePage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const hackathonFeatures = [
    {
      id: "ai-assistant",
      title: "AI Chat Assistant",
      description: "Real-time development help with intelligent code suggestions and guidance",
      icon: MessageCircle,
      highlights: ["Context-aware assistance", "Code generation", "Real-time suggestions", "24/7 availability"],
      badge: "🏆 Judge Favorite"
    },
    {
      id: "code-upload",
      title: "Code to Component Converter", 
      description: "Upload any code snippet and automatically convert it into a visual React component",
      icon: Upload,
      highlights: ["Any language support", "Visual component output", "Instant conversion", "Production-ready code"],
      badge: "🚀 Innovation Award"
    },
    {
      id: "one-click-deploy",
      title: "One-Click Deployment",
      description: "Deploy full-stack applications to production with zero configuration",
      icon: Rocket,
      highlights: ["Zero configuration", "SSL certificates", "Global CDN", "Automatic scaling"],
      badge: "⚡ Technical Excellence"
    },
    {
      id: "database-visualizer",
      title: "Database Schema Visualizer",
      description: "Design database schemas visually and generate production-ready code",
      icon: Database,
      highlights: ["Visual schema design", "Auto-generated code", "Relationship mapping", "Migration scripts"],
      badge: "🎯 Best UX"
    },
    {
      id: "visual-builder",
      title: "Enhanced Visual Builder",
      description: "Drag-and-drop canvas with 50+ professional components",
      icon: Palette,
      highlights: ["50+ components", "Real-time preview", "Responsive design", "Custom styling"],
      badge: "✨ Design Award"
    }
  ];

  const competitiveAdvantages = [
    {
      title: "No-Code + Full Code Ownership",
      description: "Unlike Webflow/Framer, users get complete frontend and backend code",
      icon: Code
    },
    {
      title: "End-to-End Solution",
      description: "Unlike v0/Bolt, we handle database, deployment, and full-stack architecture",
      icon: Zap
    },
    {
      title: "Non-Technical Friendly", 
      description: "Zero coding knowledge required, but developers can extend freely",
      icon: Star
    },
    {
      title: "Production Ready",
      description: "Generated code follows best practices and is deployment-ready",
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">BuildDost</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/templates" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Templates</Link>
              <Link href="/builder" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Builder</Link>
              <Badge className="bg-purple-100 text-purple-700 font-semibold">
                <Trophy className="h-3 w-3 mr-1" />
                Hackathon Demo
              </Badge>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-indigo-600/5"></div>
        <div className="container mx-auto px-6 relative z-10">
          
          {/* Hackathon Badge */}
          <div className="mb-8">
            <Badge className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Trophy className="h-5 w-5 mr-2" />
              🏆 Official Hackathon Submission
            </Badge>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BuildDost
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700 mb-6 leading-tight">
            AI-Powered Full-Stack Website & Backend Builder
          </h2>
          
          {/* Professional Description */}
          <p className="text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The only platform that enables non-technical founders to create and deploy 
            <span className="text-purple-600 font-semibold"> production-ready full-stack applications</span> with 
            <span className="text-blue-600 font-semibold"> zero coding knowledge</span>
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <Link href="/templates">
              <Button className="group px-10 py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[220px]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="relative mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative">✨ Try Live Demo</span>
              </Button>
            </Link>
            
            <Link href="/builder">
              <Button variant="outline" className="group px-10 py-6 text-lg font-bold border-2 border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[220px]">
                <Code className="relative mr-3 h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative">🚀 Build Custom App</span>
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm font-medium text-gray-600">Game-Changing Features</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm font-medium text-gray-600">Code Required</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">1-Click</div>
              <div className="text-sm font-medium text-gray-600">Deployment</div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-orange-600 mb-2">Full</div>
              <div className="text-sm font-medium text-gray-600">Code Ownership</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Features */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Hackathon-Winning Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Five breakthrough innovations that set BuildDost apart from all competitors
            </p>
            <div className="mt-6 w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 lg:gap-10">
            {hackathonFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border-0 shadow-lg hover:shadow-purple-200/50"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 font-semibold text-xs px-3 py-1">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <div className="space-y-3 mb-6">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    >
                      <span className="mr-2">Try This Feature</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-24 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Why BuildDost Wins
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our unique approach solves problems that existing solutions can't address
            </p>
            <div className="mt-6 w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {competitiveAdvantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <div key={index} className="group relative">
                  <div className="flex items-start space-x-6 p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-purple-200">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        ✓
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      {activeFeature && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Button 
                variant="outline" 
                onClick={() => setActiveFeature(null)}
                className="mb-4"
              >
                ← Back to Features
              </Button>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {hackathonFeatures.find(f => f.id === activeFeature)?.title} Demo
              </h2>
            </div>

            <div className="max-w-6xl mx-auto">
              {activeFeature === "code-upload" && <CodeUpload />}
              {activeFeature === "one-click-deploy" && <OneClickDeploy project={{name: "Demo Project"}} />}
              {activeFeature === "database-visualizer" && <DatabaseVisualizer />}
              {activeFeature === "ai-assistant" && (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-2xl font-bold mb-4">AI Assistant is Active!</h3>
                  <p className="text-gray-600 mb-4">
                    Look for the chat bubble in the bottom-right corner to try the AI assistant
                  </p>
                  <Badge className="bg-purple-600 text-white">
                    Available on every page
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Judge Our Innovation?
            </h2>
            <p className="text-lg lg:text-xl mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto">
              Experience the future of no-code development with 
              <span className="text-yellow-300 font-semibold"> full code ownership</span> and 
              <span className="text-green-300 font-semibold"> zero limitations</span>
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
              <Link href="/templates">
                <Button className="group px-12 py-6 text-lg font-bold bg-white text-purple-600 hover:bg-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[250px]">
                  <Sparkles className="relative mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="relative">🚀 Start Building Now</span>
                </Button>
              </Link>
              
              <Button className="group px-12 py-6 text-lg font-bold border-2 border-white/60 text-white hover:bg-white hover:text-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[250px]" variant="outline">
                <Trophy className="relative mr-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative">🏆 View Source Code</span>
              </Button>
            </div>

            {/* Achievement Badges */}
            <div className="flex flex-wrap justify-center gap-4 opacity-80">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Trophy className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-semibold">Hackathon Submission</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-semibold">5 Game-Changing Features</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Rocket className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-semibold">Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}