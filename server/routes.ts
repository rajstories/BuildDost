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
      res.status(400).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/components", async (req, res) => {
    try {
      const componentData = insertComponentSchema.parse(req.body);
      const component = await storage.createComponent(componentData);
      res.json(component);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI Full-Stack Project Generation
  app.post("/api/projects/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // Extract features from the prompt
      const features = extractFeaturesFromPrompt(prompt);
      
      const generatedProject = await generateFullStackProject({
        description: prompt,
        features,
        type: "web"
      });

      // Store the project
      const projectData = {
        name: generatedProject.name,
        description: generatedProject.description,
        components: [],
        config: {
          files: generatedProject.files,
          structure: generatedProject.structure,
          dependencies: generatedProject.dependencies
        },
        isPublic: false,
        deployUrl: null
      };

      const savedProject = await storage.createProject(projectData);
      
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
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to generate project"
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
