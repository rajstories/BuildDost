import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  Github,
  Code,
  FolderDown,
  GitBranch,
  ExternalLink,
  Upload,
  FileImage,
  Copy
} from "lucide-react";

interface CodeExportProps {
  templateId: string;
  templateName: string;
  className?: string;
}

export default function CodeExport({ templateId, templateName, className = "" }: CodeExportProps) {
  const [isGitHubDialogOpen, setIsGitHubDialogOpen] = useState(false);
  const [githubRepo, setGithubRepo] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      // Use the working API endpoint for ZIP export
      const response = await fetch(`/api/templates/${templateId}/export/zip`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${templateName.toLowerCase().replace(/\s+/g, '-')}-template.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Download Complete",
          description: `${templateName} template downloaded successfully!`,
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Download Failed", 
        description: "There was an error downloading the template. Please try again.",
        variant: "destructive"
      });
    }
    setIsExporting(false);
  };

  const handleGitHubExport = async () => {
    if (!githubRepo.trim()) {
      toast({
        title: "Repository Required",
        description: "Please enter a GitHub repository name.",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    try {
      const response = await fetch(`/api/templates/${templateId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          format: 'github',
          repository: githubRepo 
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({
          title: "GitHub Export Complete",
          description: `Template exported to ${githubRepo} successfully!`,
        });
        // Open the repository in a new tab
        if (result.repositoryUrl) {
          window.open(result.repositoryUrl, '_blank');
        }
        setIsGitHubDialogOpen(false);
        setGithubRepo("");
      } else {
        throw new Error(result.error || 'GitHub export failed');
      }
    } catch (error) {
      console.error('GitHub export error:', error);
      toast({
        title: "GitHub Export Failed",
        description: "There was an error exporting to GitHub. Please check your repository name and try again.",
        variant: "destructive"
      });
    }
    setIsExporting(false);
  };

  const handleCopyCode = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/source`);
      const data = await response.json();
      
      if (response.ok && data.code) {
        await navigator.clipboard.writeText(data.code);
        toast({
          title: "Code Copied",
          description: "Template source code copied to clipboard!",
        });
      } else {
        throw new Error('Failed to get source code');
      }
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy code to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleImportFromFigma = () => {
    // Open Figma import dialog or redirect to Figma integration
    window.open('https://www.figma.com/file/select', '_blank');
    toast({
      title: "Figma Import",
      description: "Select your Figma design to import...",
    });
  };

  const handleImportFromGitHub = () => {
    // Open GitHub import dialog 
    const repoUrl = prompt("Enter GitHub repository URL to import:");
    if (repoUrl) {
      toast({
        title: "GitHub Import",
        description: "Importing from GitHub repository...",
      });
      // Handle GitHub import logic here
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
            data-testid="button-export-code"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Code
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={handleDownloadZip} disabled={isExporting}>
            <FolderDown className="h-4 w-4 mr-2" />
            Download ZIP
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsGitHubDialogOpen(true)} disabled={isExporting}>
            <Github className="h-4 w-4 mr-2" />
            Export to GitHub
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Source Code
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Import Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 font-semibold"
            data-testid="button-import-design"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Design
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={handleImportFromFigma}>
            <FileImage className="h-4 w-4 mr-2" />
            Import from Figma
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportFromGitHub}>
            <Github className="h-4 w-4 mr-2" />
            Import from GitHub
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* GitHub Export Dialog */}
      <Dialog open={isGitHubDialogOpen} onOpenChange={setIsGitHubDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Github className="h-5 w-5 mr-2" />
              Export to GitHub
            </DialogTitle>
            <DialogDescription>
              Export this template to a new GitHub repository. Make sure you have a GitHub account connected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="repo-name">Repository Name</Label>
              <Input
                id="repo-name"
                placeholder="my-awesome-website"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will create a new public repository with your template code.
              </p>
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsGitHubDialogOpen(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGitHubExport}
                disabled={isExporting || !githubRepo.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isExporting ? (
                  <>Creating Repository...</>
                ) : (
                  <>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create Repository
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}