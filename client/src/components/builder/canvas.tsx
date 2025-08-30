import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Move } from "lucide-react";

interface CanvasProps {
  components: any[];
  selectedComponent: any;
  onComponentSelect: (component: any) => void;
  onComponentUpdate: (id: number, updates: any) => void;
}

export default function Canvas({ 
  components, 
  selectedComponent, 
  onComponentSelect, 
  onComponentUpdate 
}: CanvasProps) {
  const [draggedComponent, setDraggedComponent] = useState(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("application/json");
    if (componentData) {
      const component = JSON.parse(componentData);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add component to canvas at drop position
      const newComponent = {
        ...component,
        id: Date.now(),
        x,
        y,
        width: 200,
        height: 100,
      };
      
      onComponentUpdate(newComponent.id, newComponent);
    }
  }, [onComponentUpdate]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleComponentClick = useCallback((component: any) => {
    onComponentSelect(component);
  }, [onComponentSelect]);

  const handleDeleteComponent = useCallback((componentId: number) => {
    // Filter out the component to delete
    // This would need to be handled at the parent level
  }, []);

  return (
    <div className="flex-1 bg-background relative overflow-hidden" data-testid="canvas">
      {/* Canvas Background */}
      <div 
        className="absolute inset-0 drag-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-testid="canvas-drop-zone"
      >
        {components.length === 0 ? (
          <div className="absolute inset-4 border-2 border-dashed border-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl text-muted-foreground mb-3">🎯</div>
              <p className="text-muted-foreground font-medium" data-testid="canvas-empty-title">
                Drag components here to build your app
              </p>
              <p className="text-sm text-muted-foreground mt-1" data-testid="canvas-empty-subtitle">
                Or describe what you want with AI
              </p>
            </div>
          </div>
        ) : (
          // Render components on canvas
          <div className="relative h-full">
            {components.map((component) => (
              <div
                key={component.id}
                className={`absolute border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedComponent?.id === component.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-muted"
                }`}
                style={{
                  left: component.x || 50,
                  top: component.y || 50,
                  width: component.width || 200,
                  height: component.height || 100,
                }}
                onClick={() => handleComponentClick(component)}
                data-testid={`canvas-component-${component.id}`}
              >
                {/* Component Preview */}
                <div className="w-full h-full bg-card rounded border border-border flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    {component.name || "Component"}
                  </span>
                </div>

                {/* Component Controls */}
                {selectedComponent?.id === component.id && (
                  <div className="absolute -top-10 right-0 flex space-x-1 bg-background border border-border rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle copy
                      }}
                      data-testid={`button-copy-${component.id}`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle move
                      }}
                      data-testid={`button-move-${component.id}`}
                    >
                      <Move className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComponent(component.id);
                      }}
                      data-testid={`button-delete-${component.id}`}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canvas Controls */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <Button variant="secondary" size="sm" data-testid="button-canvas-zoom-out">
          -
        </Button>
        <span className="text-sm text-muted-foreground px-2 py-1" data-testid="canvas-zoom-level">
          100%
        </span>
        <Button variant="secondary" size="sm" data-testid="button-canvas-zoom-in">
          +
        </Button>
      </div>
    </div>
  );
}
