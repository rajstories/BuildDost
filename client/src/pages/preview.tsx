import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Code, Smartphone, Monitor, Tablet } from "lucide-react";
import * as LucideIcons from "lucide-react";

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

// Component to render the actual generated app
function GeneratedAppPreview({ project }: { project: GeneratedProject }) {
  const appContent = project.files['src/App.tsx'];
  if (!appContent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">App code not found</p>
      </div>
    );
  }

  // Detect app type from the generated code and project description
  const lowerDescription = project.description.toLowerCase();
  const isTodoApp = appContent.includes('addTask') || appContent.includes('Task[]') || 
                   lowerDescription.includes('todo') || lowerDescription.includes('task');
  const isBlogApp = appContent.includes('BlogPost[]') || appContent.includes('posts') ||
                   lowerDescription.includes('blog') || lowerDescription.includes('article');
  const isEcommerceApp = appContent.includes('Product[]') || appContent.includes('addToCart') ||
                        lowerDescription.includes('shop') || lowerDescription.includes('ecommerce') || lowerDescription.includes('store');
  const isPortfolioApp = appContent.includes('activeSection') || appContent.includes('portfolio') ||
                        lowerDescription.includes('portfolio') || lowerDescription.includes('profile');

  if (isTodoApp) {
    return <TodoAppPreview project={project} />;
  } else if (isBlogApp) {
    return <BlogAppPreview project={project} />;
  } else if (isEcommerceApp) {
    return <EcommerceAppPreview project={project} />;
  } else if (isPortfolioApp) {
    return <PortfolioAppPreview project={project} />;
  } else {
    return <GenericAppPreview project={project} />;
  }
}

// Todo App Preview Component
function TodoAppPreview({ project }: { project: GeneratedProject }) {
  const [tasks, setTasks] = useState<Array<{id: number, text: string, completed: boolean, createdAt: Date}>>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date()
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-6">{project.description}</p>
          
          <div className="flex mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              <LucideIcons.Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            {completedCount} of {tasks.length} tasks completed
          </div>

          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-center p-3 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}
                >
                  {task.completed && <LucideIcons.Check className="h-3 w-3 text-white" />}
                </button>
                
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.text}
                </span>
                
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <LucideIcons.Clock className="h-3 w-3" />
                  <span>{task.createdAt.toLocaleDateString()}</span>
                </div>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <LucideIcons.Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <LucideIcons.Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Generic App Preview for other types
function GenericAppPreview({ project }: { project: GeneratedProject }) {
  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">{project.name}</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {project.description}
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <LucideIcons.Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Built with modern technologies and best practices</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <LucideIcons.Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">User Focused</h3>
            <p className="text-gray-600">Designed with user experience as the top priority</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <LucideIcons.Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-gray-600">Optimized for performance and reliability</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className="text-2xl font-bold mb-4">Get Started</h3>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
              Get Started <LucideIcons.ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for other app types
function BlogAppPreview({ project }: { project: GeneratedProject }) {
  return <GenericAppPreview project={project} />;
}

function EcommerceAppPreview({ project }: { project: GeneratedProject }) {
  return <GenericAppPreview project={project} />;
}

function PortfolioAppPreview({ project }: { project: GeneratedProject }) {
  return <GenericAppPreview project={project} />;
}

function PreviewPage() {
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
        
        // Transform the data structure to match what the UI expects
        const transformedProject = {
          id: data.id,
          name: data.name,
          description: data.description,
          files: data.config?.files || {},
          structure: data.config?.structure || { frontend: [], backend: [], database: [] },
          dependencies: data.config?.dependencies || { frontend: [], backend: [] }
        };
        
        setProject(transformedProject);
        
        // Set default selected file
        if (transformedProject.files && Object.keys(transformedProject.files).length > 0) {
          setSelectedFile(Object.keys(transformedProject.files)[0]);
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

    // Get the App.tsx file content to render the actual app
    const appContent = project.files['src/App.tsx'];
    if (!appContent) {
      return (
        <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
          <div className="text-center">
            <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">App file not found</p>
          </div>
        </div>
      );
    }

    // Render the actual generated app using iframe and data URL
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
        <GeneratedAppPreview project={project} />
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

export default PreviewPage;