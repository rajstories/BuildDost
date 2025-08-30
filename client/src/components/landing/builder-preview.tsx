import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Upload, Bot, Send, Check } from "lucide-react";

export default function BuilderPreview() {
  return (
    <section id="builder" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="builder-preview-title">
            Visual Builder Meets AI Power
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="builder-preview-description">
            Drag, drop, and describe what you want. Our AI handles the complex code generation while you focus on your vision.
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="glass-effect rounded-2xl p-1 shadow-2xl">
            <div className="bg-card rounded-xl overflow-hidden">
              {/* Builder Interface Header */}
              <div className="border-b border-border p-4 flex items-center justify-between" data-testid="builder-header">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-foreground" data-testid="project-name">My E-commerce Store</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="secondary" size="sm" data-testid="button-preview">
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" className="glow-effect" data-testid="button-deploy">
                    <Upload className="mr-1 h-3 w-3" />
                    Deploy
                  </Button>
                </div>
              </div>
              
              {/* Builder Interface Body */}
              <div className="flex h-96">
                {/* Component Library Sidebar */}
                <div className="w-64 border-r border-border p-4 bg-muted/20" data-testid="component-library">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Components</h3>
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Layout</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" data-testid="component-header">
                        <div className="w-full h-8 bg-muted rounded mb-1"></div>
                        <div className="text-xs text-muted-foreground">Header</div>
                      </div>
                      <div className="p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" data-testid="component-button">
                        <div className="w-full h-8 bg-muted rounded mb-1 flex items-center justify-center">
                          <div className="w-4 h-1 bg-muted-foreground rounded"></div>
                        </div>
                        <div className="text-xs text-muted-foreground">Button</div>
                      </div>
                      <div className="p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" data-testid="component-card">
                        <div className="w-full h-8 bg-muted rounded mb-1 space-y-1 p-1">
                          <div className="w-full h-1 bg-muted-foreground rounded"></div>
                          <div className="w-3/4 h-1 bg-muted-foreground rounded"></div>
                        </div>
                        <div className="text-xs text-muted-foreground">Card</div>
                      </div>
                      <div className="p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors" data-testid="component-grid">
                        <div className="w-full h-8 bg-muted rounded mb-1 grid grid-cols-3 gap-1 p-1">
                          <div className="bg-muted-foreground rounded"></div>
                          <div className="bg-muted-foreground rounded"></div>
                          <div className="bg-muted-foreground rounded"></div>
                        </div>
                        <div className="text-xs text-muted-foreground">Grid</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Canvas Area */}
                <div className="flex-1 drag-zone relative" data-testid="canvas-area">
                  <div className="absolute inset-4 border-2 border-dashed border-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl text-muted-foreground mb-3">🎯</div>
                      <p className="text-muted-foreground font-medium" data-testid="canvas-instruction-primary">Drag components here to build your app</p>
                      <p className="text-sm text-muted-foreground mt-1" data-testid="canvas-instruction-secondary">Or describe what you want with AI</p>
                    </div>
                  </div>
                </div>
                
                {/* Properties Panel */}
                <div className="w-64 border-l border-border p-4 bg-muted/20" data-testid="properties-panel">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Properties</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Element Type</label>
                      <div className="mt-1 text-sm text-foreground" data-testid="property-element-type">Header</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Text Content</label>
                      <Input 
                        defaultValue="Welcome to My Store" 
                        className="mt-1"
                        data-testid="input-text-content"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Background</label>
                      <div className="mt-1 flex space-x-2">
                        <div className="w-6 h-6 bg-primary rounded border border-border cursor-pointer" data-testid="color-primary"></div>
                        <div className="w-6 h-6 bg-secondary rounded border border-border cursor-pointer" data-testid="color-secondary"></div>
                        <div className="w-6 h-6 bg-accent rounded border border-border cursor-pointer" data-testid="color-accent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Assistant Floating Panel */}
          <div className="absolute bottom-4 right-4 w-80 glass-effect rounded-xl p-4 shadow-xl" data-testid="ai-assistant">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="text-primary-foreground text-xs" size={12} />
                </div>
                <span className="text-sm font-medium text-foreground" data-testid="ai-assistant-title">AI Assistant</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-testid="ai-status-indicator"></div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="bg-muted/50 rounded-lg p-2 text-sm text-foreground" data-testid="ai-user-message">
                "Create a hero section with a call-to-action button"
              </div>
              <div className="bg-primary/20 rounded-lg p-2 text-sm text-foreground" data-testid="ai-response-message">
                <Check className="inline text-primary mr-1 h-3 w-3" />
                Generated hero section with CTA button. Added to your canvas!
              </div>
            </div>
            <div className="flex space-x-2">
              <Input 
                placeholder="Describe what you want to build..." 
                className="flex-1"
                data-testid="input-ai-prompt"
              />
              <Button size="sm" className="glow-effect" data-testid="button-send-ai-prompt">
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
