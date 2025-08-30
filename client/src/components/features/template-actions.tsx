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
    <div className="fixed top-6 left-6 right-6 z-50">
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <Link href="/templates">
          <Button 
            variant="outline" 
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg"
            data-testid="button-back-templates"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
        </Link>

        {/* Template Actions */}
        <div className="flex items-center space-x-3">
          {/* Template Info */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
            <h2 className="font-semibold text-gray-900">{templateName} Template</h2>
            <p className="text-sm text-gray-600">Live Preview & Code Export</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg"
              data-testid="button-customize"
            >
              <Palette className="h-4 w-4 mr-2" />
              Customize
            </Button>
            
            <Button 
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg"
              data-testid="button-edit-code"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Code
            </Button>

            {/* Code Export Component */}
            <CodeExport 
              templateId={templateId} 
              templateName={templateName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}