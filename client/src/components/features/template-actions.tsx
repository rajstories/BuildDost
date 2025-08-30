import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, ArrowLeft, Palette, Settings, Monitor, Code2, Sliders } from "lucide-react";
import { Link } from "wouter";
import CodeExport from "./code-export";
import { useToast } from "@/hooks/use-toast";

interface TemplateActionsProps {
  templateId: string;
  templateName: string;
}

export default function TemplateActions({ templateId, templateName }: TemplateActionsProps) {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [selectedLayout, setSelectedLayout] = useState("wide");
  const { toast } = useToast();

  const colorThemes = [
    { name: "blue", color: "bg-blue-500", primary: "#2563eb", secondary: "#dbeafe" },
    { name: "purple", color: "bg-purple-500", primary: "#7c3aed", secondary: "#ede9fe" },
    { name: "green", color: "bg-green-500", primary: "#059669", secondary: "#d1fae5" },
    { name: "red", color: "bg-red-500", primary: "#dc2626", secondary: "#fee2e2" },
    { name: "orange", color: "bg-orange-500", primary: "#ea580c", secondary: "#fed7aa" },
    { name: "pink", color: "bg-pink-500", primary: "#ec4899", secondary: "#fce7f3" }
  ];

  const layoutOptions = [
    { id: "wide", name: "Wide Layout", description: "Full width content" },
    { id: "compact", name: "Compact Layout", description: "Centered with margins" },
    { id: "custom", name: "Custom Layout", description: "Flexible grid system" }
  ];

  const handleCustomizeDesign = () => {
    setIsCustomizeOpen(true);
  };

  const handleEditCode = async () => {
    try {
      // Get template source code
      const response = await fetch(`/api/templates/${templateId}/source`);
      const data = await response.json();
      setIsCodeEditorOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template code",
        variant: "destructive"
      });
    }
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const applyDesignChanges = (theme: string, layout: string) => {
    // Get the selected theme colors
    const selectedThemeData = colorThemes.find(t => t.name === theme);
    if (!selectedThemeData) return;

    // Create a style element for theme-specific CSS
    let themeStyleEl = document.getElementById('template-theme-styles');
    if (!themeStyleEl) {
      themeStyleEl = document.createElement('style');
      themeStyleEl.id = 'template-theme-styles';
      document.head.appendChild(themeStyleEl);
    }

    // Generate CSS for the selected theme
    const themeCss = `
      .theme-${theme} .bg-blue-600,
      .theme-${theme} .hover\\:bg-blue-600:hover,
      .theme-${theme} .bg-blue-700,
      .theme-${theme} .hover\\:bg-blue-700:hover {
        background-color: ${selectedThemeData.primary} !important;
      }
      
      .theme-${theme} .text-blue-600,
      .theme-${theme} .hover\\:text-blue-600:hover {
        color: ${selectedThemeData.primary} !important;
      }
      
      .theme-${theme} .border-blue-600 {
        border-color: ${selectedThemeData.primary} !important;
      }
      
      .theme-${theme} .focus\\:ring-blue-600:focus {
        --tw-ring-color: ${selectedThemeData.primary} !important;
      }

      .theme-${theme} .from-blue-600 {
        --tw-gradient-from: ${selectedThemeData.primary} !important;
      }

      .layout-compact .max-w-7xl {
        max-width: 56rem !important;
        margin: 0 auto !important;
        padding: 0 2rem !important;
      }

      .layout-wide .max-w-7xl {
        max-width: 100% !important;
        padding: 0 1rem !important;
      }

      .layout-custom .max-w-7xl {
        max-width: 72rem !important;
        display: grid !important;
        grid-template-columns: 1fr 3fr 1fr !important;
        gap: 2rem !important;
      }
    `;

    themeStyleEl.textContent = themeCss;
    
    // Apply theme class to body for consistent theming
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);

    // Apply layout changes
    document.body.className = document.body.className.replace(/layout-\w+/g, '');
    document.body.classList.add(`layout-${layout}`);
  };

  return (
    <>
      {/* Top Action Bar - Much lower position */}
      <div className="fixed top-20 left-3 right-3 z-40">
        <div className="flex items-center justify-between">
          {/* Back Button - Icon only */}
          <Link href="/templates">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white backdrop-blur-sm border-gray-300 hover:bg-gray-50 shadow-sm w-8 h-8 p-0"
              data-testid="button-back-templates"
              title="Back to Templates"
            >
              <ArrowLeft className="h-4 w-4 text-black" />
            </Button>
          </Link>

          {/* Code Export Only - Right side */}
          <CodeExport 
            templateId={templateId} 
            templateName={templateName}
          />
        </div>
      </div>

      {/* Floating Action Panel - Fixed text visibility */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl p-4 min-w-[200px]">
          <div className="text-center mb-3">
            <h3 className="font-bold text-gray-900 text-sm">Template Actions</h3>
            <p className="text-xs text-gray-700 font-medium">Customize and export your app</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white text-gray-900 border-gray-300 hover:bg-gray-50 shadow-sm font-medium"
              data-testid="button-customize"
              onClick={handleCustomizeDesign}
            >
              <Palette className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-gray-900">Customize Design</span>
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white text-gray-900 border-gray-300 hover:bg-gray-50 shadow-sm font-medium"
              data-testid="button-edit-code"
              onClick={handleEditCode}
            >
              <Edit className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-gray-900">Edit Code</span>
            </Button>

            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white text-gray-900 border-gray-300 hover:bg-gray-50 shadow-sm font-medium"
              data-testid="button-settings"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-gray-900">Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Customize Design Dialog */}
      <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Customize Design - {templateName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Color Themes</h3>
                <div className="grid grid-cols-3 gap-2">
                  {colorThemes.map((theme) => (
                    <div
                      key={theme.name}
                      onClick={() => setSelectedTheme(theme.name)}
                      className={`w-full h-12 ${theme.color} rounded cursor-pointer hover:shadow-md transition-all relative ${
                        selectedTheme === theme.name ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                      }`}
                      title={`${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} Theme`}
                    >
                      {selectedTheme === theme.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Layout Options</h3>
                <div className="space-y-2">
                  {layoutOptions.map((layout) => (
                    <Button
                      key={layout.id}
                      variant={selectedLayout === layout.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedLayout(layout.id)}
                    >
                      {layout.id === "wide" && <Monitor className="h-4 w-4 mr-2" />}
                      {layout.id === "compact" && <Sliders className="h-4 w-4 mr-2" />}
                      {layout.id === "custom" && <Settings className="h-4 w-4 mr-2" />}
                      {layout.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCustomizeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                applyDesignChanges(selectedTheme, selectedLayout);
                toast({ 
                  title: "Design Updated!", 
                  description: `Applied ${selectedTheme} theme with ${selectedLayout} layout` 
                });
                setIsCustomizeOpen(false);
              }}>
                Apply Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Code Editor Dialog */}
      <Dialog open={isCodeEditorOpen} onOpenChange={setIsCodeEditorOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Code2 className="h-5 w-5 mr-2" />
              Edit Code - {templateName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-96 overflow-auto">
              <div className="text-green-400">// {templateName} Template Code</div>
              <div className="text-blue-400">import React from 'react';</div>
              <div className="text-blue-400">import {`{ Button }`} from '@/components/ui/button';</div>
              <div className="text-yellow-400">
                <br />
                export default function {templateName.replace(/\s+/g, '')}Template() {`{`}
              </div>
              <div className="ml-4 text-gray-300">
                return (
                <br />
                {'    '}&lt;div className="min-h-screen bg-white"&gt;
                <br />
                {'      '}// Your customizable template content here
                <br />
                {'    '}&lt;/div&gt;
                <br />
                {'  '});
              </div>
              <div className="text-yellow-400">{`}`}</div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCodeEditorOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({ title: "Code Saved", description: "Your template code has been updated!" });
                setIsCodeEditorOpen(false);
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Template Settings - {templateName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Auto-save changes</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Enable live preview</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Show code hints</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Dark mode</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Template Info</h3>
              <div className="text-sm space-y-1 text-gray-600">
                <div>Name: {templateName}</div>
                <div>ID: {templateId}</div>
                <div>Last Modified: {new Date().toLocaleDateString()}</div>
                <div>Version: 1.0.0</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsSettingsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}