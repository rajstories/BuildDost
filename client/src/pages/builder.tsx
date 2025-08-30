import { useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Canvas from "@/components/builder/canvas";
import ComponentLibrary from "@/components/builder/component-library";
import PropertiesPanel from "@/components/builder/properties-panel";
import AiAssistant from "@/components/builder/ai-assistant";
import { ArrowLeft, Eye, Upload, Save } from "lucide-react";

export default function BuilderPage() {
  const params = useParams();
  const projectId = params.id;
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [canvasComponents, setCanvasComponents] = useState([]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-foreground" data-testid="project-title">
              {projectId ? `Project ${projectId}` : "New Project"}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" data-testid="button-preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm" data-testid="button-save">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button size="sm" className="glow-effect" data-testid="button-deploy">
              <Upload className="mr-2 h-4 w-4" />
              Deploy
            </Button>
          </div>
        </div>
      </header>

      {/* Main Builder Interface */}
      <div className="flex h-screen">
        {/* Component Library Sidebar */}
        <ComponentLibrary onComponentSelect={(component) => {
          // Add component to canvas
          setCanvasComponents(prev => [...prev, { ...component, id: Date.now() }]);
        }} />

        {/* Canvas Area */}
        <Canvas 
          components={canvasComponents}
          selectedComponent={selectedComponent}
          onComponentSelect={setSelectedComponent}
          onComponentUpdate={(id, updates) => {
            setCanvasComponents(prev => 
              prev.map(comp => comp.id === id ? { ...comp, ...updates } : comp)
            );
          }}
        />

        {/* Properties Panel */}
        <PropertiesPanel 
          selectedComponent={selectedComponent}
          onPropertyChange={(property, value) => {
            if (selectedComponent) {
              const updates = { [property]: value };
              setCanvasComponents(prev => 
                prev.map(comp => 
                  comp.id === selectedComponent.id ? { ...comp, ...updates } : comp
                )
              );
              setSelectedComponent(prev => ({ ...prev, ...updates }));
            }
          }}
        />
      </div>

      {/* AI Assistant */}
      <AiAssistant onComponentGenerated={(component) => {
        setCanvasComponents(prev => [...prev, { ...component, id: Date.now() }]);
      }} />
    </div>
  );
}
