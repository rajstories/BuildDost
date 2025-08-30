import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Code, Smartphone, Monitor, Tablet } from "lucide-react";

interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  files: Record<string, string>;
  structure: {
    frontend: string[];
    backend: string[];
    database: string[];
  };
  dependencies: {
    frontend: string[];
    backend: string[];
  };
}

export default function PreviewPage() {
  const [, setLocation] = useLocation();
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Get project ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project');

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    } else {
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        
        // Set default selected file
        if (data.files && Object.keys(data.files).length > 0) {
          setSelectedFile(Object.keys(data.files)[0]);
        }
      } else {
        console.error('Failed to fetch project');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToBuilder = () => {
    if (projectId) {
      setLocation(`/builder?project=${projectId}`);
    } else {
      setLocation('/builder');
    }
  };

  const getDeviceStyles = () => {
    switch (device) {
      case "mobile":
        return "w-80 h-[600px]";
      case "tablet":
        return "w-[768px] h-[600px]";
      default:
        return "w-full h-[600px]";
    }
  };

  const renderPreview = () => {
    if (!project?.files) {
      return (
        <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
          <div className="text-center">
            <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No preview available</p>
          </div>
        </div>
      );
    }

    // In a real implementation, this would render the actual app
    // For now, we'll show a mock preview
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="ml-4 text-sm text-gray-600 font-mono">
            {project.name.toLowerCase().replace(/\s+/g, '-')}.replit.app
          </div>
        </div>
        <div className="p-8 h-full bg-gradient-to-br from-blue-50 to-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
            <p className="text-gray-600 mb-8">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Modern Frontend</h3>
                <p className="text-sm text-gray-600">Built with React and Tailwind CSS</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <ExternalLink className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">API Backend</h3>
                <p className="text-sm text-gray-600">Express.js with TypeScript</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Database</h3>
                <p className="text-sm text-gray-600">PostgreSQL with Drizzle ORM</p>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-lg text-gray-700">🎉 Your app is live and ready to use!</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCodeView = () => {
    if (!project?.files || !selectedFile) {
      return (
        <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Select a file to view code</p>
        </div>
      );
    }

    const fileContent = project.files[selectedFile] || "";

    return (
      <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 text-white text-sm font-mono border-b border-gray-700">
          {selectedFile}
        </div>
        <pre className="p-4 text-sm text-gray-300 overflow-auto h-full bg-gray-900">
          <code>{fileContent}</code>
        </pre>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBackToBuilder}
                className="flex items-center space-x-2"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Builder</span>
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold">{project.name}</h1>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setActiveView("preview")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeView === "preview" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="button-preview"
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveView("code")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeView === "code" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="button-code"
                >
                  Code
                </button>
              </div>
              
              {/* Device Toggle (only in preview mode) */}
              {activeView === "preview" && (
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setDevice("desktop")}
                    className={`p-2 rounded-md transition-colors ${
                      device === "desktop" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid="device-desktop"
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDevice("tablet")}
                    className={`p-2 rounded-md transition-colors ${
                      device === "tablet" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid="device-tablet"
                  >
                    <Tablet className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDevice("mobile")}
                    className={`p-2 rounded-md transition-colors ${
                      device === "mobile" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid="device-mobile"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 h-[calc(100vh-80px)]">
        <div className="flex h-full gap-6">
          {/* Sidebar (only in code view) */}
          {activeView === "code" && (
            <div className="w-64 bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Project Files</h3>
              <div className="space-y-1">
                {Object.keys(project.files).map((file) => (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2 py-1 text-sm rounded-md transition-colors ${
                      selectedFile === file
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    data-testid={`file-${file.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  >
                    {file}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Main Preview/Code Area */}
          <div className="flex-1">
            <div className={`mx-auto ${activeView === "preview" ? getDeviceStyles() : "w-full h-full"}`}>
              {activeView === "preview" ? renderPreview() : renderCodeView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}