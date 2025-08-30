import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Palette, Type, Box, Settings } from "lucide-react";

interface PropertiesPanelProps {
  selectedComponent: any;
  onPropertyChange: (property: string, value: any) => void;
}

export default function PropertiesPanel({ selectedComponent, onPropertyChange }: PropertiesPanelProps) {
  const [activeSection, setActiveSection] = useState("general");

  if (!selectedComponent) {
    return (
      <div className="w-64 border-l border-border bg-muted/20 p-4" data-testid="properties-panel-empty">
        <div className="text-center py-8">
          <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground" data-testid="no-component-selected">
            Select a component to edit properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-l border-border bg-muted/20 flex flex-col" data-testid="properties-panel">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2" data-testid="properties-panel-title">
          Properties
        </h3>
        <div className="text-xs text-muted-foreground" data-testid="selected-component-type">
          {selectedComponent.name || "Component"}
        </div>
      </div>

      {/* Property Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* General Properties */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">General</span>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="component-id" className="text-xs">Component ID</Label>
              <Input
                id="component-id"
                value={selectedComponent.id || ""}
                onChange={(e) => onPropertyChange("id", e.target.value)}
                className="mt-1 h-8"
                data-testid="input-component-id"
              />
            </div>

            <div>
              <Label htmlFor="component-name" className="text-xs">Name</Label>
              <Input
                id="component-name"
                value={selectedComponent.name || ""}
                onChange={(e) => onPropertyChange("name", e.target.value)}
                className="mt-1 h-8"
                data-testid="input-component-name"
              />
            </div>

            <div>
              <Label htmlFor="component-text" className="text-xs">Text Content</Label>
              <Textarea
                id="component-text"
                value={selectedComponent.text || ""}
                onChange={(e) => onPropertyChange("text", e.target.value)}
                className="mt-1"
                rows={3}
                data-testid="textarea-component-text"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Layout Properties */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Box className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Layout</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width" className="text-xs">Width</Label>
              <Input
                id="width"
                type="number"
                value={selectedComponent.width || 200}
                onChange={(e) => onPropertyChange("width", parseInt(e.target.value))}
                className="mt-1 h-8"
                data-testid="input-width"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">Height</Label>
              <Input
                id="height"
                type="number"
                value={selectedComponent.height || 100}
                onChange={(e) => onPropertyChange("height", parseInt(e.target.value))}
                className="mt-1 h-8"
                data-testid="input-height"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="x-position" className="text-xs">X Position</Label>
              <Input
                id="x-position"
                type="number"
                value={selectedComponent.x || 0}
                onChange={(e) => onPropertyChange("x", parseInt(e.target.value))}
                className="mt-1 h-8"
                data-testid="input-x-position"
              />
            </div>
            <div>
              <Label htmlFor="y-position" className="text-xs">Y Position</Label>
              <Input
                id="y-position"
                type="number"
                value={selectedComponent.y || 0}
                onChange={(e) => onPropertyChange("y", parseInt(e.target.value))}
                className="mt-1 h-8"
                data-testid="input-y-position"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Style Properties */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Style</span>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">Background Color</Label>
              <div className="mt-1 flex space-x-2">
                {["primary", "secondary", "accent", "muted"].map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded border border-border cursor-pointer bg-${color}`}
                    onClick={() => onPropertyChange("backgroundColor", color)}
                    data-testid={`color-${color}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Border Radius</Label>
              <div className="mt-2">
                <Slider
                  value={[selectedComponent.borderRadius || 0]}
                  onValueChange={(value) => onPropertyChange("borderRadius", value[0])}
                  max={20}
                  step={1}
                  data-testid="slider-border-radius"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Opacity</Label>
              <div className="mt-2">
                <Slider
                  value={[selectedComponent.opacity || 100]}
                  onValueChange={(value) => onPropertyChange("opacity", value[0])}
                  max={100}
                  step={1}
                  data-testid="slider-opacity"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Typography Properties */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Typography</span>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="font-size" className="text-xs">Font Size</Label>
              <Select
                value={selectedComponent.fontSize || "md"}
                onValueChange={(value) => onPropertyChange("fontSize", value)}
              >
                <SelectTrigger className="mt-1 h-8" data-testid="select-font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Extra Small</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="font-weight" className="text-xs">Font Weight</Label>
              <Select
                value={selectedComponent.fontWeight || "normal"}
                onValueChange={(value) => onPropertyChange("fontWeight", value)}
              >
                <SelectTrigger className="mt-1 h-8" data-testid="select-font-weight">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="semibold">Semi Bold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Text Align Center</Label>
              <Switch
                checked={selectedComponent.textAlign === "center"}
                onCheckedChange={(checked) => 
                  onPropertyChange("textAlign", checked ? "center" : "left")
                }
                data-testid="switch-text-align"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button 
          variant="outline" 
          className="w-full text-xs"
          data-testid="button-duplicate-component"
        >
          Duplicate Component
        </Button>
        <Button 
          variant="destructive" 
          className="w-full text-xs"
          data-testid="button-delete-component"
        >
          Delete Component
        </Button>
      </div>
    </div>
  );
}
