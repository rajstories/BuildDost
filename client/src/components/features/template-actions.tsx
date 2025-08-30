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
      {/* Top Action Bar */}
      <div className="fixed top-6 left-6 right-6 z-50">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Link href="/templates">
            <Button 
              variant="outline" 
              className="bg-white/95 backdrop-blur-sm border-gray-200 hover:bg-white shadow-xl hover:shadow-2xl transition-all"
              data-testid="button-back-templates"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
          </Link>

          {/* Template Info & Actions */}
          <div className="flex items-center space-x-3">
            {/* Template Info */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-xl border border-gray-200">
              <h2 className="font-semibold text-gray-900">{templateName} Template</h2>
              <p className="text-sm text-gray-600">Live Preview & Code Export</p>
            </div>

            {/* Code Export Component - More Prominent */}
            <CodeExport 
              templateId={templateId} 
              templateName={templateName}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Panel - More Visible */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-4">
          <div className="text-center mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Template Actions</h3>
            <p className="text-xs text-gray-600">Customize and export your app</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
              data-testid="button-customize"
            >
              <Palette className="h-4 w-4 mr-2" />
              Customize Design
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
              data-testid="button-edit-code"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Code
            </Button>

            <Button 
              variant="outline"
              size="sm"
              className="w-full justify-start bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}