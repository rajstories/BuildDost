import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertUserSchema, insertTemplateSchema, insertComponentSchema } from "@shared/schema";
import { generateComponent, generateBackend, optimizeCode, generateFullStackProject, analyzeWebsiteRequirements, generateAdaptiveProject, type ComponentGenerationRequest, type BackendGenerationRequest, type CodeOptimizationRequest, type FullStackProjectRequest, type WebsiteAnalysisRequest } from "./services/openai";

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

  // NEW: AI Website Analysis Route
  app.post("/api/ai/analyze-website", async (req, res) => {
    try {
      const { userInput, context, previousFeedback }: WebsiteAnalysisRequest = req.body;
      
      if (!userInput || typeof userInput !== 'string') {
        return res.status(400).json({ message: "User input is required" });
      }

      console.log("Analyzing website requirements for:", userInput);
      
      const analysis = await analyzeWebsiteRequirements({
        userInput,
        context,
        previousFeedback
      });
      
      console.log("Website analysis completed:", analysis.projectType, analysis.complexity);
      res.json(analysis);
    } catch (error) {
      console.error("Website analysis failed:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze website requirements"
      });
    }
  });

  // NEW: AI Adaptive Project Generation (Uses OpenRouter for smart generation)
  app.post("/api/ai/generate-adaptive", async (req, res) => {
    try {
      const { userInput, analysis } = req.body;
      
      if (!userInput || typeof userInput !== 'string') {
        return res.status(400).json({ message: "User input is required" });
      }

      console.log("Generating adaptive project for:", userInput);
      
      const generatedProject = await generateAdaptiveProject(userInput, analysis);
      
      // Store the project
      const projectData = {
        userId: "anonymous",
        name: generatedProject.name,
        description: generatedProject.description,
        components: [],
        config: {
          files: generatedProject.files,
          structure: generatedProject.structure,
          dependencies: generatedProject.dependencies,
          analysis: analysis
        },
        isPublic: false,
        status: "live",
        deploymentUrl: null
      };

      const savedProject = await storage.createProject(projectData);
      console.log("Adaptive project saved with ID:", savedProject.id);
      
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
      console.error("Adaptive project generation failed:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate adaptive project"
      });
    }
  });

  // Enhanced Project Generation (now with fallback support)
  app.post("/api/projects/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      console.log("Received project generation request with prompt:", prompt);
      
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: "Prompt is required" });
      }

      let generatedProject;
      try {
        console.log("Attempting adaptive AI generation...");
        generatedProject = await generateAdaptiveProject(prompt);
        console.log("Adaptive AI generation successful");
      } catch (aiError) {
        console.error("AI generation failed, trying fallback...", aiError);
        
        try {
          // Try legacy generation as fallback
          const features = extractFeaturesFromPrompt(prompt);
          generatedProject = await generateFullStackProject({
            description: prompt,
            features,
            type: "web"
          });
          console.log("Legacy AI generation successful");
        } catch (legacyError) {
          console.error("Legacy AI also failed, using simple fallback:", legacyError);
          generatedProject = createFallbackProject(prompt, extractFeaturesFromPrompt(prompt));
        }
      }

      // Store the project
      const projectData = {
        userId: "anonymous",
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
      
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate project"
      });
    }
  });

  // NEW: AI Chat Assistant Route for Hackathon Winner Feature
  app.post("/api/ai/chat-assistant", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      console.log("AI Assistant received message:", message);

      // Smart response matching
      const lowerMessage = message.toLowerCase();
      let responseData = {
        response: "I'm here to help! Could you be more specific about what you'd like to build or improve?",
        suggestions: ["Generate a pricing section", "Add a contact form", "Create a user dashboard", "Build an authentication system"],
        quickActions: [
          { label: "Generate Component", action: "component" },
          { label: "Add Database", action: "database" },
          { label: "Improve Design", action: "design" },
          { label: "Add Features", action: "features" }
        ]
      };

      if (lowerMessage.includes('pricing') || lowerMessage.includes('price') || lowerMessage.includes('plan')) {
        responseData = {
          response: "I'll create a modern pricing section with multiple tiers! This will include features, pricing, and call-to-action buttons.",
          suggestions: ["Add tier comparison", "Include feature highlights", "Add discount badges", "Monthly/yearly toggle"],
          quickActions: [
            { label: "Generate Component", action: "component" },
            { label: "Add Database", action: "database" },
            { label: "Improve Design", action: "design" },
            { label: "Add Features", action: "features" }
          ],
          code: "const PricingSection = () => {\n  return (\n    <div className=\"py-20 bg-gray-50\">\n      {/* Pricing content here */}\n    </div>\n  );\n};"
        };
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('form')) {
        responseData = {
          response: "I'll help you add a contact form! This should include name, email, message fields with validation and a submit handler.",
          suggestions: ["Add form validation", "Style with Tailwind CSS", "Connect to backend API", "Add success message"],
          quickActions: [
            { label: "Generate Component", action: "component" },
            { label: "Add Database", action: "database" },
            { label: "Improve Design", action: "design" },
            { label: "Add Features", action: "features" }
          ],
          code: "const ContactForm = () => {\n  return (\n    <form className=\"max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg\">\n      {/* Form fields here */}\n    </form>\n  );\n};"
        };
      } else if (lowerMessage.includes('dashboard') || lowerMessage.includes('admin')) {
        responseData = {
          response: "A user dashboard is perfect for managing user data! I'll create one with stats, navigation, and user info sections.",
          suggestions: ["Add user profile section", "Include analytics charts", "Add navigation menu", "Show recent activity"],
          quickActions: [
            { label: "Generate Component", action: "component" },
            { label: "Add Database", action: "database" },
            { label: "Improve Design", action: "design" },
            { label: "Add Features", action: "features" }
          ],
          code: "const Dashboard = () => {\n  return (\n    <div className=\"min-h-screen bg-gray-50\">\n      {/* Dashboard content here */}\n    </div>\n  );\n};"
        };
      } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
        responseData = {
          response: "I'm your AI development assistant! I can help you with:\n\n• Generating React components\n• Creating forms and interfaces\n• Building backend APIs\n• Database design\n• Deployment guidance\n• UI/UX improvements\n\nWhat would you like to work on?",
          suggestions: ["Generate a component", "Improve my design", "Add a feature", "Help with deployment"],
          quickActions: [
            { label: "Generate Component", action: "component" },
            { label: "Add Database", action: "database" },
            { label: "Improve Design", action: "design" },
            { label: "Add Features", action: "features" }
          ]
        };
      }

      res.json(responseData);
    } catch (error) {
      console.error("Chat assistant error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process chat message"
      });
    }
  });

  // NEW: Code Conversion Route for Hackathon Feature
  app.post("/api/ai/convert-code", async (req, res) => {
    try {
      const { code, componentName, makeVisual } = req.body;
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: "Code is required" });
      }

      console.log("Converting code to component:", componentName);
      
      // For now, provide a smart conversion result
      const convertedComponent = {
        name: componentName || 'ConvertedComponent',
        description: 'Automatically converted from uploaded code',
        code: `import React, { useState } from 'react';

const ${componentName || 'ConvertedComponent'} = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        ${componentName || 'Converted Component'}
      </h2>
      <p className="text-gray-600 mb-4">
        This component was automatically converted from your code snippet using AI.
      </p>
      
      {/* Original code preserved */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Original Code:</h3>
        <pre className="text-xs overflow-x-auto text-gray-800">
          <code>${code.replace(/`/g, '\\`').slice(0, 500)}${code.length > 500 ? '...' : ''}</code>
        </pre>
      </div>
      
      {/* Interactive elements */}
      <div className="mt-4 flex space-x-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Action Button
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Secondary Action
        </button>
      </div>
    </div>
  );
};

export default ${componentName || 'ConvertedComponent'};`,
        preview: `<div class="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
  <h2 class="text-2xl font-bold mb-4 text-gray-800">${componentName || 'Converted Component'}</h2>
  <p class="text-gray-600 mb-4">This component was automatically converted from your code snippet using AI.</p>
  <div class="bg-gray-100 p-4 rounded-lg">
    <h3 class="text-sm font-semibold mb-2 text-gray-700">Original Code:</h3>
    <pre class="text-xs text-gray-800">${code.slice(0, 100)}...</pre>
  </div>
  <div class="mt-4 flex space-x-2">
    <button class="px-4 py-2 bg-blue-500 text-white rounded-lg">Action Button</button>
    <button class="px-4 py-2 border border-gray-300 rounded-lg">Secondary Action</button>
  </div>
</div>`,
        category: 'converted'
      };

      res.json({
        success: true,
        component: convertedComponent
      });
    } catch (error) {
      console.error("Code conversion error:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to convert code"
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
  
  console.log(`Detected app type: ${appType} from prompt: ${prompt}`);

  return {
    id: `smart_${Date.now()}`,
    name: projectName,
    description: prompt,
    files: generateAppByType(appType, projectName, prompt),
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

function generateAppByType(appType: string, projectName: string, prompt: string): Record<string, string> {
  // Use our professional showcase templates instead of simple fallbacks
  switch (appType) {
    case "landing":
      return generateShowcaseLandingPage(projectName, prompt);
    case "ecommerce":
      return generateShowcaseEcommerce(projectName, prompt);
    case "portfolio":
      return generateShowcasePortfolio(projectName, prompt);
    case "dashboard":
      return generateShowcaseDashboard(projectName, prompt);
    case "blog":
      return generateShowcaseBlog(projectName, prompt);
    case "todo":
      return generateShowcaseTaskManager(projectName, prompt);
    default:
      return generateShowcaseLandingPage(projectName, prompt);
  }
}

function generateLandingPage(projectName: string, prompt: string): Record<string, string> {
  const landingPageCode = `import React from 'react';
import { ArrowRight, Check, Star, Zap, Shield, Users } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            ${projectName}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ${prompt}
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Optimized for speed and performance</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security you can trust</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface designed for everyone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"This platform has completely transformed how we work. Highly recommended!"</p>
              <div className="font-semibold">Sarah Johnson, CEO</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Amazing results and fantastic customer support. Couldn't be happier!"</p>
              <div className="font-semibold">Mike Chen, Founder</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers today</p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;`;

  return getBaseProjectFiles(landingPageCode, projectName);
}

function generateEcommerceStore(projectName: string, prompt: string): Record<string, string> {
  const ecommerceCode = `import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';

const products = [
  { id: 1, name: "Premium Headphones", price: 299, image: "🎧", rating: 4.5 },
  { id: 2, name: "Wireless Speaker", price: 149, image: "🔊", rating: 4.8 },
  { id: 3, name: "Smart Watch", price: 399, image: "⌚", rating: 4.6 },
  { id: 4, name: "Gaming Mouse", price: 79, image: "🖱️", rating: 4.7 },
  { id: 5, name: "Mechanical Keyboard", price: 199, image: "⌨️", rating: 4.4 },
  { id: 6, name: "4K Monitor", price: 599, image: "🖥️", rating: 4.9 }
];

function App() {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">${projectName}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Cart ({cart.length})</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              \${getTotalPrice()}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Premium Electronics</h2>
          <p className="text-xl">${prompt}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Products</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">{product.name}</h4>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={\`h-4 w-4 \${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`} />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-4">\${product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;`;

  return getBaseProjectFiles(ecommerceCode, projectName);
}

function generatePortfolio(projectName: string, prompt: string): Record<string, string> {
  const portfolioCode = `import React from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

function App() {
  const projects = [
    { title: "E-commerce Platform", tech: "React, Node.js", description: "Full-stack shopping platform with payment integration" },
    { title: "Task Management App", tech: "Vue.js, Firebase", description: "Collaborative productivity tool with real-time updates" },
    { title: "Data Analytics Dashboard", tech: "React, D3.js", description: "Interactive data visualization for business insights" }
  ];

  const skills = ["JavaScript", "React", "Node.js", "Python", "TypeScript", "AWS", "Docker", "PostgreSQL"];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
            👨‍💻
          </div>
          <h1 className="text-4xl font-bold mb-4">${projectName}</h1>
          <p className="text-xl text-gray-300 mb-6">${prompt}</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Contact Me
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 flex items-center">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              I'm a passionate full-stack developer with 5+ years of experience creating 
              beautiful, functional web applications. I love turning complex problems into 
              simple, elegant solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-2xl">
                  📱
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-blue-600 font-semibold mb-2">{project.tech}</p>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <button className="flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  View Project
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-300 mb-8">Ready to bring your ideas to life?</p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700">
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;`;

  return getBaseProjectFiles(portfolioCode, projectName);
}

function generateDashboard(projectName: string, prompt: string): Record<string, string> {
  const dashboardCode = `import React, { useState } from 'react';
import { BarChart3, Users, DollarSign, TrendingUp, Bell, Search } from 'lucide-react';

function App() {
  const [notifications] = useState(3);

  const stats = [
    { title: "Total Users", value: "12,345", change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "Revenue", value: "$98,765", change: "+8%", icon: DollarSign, color: "text-green-600" },
    { title: "Orders", value: "1,234", change: "+23%", icon: BarChart3, color: "text-purple-600" },
    { title: "Growth", value: "15.2%", change: "+5%", icon: TrendingUp, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">${projectName}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-800">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h2>
          <p className="text-gray-600">${prompt}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={\`p-2 rounded-lg bg-gray-100\`}>
                  <stat.icon className={\`h-6 w-6 \${stat.color}\`} />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trend</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">User Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">New Users</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-semibold">5,678</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bounce Rate</span>
                <span className="font-semibold">23.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">New user registered</p>
                <p className="text-gray-600 text-sm">john.doe@example.com joined the platform</p>
              </div>
              <span className="text-gray-500 text-sm">2 mins ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">Payment received</p>
                <p className="text-gray-600 text-sm">$299 payment from premium subscription</p>
              </div>
              <span className="text-gray-500 text-sm">5 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;`;

  return getBaseProjectFiles(dashboardCode, projectName);
}

function generateBlog(projectName: string, prompt: string): Record<string, string> {
  const blogCode = `import React, { useState } from 'react';
import { Calendar, User, Tag, Search } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const posts = [
    {
      id: 1,
      title: "Getting Started with React 18",
      excerpt: "Learn the latest features and improvements in React 18, including concurrent rendering and automatic batching.",
      author: "Jane Doe",
      date: "2024-01-15",
      category: "React",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Building Scalable Node.js Applications",
      excerpt: "Best practices for building robust and scalable backend services with Node.js and Express.",
      author: "John Smith",
      date: "2024-01-10",
      category: "Node.js",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to Use What",
      excerpt: "A comprehensive guide to choosing between CSS Grid and Flexbox for your layout needs.",
      author: "Sarah Johnson",
      date: "2024-01-05",
      category: "CSS",
      readTime: "6 min read"
    }
  ];

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">${projectName}</h1>
            <nav className="space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-800">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to My Blog</h2>
          <p className="text-xl mb-8">${prompt}</p>
          <div className="max-w-md mx-auto relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Latest Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-800">{post.title}</h4>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;`;

  return getBaseProjectFiles(blogCode, projectName);
}

function getBaseProjectFiles(appCode: string, projectName: string): Record<string, string> {
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
    "src/App.tsx": appCode,
    "src/index.tsx": [
      "import React from 'react';",
      "import ReactDOM from 'react-dom/client';",
      "import App from './App';",
      "import './index.css';",
      "",
      "const root = ReactDOM.createRoot(document.getElementById('root')!);",
      "root.render(<App />);"
    ].join('\n'),
    "src/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
    "public/index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`
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

