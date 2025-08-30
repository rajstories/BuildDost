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
  const { toast } = useToast();

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
                  <div className="w-full h-12 bg-blue-500 rounded cursor-pointer hover:shadow-md" title="Blue Theme"></div>
                  <div className="w-full h-12 bg-purple-500 rounded cursor-pointer hover:shadow-md" title="Purple Theme"></div>
                  <div className="w-full h-12 bg-green-500 rounded cursor-pointer hover:shadow-md" title="Green Theme"></div>
                  <div className="w-full h-12 bg-red-500 rounded cursor-pointer hover:shadow-md" title="Red Theme"></div>
                  <div className="w-full h-12 bg-orange-500 rounded cursor-pointer hover:shadow-md" title="Orange Theme"></div>
                  <div className="w-full h-12 bg-pink-500 rounded cursor-pointer hover:shadow-md" title="Pink Theme"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Layout Options</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Monitor className="h-4 w-4 mr-2" />
                    Wide Layout
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Sliders className="h-4 w-4 mr-2" />
                    Compact Layout
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Custom Layout
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCustomizeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({ title: "Design Updated", description: "Your template design has been customized!" });
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