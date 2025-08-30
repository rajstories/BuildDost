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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <Badge className="mb-4 bg-purple-600 text-white text-lg px-6 py-2">
            <Trophy className="h-5 w-5 mr-2" />
            Hackathon Submission
          </Badge>
          
          <h1 className="text-6xl font-black text-gray-900 mb-6 leading-tight">
            BuildDost
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-semibold">
            AI-Powered Full-Stack Website & Backend Builder
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The only platform that enables non-technical founders to create and deploy 
            production-ready full-stack applications with zero coding knowledge
          </p>

          <div className="flex justify-center space-x-4 mb-12">
            <Link href="/templates">
              <Button size="lg" className="px-8 py-4 text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Try Live Demo
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <Code className="mr-2 h-5 w-5" />
                Build Custom App
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Game-Changing Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Code Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1-Click</div>
              <div className="text-sm text-gray-600">Deployment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">Full</div>
              <div className="text-sm text-gray-600">Code Ownership</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hackathon-Winning Features</h2>
            <p className="text-xl text-gray-600">
              Five breakthrough innovations that set BuildDost apart from all competitors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackathonFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-purple-300"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full mt-4 group-hover:bg-purple-600 transition-colors"
                      variant="outline"
                    >
                      Try This Feature
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why BuildDost Wins</h2>
            <p className="text-xl text-gray-600">
              Our unique approach solves problems that existing solutions can't address
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {competitiveAdvantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{advantage.title}</h3>
                    <p className="text-gray-600">{advantage.description}</p>
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
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Judge Our Innovation?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of no-code development with full code ownership
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link href="/templates">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg text-purple-600">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-purple-600">
              <Trophy className="mr-2 h-5 w-5" />
              View Source Code
            </Button>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}