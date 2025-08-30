import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Palette, Settings } from "lucide-react";
import { Link } from "wouter";
import CodeExport from "./code-export";

interface TemplateActionsProps {
  templateId: string;
  templateName: string;
}

export default function TemplateActions({ templateId, templateName }: TemplateActionsProps) {
  return (
    <>
      {/* Top Action Bar - Compact design */}
      <div className="fixed top-12 left-2 right-2 z-50">
        <div className="flex items-center justify-between">
          {/* Back Button - Smaller */}
          <Link href="/templates">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/95 backdrop-blur-sm border-gray-200 hover:bg-white shadow-md text-xs"
              data-testid="button-back-templates"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back
            </Button>
          </Link>

          {/* Template Info & Actions - Compact */}
          <div className="flex items-center space-x-2">
            {/* Template Info - Smaller */}
            <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-1 shadow-md border border-gray-200">
              <h2 className="font-medium text-gray-900 text-xs">{templateName}</h2>
              <p className="text-xs text-gray-600">Live Preview</p>
            </div>

            {/* Code Export Component - Compact */}
            <CodeExport 
              templateId={templateId} 
              templateName={templateName}
            />
          </div>
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
            >
              <Palette className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-gray-900">Customize Design</span>
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white text-gray-900 border-gray-300 hover:bg-gray-50 shadow-sm font-medium"
              data-testid="button-edit-code"
            >
              <Edit className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-gray-900">Edit Code</span>
            </Button>

            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white text-gray-900 border-gray-300 hover:bg-gray-50 shadow-sm font-medium"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4 mr-2 text-gray-700" />
              <span className="text-gray-900">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}