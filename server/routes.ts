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

// Fallback project generator for when AI fails
function createFallbackProject(prompt: string, features: string[]): any {
  const projectName = extractProjectName(prompt);
  
  return {
    id: `fallback_${Date.now()}`,
    name: projectName,
    description: prompt,
    files: {
      "package.json": JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: "1.0.0",
        dependencies: {
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "tailwindcss": "^3.4.17"
        }
      }, null, 2),
      "src/App.tsx": `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          ${projectName}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          ${prompt}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${features.map(feature => `
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">${feature}</h3>
            <p className="text-sm text-gray-600">Ready to implement</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  );
}

export default App;`,
      "src/index.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);`,
      "src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      "README.md": `# ${projectName}

${prompt}

## Features
${features.map(f => `- ${f}`).join('\n')}

## Setup
\`\`\`bash
npm install
npm start
\`\`\`
`
    },
    structure: {
      frontend: ["src/", "src/components/", "public/"],
      backend: ["server/", "server/routes/"],
      database: ["migrations/"]
    },
    dependencies: {
      frontend: ["react", "react-dom", "tailwindcss"],
      backend: ["express", "cors", "dotenv"]
    }
  };
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
