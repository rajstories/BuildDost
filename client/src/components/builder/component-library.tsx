import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Layout, Palette, Type, Box } from "lucide-react";

const componentCategories = [
  {
    id: "layout",
    name: "Layout",
    icon: Layout,
    components: [
      { id: "header", name: "Header", category: "layout", icon: "📄" },
      { id: "footer", name: "Footer", category: "layout", icon: "📰" },
      { id: "sidebar", name: "Sidebar", category: "layout", icon: "📋" },
      { id: "container", name: "Container", category: "layout", icon: "📦" },
    ],
  },
  {
    id: "ui",
    name: "UI",
    icon: Palette,
    components: [
      { id: "button", name: "Button", category: "ui", icon: "🔘" },
      { id: "card", name: "Card", category: "ui", icon: "🎴" },
      { id: "modal", name: "Modal", category: "ui", icon: "🪟" },
      { id: "tooltip", name: "Tooltip", category: "ui", icon: "💭" },
    ],
  },
  {
    id: "forms",
    name: "Forms",
    icon: Type,
    components: [
      { id: "input", name: "Input", category: "forms", icon: "📝" },
      { id: "textarea", name: "Textarea", category: "forms", icon: "📄" },
      { id: "select", name: "Select", category: "forms", icon: "📋" },
      { id: "checkbox", name: "Checkbox", category: "forms", icon: "☑️" },
    ],
  },
];

interface ComponentLibraryProps {
  onComponentSelect: (component: any) => void;
}

export default function ComponentLibrary({ onComponentSelect }: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("layout");

  const { data: components, isLoading } = useQuery({
    queryKey: ["/api/components"],
    enabled: true,
  });

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData("application/json", JSON.stringify(component));
  };

  const filteredComponents = componentCategories.find(
    cat => cat.id === activeCategory
  )?.components?.filter(comp => 
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="w-64 border-r border-border bg-muted/20 flex flex-col" data-testid="component-library">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3" data-testid="component-library-title">
          Components
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8"
            data-testid="input-search-components"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mx-4 mt-4" data-testid="component-categories">
          {componentCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs"
                data-testid={`tab-${category.id}`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {category.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Component Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {componentCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-2 gap-2">
                {category.components
                  .filter(comp => 
                    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((component) => (
                    <div
                      key={component.id}
                      className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                      onClick={() => onComponentSelect(component)}
                      data-testid={`component-${component.id}`}
                    >
                      <div className="w-full h-8 bg-muted rounded mb-2 flex items-center justify-center text-lg">
                        {component.icon}
                      </div>
                      <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {component.name}
                      </div>
                    </div>
                  ))}
              </div>
              
              {filteredComponents.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <Box className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground" data-testid="no-components-found">
                    No components found
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* AI Generate Button */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full text-xs" 
          data-testid="button-ai-generate-component"
        >
          <Box className="mr-2 h-3 w-3" />
          Generate with AI
        </Button>
      </div>
    </div>
  );
}
