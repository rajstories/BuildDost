import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertUserSchema, insertTemplateSchema, insertComponentSchema } from "@shared/schema";
import { generateComponent, generateBackend, optimizeCode, generateFullStackProject, type ComponentGenerationRequest, type BackendGenerationRequest, type CodeOptimizationRequest, type FullStackProjectRequest } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: "userId is required" });
      }
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const { category } = req.query;
      const templates = category && typeof category === 'string' 
        ? await storage.getTemplatesByCategory(category)
        : await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Component routes
  app.get("/api/components", async (req, res) => {
    try {
      const { category } = req.query;
      const components = category && typeof category === 'string'
        ? await storage.getComponentsByCategory(category)
        : await storage.getAllComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/components/:id", async (req, res) => {
    try {
      const component = await storage.getComponent(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      res.json(component);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/components", async (req, res) => {
    try {
      const componentData = insertComponentSchema.parse(req.body);
      const component = await storage.createComponent(componentData);
      res.json(component);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Test endpoint to verify project creation works
  app.post("/api/projects/test", async (req, res) => {
    try {
      console.log("Testing basic project creation...");
      
      const testProject = {
        userId: "test-user",
        name: "Test Project",
        description: "Simple test project",
        components: [],
        config: { test: true },
        isPublic: false,
        status: "draft",
        deploymentUrl: null
      };

      const savedProject = await storage.createProject(testProject);
      console.log("Test project created successfully:", savedProject.id);
      
      res.json({ 
        success: true, 
        message: "Project creation works!",
        project: savedProject 
      });
    } catch (error) {
      console.error("Test project creation failed:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Test failed"
      });
    }
  });

  // AI Full-Stack Project Generation
  app.post("/api/projects/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      console.log("Received project generation request with prompt:", prompt);
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Extract features from the prompt
      const features = extractFeaturesFromPrompt(prompt);
      console.log("Extracted features:", features);
      
      let generatedProject;
      try {
        console.log("Attempting AI generation...");
        generatedProject = await generateFullStackProject({
          description: prompt,
          features,
          type: "web"
        });
        console.log("AI generation successful");
      } catch (aiError) {
        console.error("AI generation failed, using fallback:", aiError);
        // Fallback to a simple project structure
        generatedProject = createFallbackProject(prompt, features);
        console.log("Using fallback project:", generatedProject.name);
      }

      // Store the project
      const projectData = {
        userId: "anonymous", // For now, use anonymous user
        name: generatedProject.name,
        description: generatedProject.description,
        components: [],
        config: {
          files: generatedProject.files,
          structure: generatedProject.structure,
          dependencies: generatedProject.dependencies
        },
        isPublic: false,
        status: "live",
        deploymentUrl: null
      };

      console.log("Attempting to save project with data:", {
        name: projectData.name,
        description: projectData.description,
        userId: projectData.userId
      });

      const savedProject = await storage.createProject(projectData);
      console.log("Project saved successfully with ID:", savedProject.id);
      
      res.json({ 
        success: true, 
        project: {
          id: savedProject.id,
          name: savedProject.name,
          description: savedProject.description,
          files: generatedProject.files,
          structure: generatedProject.structure,
          dependencies: generatedProject.dependencies
        }
      });
    } catch (error) {
      console.error("Full error in project generation:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate project"
      });
    }
  });

  // AI Code Generation routes
  app.post("/api/ai/generate-component", async (req, res) => {
    try {
      const request: ComponentGenerationRequest = req.body;
      if (!request.description) {
        return res.status(400).json({ message: "Description is required" });
      }

      const generatedComponent = await generateComponent(request);
      
      // Optionally save the generated component
      if (req.body.save) {
        const componentData = {
          name: generatedComponent.name,
          category: generatedComponent.category,
          code: generatedComponent.code,
          config: generatedComponent.config,
          previewImage: null,
          isPublic: true,
        };
        const savedComponent = await storage.createComponent(componentData);
        res.json({ ...generatedComponent, id: savedComponent.id });
      } else {
        res.json(generatedComponent);
      }
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/ai/generate-backend", async (req, res) => {
    try {
      const request: BackendGenerationRequest = req.body;
      if (!request.description) {
        return res.status(400).json({ message: "Description is required" });
      }

      const generatedBackend = await generateBackend(request);
      res.json(generatedBackend);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/ai/optimize-code", async (req, res) => {
    try {
      const request: CodeOptimizationRequest = req.body;
      if (!request.code) {
        return res.status(400).json({ message: "Code is required" });
      }

      const optimizedResult = await optimizeCode(request);
      res.json(optimizedResult);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Code export route
  app.post("/api/projects/:id/export", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Generate downloadable code package
      const codePackage = {
        name: project.name,
        description: project.description,
        components: project.components,
        config: project.config,
        packageJson: {
          name: project.name.toLowerCase().replace(/\s+/g, '-'),
          version: "1.0.0",
          dependencies: {
            "react": "^18.3.1",
            "react-dom": "^18.3.1",
            "@types/react": "^18.3.11",
            "@types/react-dom": "^18.3.1",
            "tailwindcss": "^3.4.17"
          }
        }
      };

      res.json(codePackage);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to extract features from prompt
function extractFeaturesFromPrompt(prompt: string): string[] {
  const commonFeatures = [
    "authentication", "login", "user management", "dashboard", "forms", 
    "database", "api", "responsive design", "search", "payments", "cart",
    "notifications", "real-time", "chat", "file upload", "admin panel"
  ];
  
  const lowerPrompt = prompt.toLowerCase();
  return commonFeatures.filter(feature => 
    lowerPrompt.includes(feature) || 
    lowerPrompt.includes(feature.replace(" ", ""))
  );
}

// Smart fallback project generator that creates functional apps
function createFallbackProject(prompt: string, features: string[]): any {
  const projectName = extractProjectName(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect app type from prompt
  let appType = "generic";
  if (lowerPrompt.includes("todo") || lowerPrompt.includes("task")) {
    appType = "todo";
  } else if (lowerPrompt.includes("blog") || lowerPrompt.includes("article")) {
    appType = "blog";
  } else if (lowerPrompt.includes("shop") || lowerPrompt.includes("ecommerce") || lowerPrompt.includes("store")) {
    appType = "ecommerce";
  } else if (lowerPrompt.includes("portfolio") || lowerPrompt.includes("profile")) {
    appType = "portfolio";
  } else if (lowerPrompt.includes("chat") || lowerPrompt.includes("message")) {
    appType = "chat";
  } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("admin")) {
    appType = "dashboard";
  }

  return {
    id: `smart_${Date.now()}`,
    name: projectName,
    description: prompt,
    files: generateAppFiles(projectName, prompt, appType),
    structure: {
      frontend: ["src/", "src/components/", "src/pages/", "public/"],
      backend: ["server/", "server/routes/", "server/models/"],
      database: ["migrations/", "schemas/"]
    },
    dependencies: {
      frontend: ["react", "react-dom", "tailwindcss", "react-router-dom", "lucide-react"],
      backend: ["express", "cors", "dotenv", "jsonwebtoken", "bcryptjs"]
    }
  };
}

function generateAppFiles(projectName: string, prompt: string, appType: string): Record<string, string> {
  const baseFiles = {
    "package.json": JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      dependencies: {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "tailwindcss": "^3.4.17",
        "lucide-react": "^0.263.1",
        "react-router-dom": "^6.8.1"
      },
      scripts: {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      }
    }, null, 2),
    "src/index.tsx": \`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);\`,
    "src/index.css": \`@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}\`,
    "public/index.html": \`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${prompt}" />
    <title>${projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>\`
  };

  // Generate app-specific components based on type
  switch (appType) {
    case "todo":
      return { ...baseFiles, ...generateTodoApp(projectName, prompt) };
    case "blog":
      return { ...baseFiles, ...generateBlogApp(projectName, prompt) };
    case "ecommerce":
      return { ...baseFiles, ...generateEcommerceApp(projectName, prompt) };
    case "portfolio":
      return { ...baseFiles, ...generatePortfolioApp(projectName, prompt) };
    case "chat":
      return { ...baseFiles, ...generateChatApp(projectName, prompt) };
    case "dashboard":
      return { ...baseFiles, ...generateDashboardApp(projectName, prompt) };
    default:
      return { ...baseFiles, ...generateGenericApp(projectName, prompt) };
  }
}

function generateTodoApp(projectName: string, prompt: string): Record<string, string> {
  return {
    "src/App.tsx": \`import React, { useState } from 'react';
import { Plus, Check, Trash2, Clock } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">${projectName}</h1>
          <p className="text-gray-600 mb-6">${prompt}</p>
          
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
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            {completedCount} of {tasks.length} tasks completed
          </div>

          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className={\`flex items-center p-3 rounded-lg border \${task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}\`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={\`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center \${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}\`}
                >
                  {task.completed && <Check className="h-3 w-3 text-white" />}
                </button>
                
                <span className={\`flex-1 \${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}\`}>
                  {task.text}
                </span>
                
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{task.createdAt.toLocaleDateString()}</span>
                </div>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;\`
  };
}

function generateGenericApp(projectName: string, prompt: string): Record<string, string> {
  return {
    "src/App.tsx": \`import React, { useState } from 'react';
import { Star, Users, Zap, ArrowRight } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thanks for your interest! This is a demo app.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">${projectName}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ${prompt}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Built with modern technologies and best practices</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">User Focused</h3>
              <p className="text-gray-600">Designed with user experience as the top priority</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Optimized for performance and reliability</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4">Get Started</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;\`
  };
}

function generateBlogApp(projectName: string, prompt: string): Record<string, string> {
  return {
    "src/App.tsx": \`import React, { useState } from 'react';
import { Calendar, User, Heart, MessageCircle, Share2 } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
}

function App() {
  const [posts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Getting Started with ${projectName}",
      excerpt: "Learn the basics of building amazing content...",
      author: "John Doe",
      date: "2024-01-15",
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      title: "Advanced Tips and Tricks",
      excerpt: "Take your skills to the next level with these pro tips...",
      author: "Jane Smith",
      date: "2024-01-12",
      likes: 18,
      comments: 5
    },
    {
      id: 3,
      title: "Community Spotlight",
      excerpt: "Featuring amazing work from our community members...",
      author: "Mike Johnson",
      date: "2024-01-10",
      likes: 32,
      comments: 12
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">${projectName}</h1>
          <p className="text-gray-600 mt-2">${prompt}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </div>
                    <Share2 className="h-4 w-4 cursor-pointer hover:text-blue-500" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;\`
  };
}

function generateEcommerceApp(projectName: string, prompt: string): Record<string, string> {
  return {
    "src/App.tsx": \`import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [products] = useState<Product[]>([
    { id: 1, name: "Premium Product", price: 99.99, image: "🎁", rating: 4.5, reviews: 128 },
    { id: 2, name: "Best Seller", price: 149.99, image: "⭐", rating: 4.8, reviews: 89 },
    { id: 3, name: "New Arrival", price: 79.99, image: "🔥", rating: 4.2, reviews: 45 }
  ]);
  
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">${projectName}</h1>
              <p className="text-gray-600">${prompt}</p>
            </div>
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-6xl text-center mb-4">{product.image}</div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={\`h-4 w-4 \${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-4">\${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Shopping Cart</h3>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.image}</span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">\${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total: \${totalPrice.toFixed(2)}</span>
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;\`
  };
}

function generatePortfolioApp(projectName: string, prompt: string): Record<string, string> {
  return {
    "src/App.tsx": \`import React, { useState } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code, Palette, Smartphone } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('about');

  const projects = [
    { id: 1, title: "E-commerce Platform", tech: "React, Node.js", icon: "🛒" },
    { id: 2, title: "Mobile App Design", tech: "React Native, Figma", icon: "📱" },
    { id: 3, title: "Data Dashboard", tech: "Vue.js, D3.js", icon: "📊" }
  ];

  const skills = [
    { name: "Frontend Development", level: 90, icon: <Code className="h-5 w-5" /> },
    { name: "UI/UX Design", level: 85, icon: <Palette className="h-5 w-5" /> },
    { name: "Mobile Development", level: 75, icon: <Smartphone className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">${projectName}</h1>
            <div className="flex space-x-6">
              {['about', 'projects', 'skills', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={\`capitalize hover:text-blue-400 transition-colors \${activeSection === section ? 'text-blue-400' : ''}\`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 container mx-auto px-4 py-8">
        {activeSection === 'about' && (
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl">
              👨‍💻
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h2>
            <p className="text-xl text-gray-300 mb-8">${prompt}</p>
            <p className="text-gray-400 leading-relaxed">
              I'm a passionate developer who loves creating beautiful and functional digital experiences. 
              With expertise in modern web technologies and a keen eye for design, I bring ideas to life 
              through clean, efficient code.
            </p>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors">
                  <div className="text-4xl mb-4">{project.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.tech}</p>
                  <button className="flex items-center text-blue-400 hover:text-blue-300">
                    View Project <ExternalLink className="ml-2 h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Skills & Expertise</h2>
            <div className="space-y-6">
              {skills.map(skill => (
                <div key={skill.name} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    {skill.icon}
                    <span className="ml-3 text-lg font-medium">{skill.name}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: \`\${skill.level}%\` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 mt-1 block">{skill.level}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Let's Connect</h2>
            <p className="text-gray-300 mb-8">
              I'm always interested in new opportunities and collaborations. 
              Feel free to reach out!
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </a>
              <a href="#" className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a href="#" className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;\`
  };
}

// Add placeholder functions for chat and dashboard apps
function generateChatApp(projectName: string, prompt: string): Record<string, string> {
  return generateGenericApp(projectName, prompt);
}

function generateDashboardApp(projectName: string, prompt: string): Record<string, string> {
  return generateGenericApp(projectName, prompt);
}

function extractProjectName(description: string): string {
  const words = description.toLowerCase().split(" ");
  const stopWords = ["a", "an", "the", "for", "with", "app", "website", "application"];
  const relevantWords = words.filter(word => 
    word.length > 2 && !stopWords.includes(word)
  ).slice(0, 3);
  
  return relevantWords.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ") || "Generated App";
}
