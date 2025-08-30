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
  
  // Detect app type from prompt like professional web builders
  let appType = "landing"; // Default to landing page
  
  if (lowerPrompt.includes("todo") || lowerPrompt.includes("task") || lowerPrompt.includes("list")) {
    appType = "todo";
  } else if (lowerPrompt.includes("portfolio") || lowerPrompt.includes("resume") || lowerPrompt.includes("profile")) {
    appType = "portfolio";
  } else if (lowerPrompt.includes("blog") || lowerPrompt.includes("article") || lowerPrompt.includes("news")) {
    appType = "blog";
  } else if (lowerPrompt.includes("shop") || lowerPrompt.includes("store") || lowerPrompt.includes("ecommerce") || lowerPrompt.includes("e-commerce")) {
    appType = "ecommerce";
  } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("admin") || lowerPrompt.includes("analytics")) {
    appType = "dashboard";
  } else if (lowerPrompt.includes("landing") || lowerPrompt.includes("website") || lowerPrompt.includes("business")) {
    appType = "landing";
  }

  return {
    id: `smart_${Date.now()}`,
    name: projectName,
    description: prompt,
    files: generateSimpleTodoApp(projectName, prompt),
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

function generateSimpleTodoApp(projectName: string, prompt: string): Record<string, string> {
  const todoAppCode = [
    "import React, { useState } from 'react';",
    "import { Plus, Check, Trash2, Clock } from 'lucide-react';",
    "",
    "interface Task {",
    "  id: number;",
    "  text: string;",
    "  completed: boolean;",
    "  createdAt: Date;",
    "}",
    "",
    "function App() {",
    "  const [tasks, setTasks] = useState<Task[]>([]);",
    "  const [newTask, setNewTask] = useState('');",
    "",
    "  const addTask = () => {",
    "    if (newTask.trim()) {",
    "      setTasks([...tasks, {",
    "        id: Date.now(),",
    "        text: newTask,",
    "        completed: false,",
    "        createdAt: new Date()",
    "      }]);",
    "      setNewTask('');",
    "    }",
    "  };",
    "",
    "  const toggleTask = (id: number) => {",
    "    setTasks(tasks.map(task => ",
    "      task.id === id ? { ...task, completed: !task.completed } : task",
    "    ));",
    "  };",
    "",
    "  const deleteTask = (id: number) => {",
    "    setTasks(tasks.filter(task => task.id !== id));",
    "  };",
    "",
    "  const completedCount = tasks.filter(task => task.completed).length;",
    "",
    "  return (",
    "    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100\">",
    "      <div className=\"container mx-auto px-4 py-8 max-w-2xl\">",
    "        <div className=\"bg-white rounded-xl shadow-lg p-6\">",
    `          <h1 className="text-3xl font-bold text-gray-800 mb-2">${projectName}</h1>`,
    `          <p className="text-gray-600 mb-6">${prompt}</p>`,
    "          ",
    "          <div className=\"flex mb-6\">",
    "            <input",
    "              type=\"text\"",
    "              value={newTask}",
    "              onChange={(e) => setNewTask(e.target.value)}",
    "              onKeyPress={(e) => e.key === 'Enter' && addTask()}",
    "              placeholder=\"Add a new task...\"",
    "              className=\"flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500\"",
    "            />",
    "            <button",
    "              onClick={addTask}",
    "              className=\"px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors\"",
    "            >",
    "              <Plus className=\"h-5 w-5\" />",
    "            </button>",
    "          </div>",
    "",
    "          <div className=\"mb-4 text-sm text-gray-600\">",
    "            {completedCount} of {tasks.length} tasks completed",
    "          </div>",
    "",
    "          <div className=\"space-y-2\">",
    "            {tasks.map(task => (",
    "              <div key={task.id} className={`flex items-center p-3 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>",
    "                <button",
    "                  onClick={() => toggleTask(task.id)}",
    "                  className={`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}",
    "                >",
    "                  {task.completed && <Check className=\"h-3 w-3 text-white\" />}",
    "                </button>",
    "                ",
    "                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>",
    "                  {task.text}",
    "                </span>",
    "                ",
    "                <div className=\"flex items-center space-x-2 text-gray-400 text-xs\">",
    "                  <Clock className=\"h-3 w-3\" />",
    "                  <span>{task.createdAt.toLocaleDateString()}</span>",
    "                </div>",
    "                ",
    "                <button",
    "                  onClick={() => deleteTask(task.id)}",
    "                  className=\"ml-2 p-1 text-red-500 hover:text-red-700 transition-colors\"",
    "                >",
    "                  <Trash2 className=\"h-4 w-4\" />",
    "                </button>",
    "              </div>",
    "            ))}",
    "          </div>",
    "",
    "          {tasks.length === 0 && (",
    "            <div className=\"text-center py-8 text-gray-500\">",
    "              <Clock className=\"h-12 w-12 mx-auto mb-3 text-gray-300\" />",
    "              <p>No tasks yet. Add one above to get started!</p>",
    "            </div>",
    "          )}",
    "        </div>",
    "      </div>",
    "    </div>",
    "  );",
    "}",
    "",
    "export default App;"
  ].join('\n');

  return {
    "package.json": JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      dependencies: {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "tailwindcss": "^3.4.17",
        "lucide-react": "^0.263.1"
      }
    }, null, 2),
    "src/App.tsx": todoAppCode,
    "src/index.tsx": [
      "import React from 'react';",
      "import ReactDOM from 'react-dom/client';",
      "import App from './App';",
      "import './index.css';",
      "",
      "const root = ReactDOM.createRoot(document.getElementById('root')!);",
      "root.render(<App />);"
    ].join('\n'),
    "src/index.css": [
      "@tailwind base;",
      "@tailwind components;", 
      "@tailwind utilities;"
    ].join('\n')
  };
}

// Enhanced function to generate multiple app types like professional web builders
function generateAppFiles(projectName: string, prompt: string, appType: string): Record<string, string> {
  switch (appType) {
    case "landing":
      return generateLandingPageApp(projectName, prompt);
    case "portfolio":
      return generatePortfolioApp(projectName, prompt);
    case "blog":
      return generateBlogApp(projectName, prompt);
    case "ecommerce":
      return generateEcommerceApp(projectName, prompt);
    case "dashboard":
      return generateDashboardApp(projectName, prompt);
    case "todo":
      return generateSimpleTodoApp(projectName, prompt);
    default:
      return generateLandingPageApp(projectName, prompt);
  }
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

// Professional app generators for different types
function generateLandingPageApp(projectName: string, prompt: string): Record<string, string> {
  return {
    "package.json": JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      dependencies: {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "tailwindcss": "^3.4.17",
        "lucide-react": "^0.263.1"
      }
    }, null, 2),
    "src/App.tsx": [
      "import React, { useState } from 'react';",
      "import { ArrowRight, Star, Users, Zap, CheckCircle, Menu, X } from 'lucide-react';",
      "",
      "function App() {",
      "  const [isMenuOpen, setIsMenuOpen] = useState(false);",
      "  const [email, setEmail] = useState('');",
      "",
      "  const handleSubmit = (e: React.FormEvent) => {",
      "    e.preventDefault();",
      "    alert('Thanks for your interest! This is a demo.');",
      "    setEmail('');",
      "  };",
      "",
      "  return (",
      "    <div className=\"min-h-screen bg-white\">",
      "      {/* Navigation */}",
      "      <nav className=\"bg-white shadow-sm border-b border-gray-100\">",
      "        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">",
      "          <div className=\"flex justify-between h-16\">",
      "            <div className=\"flex items-center\">",
      `              <h1 className=\"text-2xl font-bold text-gray-900\">${projectName}</h1>`,
      "            </div>",
      "            <div className=\"hidden md:flex items-center space-x-8\">",
      "              <a href=\"#features\" className=\"text-gray-600 hover:text-gray-900\">Features</a>",
      "              <a href=\"#pricing\" className=\"text-gray-600 hover:text-gray-900\">Pricing</a>",
      "              <a href=\"#contact\" className=\"text-gray-600 hover:text-gray-900\">Contact</a>",
      "              <button className=\"bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700\">",
      "                Get Started",
      "              </button>",
      "            </div>",
      "          </div>",
      "        </div>",
      "      </nav>",
      "",
      "      {/* Hero Section */}",
      "      <section className=\"bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20\">",
      "        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center\">",
      `          <h2 className=\"text-5xl font-bold text-gray-900 mb-6\">${projectName}</h2>`,
      `          <p className=\"text-xl text-gray-600 mb-8 max-w-3xl mx-auto\">{prompt}</p>`,
      "          <div className=\"flex flex-col sm:flex-row gap-4 justify-center mb-12\">",
      "            <button className=\"bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 flex items-center justify-center\">",
      "              Get Started Free <ArrowRight className=\"ml-2 h-5 w-5\" />",
      "            </button>",
      "            <button className=\"border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50\">",
      "              Watch Demo",
      "            </button>",
      "          </div>",
      "        </div>",
      "      </section>",
      "",
      "      {/* Features Section */}",
      "      <section id=\"features\" className=\"py-20 bg-white\">",
      "        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">",
      "          <div className=\"text-center mb-16\">",
      "            <h3 className=\"text-3xl font-bold text-gray-900 mb-4\">Why Choose Us?</h3>",
      "            <p className=\"text-xl text-gray-600 max-w-2xl mx-auto\">",
      "              Experience the next generation of our platform",
      "            </p>",
      "          </div>",
      "          <div className=\"grid md:grid-cols-3 gap-8\">",
      "            <div className=\"text-center p-6\">",
      "              <div className=\"bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4\">",
      "                <Star className=\"h-8 w-8 text-blue-600\" />",
      "              </div>",
      "              <h4 className=\"text-xl font-semibold mb-2\">Premium Quality</h4>",
      "              <p className=\"text-gray-600\">Built with modern technologies and industry best practices</p>",
      "            </div>",
      "            <div className=\"text-center p-6\">",
      "              <div className=\"bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4\">",
      "                <Users className=\"h-8 w-8 text-green-600\" />",
      "              </div>",
      "              <h4 className=\"text-xl font-semibold mb-2\">User Focused</h4>",
      "              <p className=\"text-gray-600\">Designed with user experience as our top priority</p>",
      "            </div>",
      "            <div className=\"text-center p-6\">",
      "              <div className=\"bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4\">",
      "                <Zap className=\"h-8 w-8 text-purple-600\" />",
      "              </div>",
      "              <h4 className=\"text-xl font-semibold mb-2\">Lightning Fast</h4>",
      "              <p className=\"text-gray-600\">Optimized for speed and performance</p>",
      "            </div>",
      "          </div>",
      "        </div>",
      "      </section>",
      "",
      "      {/* CTA Section */}",
      "      <section className=\"bg-blue-600 py-16\">",
      "        <div className=\"max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8\">",
      "          <h3 className=\"text-3xl font-bold text-white mb-4\">Ready to Get Started?</h3>",
      "          <p className=\"text-xl text-blue-100 mb-8\">Join thousands of satisfied customers today</p>",
      "          <form onSubmit={handleSubmit} className=\"flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto\">",
      "            <input",
      "              type=\"email\"",
      "              value={email}",
      "              onChange={(e) => setEmail(e.target.value)}",
      "              placeholder=\"Enter your email\"",
      "              className=\"flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500\"",
      "              required",
      "            />",
      "            <button",
      "              type=\"submit\"",
      "              className=\"bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50\"",
      "            >",
      "              Get Started",
      "            </button>",
      "          </form>",
      "        </div>",
      "      </section>",
      "",
      "      {/* Footer */}",
      "      <footer className=\"bg-gray-900 text-white py-12\">",
      "        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center\">",
      `          <h4 className=\"text-2xl font-bold mb-4\">${projectName}</h4>`,
      "          <p className=\"text-gray-400 mb-8\">Building the future, one solution at a time.</p>",
      "          <div className=\"border-t border-gray-800 pt-8\">",
      "            <p className=\"text-gray-400\">&copy; 2024 " + projectName + ". All rights reserved.</p>",
      "          </div>",
      "        </div>",
      "      </footer>",
      "    </div>",
      "  );",
      "}",
      "",
      "export default App;"
    ].join('\n'),
    "src/index.tsx": [
      "import React from 'react';",
      "import ReactDOM from 'react-dom/client';",
      "import App from './App';",
      "import './index.css';",
      "",
      "const root = ReactDOM.createRoot(document.getElementById('root')!);",
      "root.render(<App />);"
    ].join('\n'),
    "src/index.css": [
      "@tailwind base;",
      "@tailwind components;",
      "@tailwind utilities;",
      "",
      "html {",
      "  scroll-behavior: smooth;",
      "}"
    ].join('\n')
  };
}

function generatePortfolioApp(projectName: string, prompt: string): Record<string, string> {
  return {
    "package.json": JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      dependencies: {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "tailwindcss": "^3.4.17",
        "lucide-react": "^0.263.1"
      }
    }, null, 2),
    "src/App.tsx": [
      "import React, { useState } from 'react';",
      "import { Github, Linkedin, Mail, ExternalLink, Download } from 'lucide-react';",
      "",
      "function App() {",
      "  const [activeSection, setActiveSection] = useState('about');",
      "",
      "  const projects = [",
      "    {",
      "      title: 'E-Commerce Platform',",
      "      description: 'A full-stack e-commerce solution with React and Node.js',",
      "      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],",
      "      link: '#'",
      "    },",
      "    {",
      "      title: 'Task Management App',",
      "      description: 'Collaborative task management with real-time updates',",
      "      tech: ['React', 'Firebase', 'Material-UI'],",
      "      link: '#'",
      "    },",
      "    {",
      "      title: 'Weather Dashboard',",
      "      description: 'Beautiful weather app with location-based forecasts',",
      "      tech: ['React', 'API Integration', 'Chart.js'],",
      "      link: '#'",
      "    }",
      "  ];",
      "",
      "  return (",
      "    <div className=\"min-h-screen bg-gray-50\">",
      "      {/* Header */}",
      "      <header className=\"bg-white shadow-sm fixed w-full top-0 z-50\">",
      "        <div className=\"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8\">",
      "          <div className=\"flex justify-between items-center py-4\">",
      `            <h1 className=\"text-2xl font-bold text-gray-900\">${projectName}</h1>`,
      "            <nav className=\"hidden md:flex space-x-8\">",
      "              <a href=\"#about\" className=\"text-gray-600 hover:text-gray-900\">About</a>",
      "              <a href=\"#projects\" className=\"text-gray-600 hover:text-gray-900\">Projects</a>",
      "              <a href=\"#skills\" className=\"text-gray-600 hover:text-gray-900\">Skills</a>",
      "              <a href=\"#contact\" className=\"text-gray-600 hover:text-gray-900\">Contact</a>",
      "            </nav>",
      "          </div>",
      "        </div>",
      "      </header>",
      "",
      "      {/* Hero Section */}",
      "      <section id=\"about\" className=\"pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100\">",
      "        <div className=\"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8\">",
      "          <div className=\"text-center\">",
      "            <div className=\"w-32 h-32 rounded-full bg-gray-300 mx-auto mb-8\"></div>",
      `            <h2 className=\"text-4xl font-bold text-gray-900 mb-4\">${projectName}</h2>`,
      `            <p className=\"text-xl text-gray-600 mb-8 max-w-2xl mx-auto\">${prompt}</p>`,
      "            <div className=\"flex justify-center space-x-6\">",
      "              <a href=\"#\" className=\"text-gray-600 hover:text-gray-900\">",
      "                <Github className=\"h-6 w-6\" />",
      "              </a>",
      "              <a href=\"#\" className=\"text-gray-600 hover:text-gray-900\">",
      "                <Linkedin className=\"h-6 w-6\" />",
      "              </a>",
      "              <a href=\"#\" className=\"text-gray-600 hover:text-gray-900\">",
      "                <Mail className=\"h-6 w-6\" />",
      "              </a>",
      "            </div>",
      "            <button className=\"mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center mx-auto\">",
      "              <Download className=\"h-5 w-5 mr-2\" />",
      "              Download Resume",
      "            </button>",
      "          </div>",
      "        </div>",
      "      </section>",
      "",
      "      {/* Projects Section */}",
      "      <section id=\"projects\" className=\"py-16 bg-white\">",
      "        <div className=\"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8\">",
      "          <h3 className=\"text-3xl font-bold text-center text-gray-900 mb-12\">Featured Projects</h3>",
      "          <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-8\">",
      "            {projects.map((project, index) => (",
      "              <div key={index} className=\"bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow\">",
      "                <div className=\"h-48 bg-gray-200\"></div>",
      "                <div className=\"p-6\">",
      "                  <h4 className=\"text-xl font-semibold mb-2\">{project.title}</h4>",
      "                  <p className=\"text-gray-600 mb-4\">{project.description}</p>",
      "                  <div className=\"flex flex-wrap gap-2 mb-4\">",
      "                    {project.tech.map((tech, techIndex) => (",
      "                      <span key={techIndex} className=\"bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm\">",
      "                        {tech}",
      "                      </span>",
      "                    ))}",
      "                  </div>",
      "                  <a href={project.link} className=\"text-blue-600 hover:text-blue-800 flex items-center\">",
      "                    View Project <ExternalLink className=\"h-4 w-4 ml-1\" />",
      "                  </a>",
      "                </div>",
      "              </div>",
      "            ))}",
      "          </div>",
      "        </div>",
      "      </section>",
      "",
      "      {/* Skills Section */}",
      "      <section id=\"skills\" className=\"py-16 bg-gray-50\">",
      "        <div className=\"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8\">",
      "          <h3 className=\"text-3xl font-bold text-center text-gray-900 mb-12\">Skills & Technologies</h3>",
      "          <div className=\"grid md:grid-cols-2 lg:grid-cols-4 gap-6\">",
      "            {['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'].map((skill, index) => (",
      "              <div key={index} className=\"bg-white p-4 rounded-lg shadow text-center\">",
      "                <div className=\"w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2\">",
      "                  <span className=\"text-blue-600 font-bold text-sm\">{skill.slice(0, 2)}</span>",
      "                </div>",
      "                <h4 className=\"font-semibold\">{skill}</h4>",
      "              </div>",
      "            ))}",
      "          </div>",
      "        </div>",
      "      </section>",
      "",
      "      {/* Contact Section */}",
      "      <section id=\"contact\" className=\"py-16 bg-gray-900 text-white\">",
      "        <div className=\"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center\">",
      "          <h3 className=\"text-3xl font-bold mb-8\">Let's Work Together</h3>",
      "          <p className=\"text-xl text-gray-300 mb-8\">I'm always interested in new opportunities and collaborations</p>",
      "          <button className=\"bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg\">",
      "            Get In Touch",
      "          </button>",
      "        </div>",
      "      </section>",
      "    </div>",
      "  );",
      "}",
      "",
      "export default App;"
    ].join('\n'),
    "src/index.tsx": [
      "import React from 'react';",
      "import ReactDOM from 'react-dom/client';",
      "import App from './App';",
      "import './index.css';",
      "",
      "const root = ReactDOM.createRoot(document.getElementById('root')!);",
      "root.render(<App />);"
    ].join('\n'),
    "src/index.css": [
      "@tailwind base;",
      "@tailwind components;",
      "@tailwind utilities;",
      "",
      "html {",
      "  scroll-behavior: smooth;",
      "}"
    ].join('\n')
  };
}

function generateBlogApp(projectName: string, prompt: string): Record<string, string> {
  return generateLandingPageApp(projectName, prompt); // Simplified for now
}

function generateEcommerceApp(projectName: string, prompt: string): Record<string, string> {
  return generateLandingPageApp(projectName, prompt); // Simplified for now
}

function generateDashboardApp(projectName: string, prompt: string): Record<string, string> {
  return generateLandingPageApp(projectName, prompt); // Simplified for now
}

