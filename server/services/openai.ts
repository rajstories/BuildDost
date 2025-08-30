import OpenAI from "openai";

// Prefer Gemini API for best educational platform understanding, then OpenRouter, then OpenAI
const useGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== '';
const useOpenRouter = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== '';

export const openai = useGemini
  ? null // Gemini will be handled separately
  : useOpenRouter 
    ? new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://builddost.com",
          "X-Title": "BuildDost AI Website Builder",
        }
      })
    : process.env.OPENAI_API_KEY 
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;

// Function to get Gemini client when needed
async function getGeminiClient() {
  if (!useGemini) return null;
  
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    console.log("✅ Gemini AI configured for intelligent educational platform generation");
    return client;
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
    return null;
  }
}

// Choose the best model for each task - Gemini 2.5 Flash is excellent for educational platforms
const getModelForTask = (task: 'analysis' | 'generation' | 'optimization') => {
  if (useGemini) {
    return "gemini-2.5-flash"; // Gemini 2.5 Flash for intelligent context understanding
  }
  
  if (!useOpenRouter) return "gpt-5"; // fallback to GPT-5 if using OpenAI directly
  
  switch (task) {
    case 'analysis':
      return "anthropic/claude-3.5-sonnet"; // Best for analysis and understanding
    case 'generation':
      return "openai/gpt-4-turbo"; // Best for code generation
    case 'optimization':
      return "meta-llama/llama-3.1-70b-instruct"; // Good for optimization
    default:
      return "anthropic/claude-3.5-sonnet";
  }
};

export interface ComponentGenerationRequest {
  description: string;
  type?: string;
  style?: string;
  functionality?: string[];
}

export interface GeneratedComponent {
  name: string;
  category: string;
  code: {
    jsx: string;
    css?: string;
    props: Record<string, any>;
  };
  config: {
    props: Record<string, {
      type: string;
      default: any;
      required: boolean;
    }>;
    styling: Record<string, any>;
  };
}

export interface ChatResponse {
  response: string;
  suggestions: string[];
  quickActions: Array<{ label: string; action: string; icon?: string }>;
}

// Real-time AI application generation like Replit AI
export interface AppGenerationRequest {
  prompt: string;
  features?: string[];
  style?: string;
}

export interface GeneratedApp {
  id: string;
  name: string;
  description: string;
  appType: string;
  files: Record<string, string>;
  preview: {
    mainComponent: string;
    styling: string;
    features: string[];
  };
  structure: {
    frontend: string[];
    backend: string[];
    database: string[];
  };
}

export async function generateCustomApp(request: AppGenerationRequest): Promise<GeneratedApp> {
  const prompt = `You are an expert full-stack developer. Create a complete React application based on this user request: "${request.prompt}"

ANALYSIS: First understand what the user wants to build:
- For "educational platform" → Create a learning management system with courses, students, lessons, quizzes
- For "food delivery website with login and cart" → Create a restaurant delivery app with menus, cart, ordering
- For "todo list app" → Create a task management app with projects and collaboration
- For "portfolio website" → Create a personal showcase with projects and skills
- For "learning system" → Create educational platform with course enrollment, progress tracking
- For "online course platform" → Create LMS with video lessons, assignments, student dashboard

REQUIREMENTS:
- Generate a complete, functional React application
- Use TypeScript, Tailwind CSS, and modern React patterns
- Include realistic data and content (not placeholders)
- Make it production-ready with proper state management
- Include all requested features (login, cart, etc.)
- Style: ${request.style || 'modern, professional, and user-friendly'}
- Additional features: ${request.features?.join(', ') || 'standard functionality'}

Return a JSON object with this exact structure:
{
  "id": "app_timestamp",
  "name": "App Name",
  "description": "Brief description of the app",
  "appType": "ecommerce|portfolio|dashboard|blog|todo|landing",
  "files": {
    "App.tsx": "complete main React component code",
    "components/Header.tsx": "header component code", 
    "components/MainContent.tsx": "main content component code",
    "types.ts": "TypeScript type definitions",
    "data.ts": "realistic sample data"
  },
  "preview": {
    "mainComponent": "App",
    "styling": "tailwindcss",
    "features": ["feature1", "feature2", "feature3"]
  },
  "structure": {
    "frontend": ["src/", "src/components/", "src/types/"],
    "backend": ["api/", "api/routes/"],
    "database": ["schemas/", "migrations/"]
  }
}

IMPORTANT: Generate REAL, FUNCTIONAL code that works immediately. Include realistic data, not placeholders.`;

  try {
    // Use Gemini for superior educational platform understanding
    if (useGemini) {
      const gemini = await getGeminiClient();
      if (gemini) {
        const response = await gemini.models.generateContent({
        model: getModelForTask('generation'),
        config: {
          systemInstruction: "You are BuildDost AI - an expert full-stack developer who creates complete, production-ready applications. You excel at understanding educational platforms, learning management systems, and course structures. Always respond with valid JSON containing functional React code.",
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              appType: { type: "string" },
              files: { type: "object" },
              preview: { type: "object" },
              structure: { type: "object" }
            },
            required: ["name", "description", "appType", "files"]
          }
        },
        contents: prompt,
      });

      const result = JSON.parse(response.text || "{}");
      
      // Add generated ID if not provided
      if (!result.id) {
        result.id = `app_${Date.now()}`;
      }
      
      console.log(`✅ Gemini generated ${result.appType} app: ${result.name}`);
      return result as GeneratedApp;
      }
    }

    // Fallback to OpenAI/OpenRouter
    if (!openai) {
      throw new Error("No AI API configured");
    }

    const response = await openai.chat.completions.create({
      model: getModelForTask('generation'),
      messages: [
        {
          role: "system",
          content: "You are BuildDost AI - an expert full-stack developer who creates complete, production-ready applications. Always respond with valid JSON containing functional React code."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Add generated ID if not provided
    if (!result.id) {
      result.id = `app_${Date.now()}`;
    }
    
    return result as GeneratedApp;
  } catch (error) {
    throw new Error(`Failed to generate custom app: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateComponent(request: ComponentGenerationRequest): Promise<GeneratedComponent> {
  const prompt = `Generate a React component based on this description: "${request.description}"

Requirements:
- Use TypeScript and Tailwind CSS
- Make it responsive and accessible
- Include proper prop types and default values
- Use modern React patterns (functional components with hooks)
- Component type: ${request.type || 'any'}
- Styling preference: ${request.style || 'modern and clean'}
- Functionality needed: ${request.functionality?.join(', ') || 'basic functionality'}

Return a JSON object with this structure:
{
  "name": "ComponentName",
  "category": "ui|layout|forms|navigation",
  "code": {
    "jsx": "complete React component code",
    "css": "additional CSS if needed",
    "props": {"propName": "defaultValue"}
  },
  "config": {
    "props": {
      "propName": {
        "type": "string|number|boolean|array|object",
        "default": "defaultValue",
        "required": true/false
      }
    },
    "styling": {
      "colors": ["primary", "secondary"],
      "sizes": ["sm", "md", "lg"],
      "variants": ["default", "outline"]
    }
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert React developer who creates high-quality, production-ready components. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as GeneratedComponent;
  } catch (error) {
    throw new Error(`Failed to generate component: ${error.message}`);
  }
}

export interface BackendGenerationRequest {
  description: string;
  features: string[];
  database?: boolean;
  authentication?: boolean;
  apiEndpoints?: string[];
}

export interface GeneratedBackend {
  endpoints: Array<{
    method: string;
    path: string;
    code: string;
    description: string;
  }>;
  models: Array<{
    name: string;
    schema: string;
    relationships: string[];
  }>;
  middleware: Array<{
    name: string;
    code: string;
    purpose: string;
  }>;
  packageDependencies: string[];
}

export async function generateBackend(request: BackendGenerationRequest): Promise<GeneratedBackend> {
  const prompt = `Generate a complete backend API based on this description: "${request.description}"

Requirements:
- Use Node.js with Express and TypeScript
- Use Drizzle ORM for database operations
- Include proper error handling and validation
- Features needed: ${request.features.join(', ')}
- Include database models: ${request.database ? 'yes' : 'no'}
- Include authentication: ${request.authentication ? 'yes' : 'no'}
- API endpoints: ${request.apiEndpoints?.join(', ') || 'standard CRUD operations'}

Return a JSON object with this structure:
{
  "endpoints": [
    {
      "method": "GET|POST|PUT|DELETE",
      "path": "/api/endpoint",
      "code": "complete endpoint code",
      "description": "what this endpoint does"
    }
  ],
  "models": [
    {
      "name": "ModelName",
      "schema": "Drizzle schema definition",
      "relationships": ["relatedModel1", "relatedModel2"]
    }
  ],
  "middleware": [
    {
      "name": "middlewareName",
      "code": "middleware code",
      "purpose": "what this middleware does"
    }
  ],
  "packageDependencies": ["package1", "package2"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert backend developer who creates production-ready APIs. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as GeneratedBackend;
  } catch (error) {
    throw new Error(`Failed to generate backend: ${error.message}`);
  }
}

export interface CodeOptimizationRequest {
  code: string;
  type: 'frontend' | 'backend';
  improvements: string[];
}

export async function optimizeCode(request: CodeOptimizationRequest): Promise<{ optimizedCode: string; improvements: string[] }> {
  const prompt = `Optimize this ${request.type} code:

\`\`\`
${request.code}
\`\`\`

Focus on these improvements: ${request.improvements.join(', ')}

Return a JSON object with:
{
  "optimizedCode": "improved code",
  "improvements": ["list of improvements made"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert code optimizer who improves performance, readability, and maintainability. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    throw new Error(`Failed to optimize code: ${error.message}`);
  }
}

export interface FullStackProjectRequest {
  description: string;
  features: string[];
  type: "web" | "mobile" | "desktop";
}

export interface GeneratedProject {
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

export async function generateFullStackProject(request: FullStackProjectRequest): Promise<GeneratedProject> {
  const prompt = `Generate a complete, production-ready full-stack web application based on this description: "${request.description}"

Features to include: ${request.features.join(", ")}

Create a modern web application with:

FRONTEND (React + TypeScript + Tailwind CSS):
- Component-based architecture
- Responsive design
- State management
- Form handling and validation
- Error boundaries
- Loading states
- Accessibility features

BACKEND (Express.js + TypeScript):
- RESTful API endpoints
- Middleware stack (CORS, body parser, error handling)
- Input validation with Zod
- Database integration with Drizzle ORM
- Authentication if needed
- Proper error responses

DATABASE (PostgreSQL):
- Normalized schema
- Proper relationships
- Indexes for performance

Provide a complete file structure with all necessary files including:
- package.json files
- TypeScript configs
- Component files
- API route files
- Database schema
- Styling files
- README instructions

Return a JSON object with this exact structure:
{
  "id": "unique_project_id",
  "name": "Project Name",
  "description": "Project description",
  "files": {
    "package.json": "frontend package.json content",
    "server/package.json": "backend package.json content",
    "src/App.tsx": "main app component code",
    "src/components/Component.tsx": "component code",
    "server/index.ts": "main server file",
    "server/routes/api.ts": "API routes",
    "shared/schema.ts": "database schema",
    "README.md": "setup instructions"
  },
  "structure": {
    "frontend": ["src/", "src/components/", "src/pages/", "src/lib/"],
    "backend": ["server/", "server/routes/", "server/middleware/"],
    "database": ["shared/", "migrations/"]
  },
  "dependencies": {
    "frontend": ["react", "typescript", "tailwindcss", "vite"],
    "backend": ["express", "drizzle-orm", "zod", "cors"]
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a senior full-stack developer who creates production-ready applications. Always respond with valid JSON containing complete, working code."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Ensure we have a proper project structure
    return {
      id: result.id || `project_${Date.now()}`,
      name: result.name || extractProjectName(request.description),
      description: result.description || request.description,
      files: result.files || {},
      structure: result.structure || {
        frontend: ["src/", "src/components/", "src/pages/"],
        backend: ["server/", "server/routes/"],
        database: ["shared/"]
      },
      dependencies: result.dependencies || {
        frontend: ["react", "typescript", "tailwindcss"],
        backend: ["express", "drizzle-orm", "zod"]
      }
    };
  } catch (error) {
    throw new Error(`Failed to generate full-stack project: ${error.message}`);
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

// NEW: Dynamic website analysis for intelligent generation
export interface WebsiteAnalysisRequest {
  userInput: string;
  context?: string;
  previousFeedback?: string[];
}

export interface WebsiteAnalysis {
  projectType: string;
  complexity: 'simple' | 'moderate' | 'complex';
  suggestedFeatures: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: boolean;
  };
  timeline: string;
  recommendations: string[];
}

export async function analyzeWebsiteRequirements(request: WebsiteAnalysisRequest): Promise<WebsiteAnalysis> {
  if (!openai) {
    throw new Error("AI service not configured");
  }

  const prompt = `Analyze this website/app request and provide intelligent recommendations:

User Input: "${request.userInput}"
Context: ${request.context || 'None'}
Previous Feedback: ${request.previousFeedback?.join(', ') || 'None'}

Provide a comprehensive analysis to help generate the perfect website. Consider:
- What type of website/app this should be
- Complexity level based on features needed
- Essential features to include
- Best technology stack
- Development timeline
- Recommendations for success

Return a JSON object with this structure:
{
  "projectType": "e-commerce|portfolio|blog|dashboard|landing-page|social-platform|saas|other",
  "complexity": "simple|moderate|complex",
  "suggestedFeatures": ["feature1", "feature2", "feature3"],
  "techStack": {
    "frontend": ["react", "tailwindcss", "typescript"],
    "backend": ["express", "node.js"],
    "database": true/false
  },
  "timeline": "estimated development time",
  "recommendations": ["recommendation1", "recommendation2"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: getModelForTask('analysis'),
      messages: [
        {
          role: "system",
          content: "You are an expert product manager and technical architect who analyzes project requirements and provides intelligent recommendations for web development. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as WebsiteAnalysis;
  } catch (error) {
    throw new Error(`Failed to analyze website requirements: ${error.message}`);
  }
}

// Enhanced project generation with analysis
export async function generateAdaptiveProject(userInput: string, analysis?: WebsiteAnalysis): Promise<GeneratedProject> {
  if (!openai) {
    throw new Error("AI service not configured");
  }
  
  // If no analysis provided, generate one first
  if (!analysis) {
    analysis = await analyzeWebsiteRequirements({ userInput });
  }

  const prompt = `Generate a complete, production-ready ${analysis.projectType} application based on this intelligent analysis:

Original Request: "${userInput}"
Project Type: ${analysis.projectType}
Complexity: ${analysis.complexity}
Suggested Features: ${analysis.suggestedFeatures.join(', ')}
Tech Stack: ${JSON.stringify(analysis.techStack)}

Create a modern, responsive web application that perfectly matches the user's needs with:

FRONTEND (React + TypeScript + Tailwind CSS):
- Modern component architecture
- Responsive design for all devices
- Interactive UI elements
- Form handling and validation
- Loading states and error handling
- Accessibility features (ARIA labels, keyboard navigation)
- ${analysis.complexity === 'complex' ? 'Advanced state management and routing' : 'Simple state management'}

BACKEND (Express.js + TypeScript):
- RESTful API endpoints for all features
- Proper middleware stack (CORS, security, validation)
- Input validation with Zod schemas
- ${analysis.techStack.database ? 'PostgreSQL database with Drizzle ORM' : 'In-memory storage'}
- Error handling and logging
- ${analysis.suggestedFeatures.includes('authentication') ? 'User authentication and authorization' : ''}

SPECIFIC FEATURES:
${analysis.suggestedFeatures.map(feature => `- ${feature}`).join('\n')}

Return a JSON object with complete working code for all files:
{
  "id": "unique_project_id",
  "name": "Project Name",
  "description": "Project description",
  "files": {
    "package.json": "complete package.json with all dependencies",
    "src/App.tsx": "main app component with routing",
    "src/components/[ComponentName].tsx": "all UI components",
    "src/pages/[PageName].tsx": "all page components",
    "server/index.ts": "complete server setup",
    "server/routes/api.ts": "all API endpoints",
    "shared/schema.ts": "database schema if needed",
    "README.md": "setup and usage instructions"
  },
  "structure": {
    "frontend": ["src/", "src/components/", "src/pages/", "src/lib/"],
    "backend": ["server/", "server/routes/"],
    "database": ["shared/"]
  },
  "dependencies": {
    "frontend": ["list of frontend packages"],
    "backend": ["list of backend packages"]
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: getModelForTask('generation'),
      messages: [
        {
          role: "system",
          content: "You are a senior full-stack developer who creates production-ready, modern web applications. Generate complete, working code that perfectly matches the analysis. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      id: result.id || `project_${Date.now()}`,
      name: result.name || extractProjectName(userInput),
      description: result.description || userInput,
      files: result.files || {},
      structure: result.structure || {
        frontend: ["src/", "src/components/", "src/pages/"],
        backend: ["server/", "server/routes/"],
        database: analysis.techStack.database ? ["shared/"] : []
      },
      dependencies: result.dependencies || {
        frontend: analysis.techStack.frontend,
        backend: analysis.techStack.backend
      }
    };
  } catch (error) {
    throw new Error(`Failed to generate adaptive project: ${error.message}`);
  }
}

export async function generateIntelligentChatResponse(userMessage: string): Promise<ChatResponse> {
  if (!openai) {
    throw new Error("OpenAI client not configured");
  }

  try {
    const prompt = `You are BuildDost, an intelligent AI assistant that helps users build websites and apps. Analyze the user's message and provide a helpful response with actionable suggestions.

User Message: "${userMessage}"

Please provide:
1. A conversational, encouraging response that acknowledges their idea
2. 3-4 specific suggestions for next steps
3. 2-4 quick actions they can take immediately

Consider these aspects:
- What type of app/website they want (landing page, e-commerce, portfolio, dashboard, etc.)
- Technical requirements they might need
- Design preferences or inspirations
- Features and functionality
- Target audience

Respond with JSON in this exact format:
{
  "response": "A friendly, encouraging response that shows you understand their idea and provides helpful guidance (2-3 sentences)",
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2", 
    "Specific actionable suggestion 3",
    "Specific actionable suggestion 4"
  ],
  "quickActions": [
    {
      "label": "Action Label",
      "action": "action_type",
      "icon": "code|palette|database|sparkles"
    }
  ]
}

Make responses specific to their request. For example:
- If they want an e-commerce site, suggest shopping cart features, payment integration, product catalogs
- If they want a portfolio, suggest gallery layouts, contact forms, project showcases
- If they want a landing page, suggest hero sections, call-to-action buttons, feature highlights
- If they want a dashboard, suggest data visualization, user management, analytics

Quick action types should be:
- create_landing, build_ecommerce, make_portfolio, design_dashboard, generate_component, create_api
- Or suggest browsing existing templates that match their needs`;

    const response = await openai.chat.completions.create({
      model: getModelForTask('analysis'),
      messages: [
        {
          role: "system",
          content: "You are BuildDost, a helpful AI assistant for building websites and apps. Be encouraging, specific, and actionable in your responses. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Ensure we have valid data with fallbacks
    return {
      response: result.response || "I'd love to help you build that! Let me suggest some ways to get started.",
      suggestions: Array.isArray(result.suggestions) ? result.suggestions.slice(0, 4) : [
        "Start with a template that matches your vision",
        "Define your target audience and key features",
        "Choose a modern, responsive design approach",
        "Plan your content structure and navigation"
      ],
      quickActions: Array.isArray(result.quickActions) ? result.quickActions.slice(0, 4) : [
        { label: "Browse Templates", action: "browse_templates", icon: "palette" },
        { label: "Start Building", action: "create_project", icon: "code" }
      ]
    };
  } catch (error) {
    console.error("Error generating chat response:", error);
    
    // Fallback response for errors
    return {
      response: "I'm excited to help you build something amazing! Let me suggest some ways we can get started with your project.",
      suggestions: [
        "Browse our template gallery for inspiration",
        "Start with a simple landing page layout",
        "Define your main features and goals",
        "Choose colors and styling preferences"
      ],
      quickActions: [
        { label: "View Templates", action: "browse_templates", icon: "palette" },
        { label: "Start Building", action: "create_landing", icon: "code" },
        { label: "Get Inspired", action: "view_showcase", icon: "sparkles" }
      ]
    };
  }
}

export async function generateProjectFromDescription(description: string): Promise<{
  success: boolean;
  project?: {
    name: string;
    files: Record<string, string>;
    config?: any;
  };
  error?: string;
}> {
  if (!openai) {
    return { success: false, error: "OpenAI client not configured" };
  }

  try {
    console.log(`Generating project from: ${description}`);

    const prompt = `You are an expert full-stack developer. Generate a complete, working website/app based on this description: "${description}"

Create a fully functional project with:
1. Modern, responsive HTML with proper semantic structure
2. Beautiful CSS styling (embedded or inline) with modern design
3. Interactive JavaScript functionality where appropriate
4. Professional, production-ready code
5. Mobile-responsive design

Respond with JSON in this exact format:
{
  "name": "Project Name (descriptive, 2-4 words)",
  "files": {
    "index.html": "Complete HTML file with embedded CSS and JS",
    "style.css": "Additional CSS if needed (optional)",
    "script.js": "Additional JavaScript if needed (optional)"
  },
  "config": {
    "type": "website|app|landing|portfolio|ecommerce|dashboard",
    "framework": "vanilla|react|vue",
    "features": ["list", "of", "key", "features"]
  }
}

Requirements:
- Make it beautiful and modern (use gradients, shadows, animations)
- Include real functionality, not just placeholders
- Use modern CSS (flexbox, grid, custom properties)
- Add hover effects and smooth transitions
- Make it responsive for mobile and desktop
- Include proper meta tags and SEO
- Use semantic HTML5 elements
- Add interactive elements where appropriate

For specific types:
- Landing pages: Hero section, features, CTA buttons, contact forms
- E-commerce: Product listings, shopping cart, checkout form
- Portfolio: Project gallery, about section, contact info
- Dashboard: Charts/stats, navigation, user interface elements
- Apps: Interactive functionality, form handling, data display

Focus on creating something that looks professional and works immediately.`;

    const response = await openai.chat.completions.create({
      model: getModelForTask('generation'),
      messages: [
        {
          role: "system",
          content: "You are a senior full-stack developer who creates beautiful, functional websites. Generate complete, working code that users can immediately use and be impressed by. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.name || !result.files || !result.files["index.html"]) {
      return { success: false, error: "Invalid project structure generated" };
    }

    return {
      success: true,
      project: {
        name: result.name,
        files: result.files,
        config: result.config || { type: "website", framework: "vanilla", features: [] }
      }
    };

  } catch (error) {
    console.error("Error generating project:", error);
    
    // Fallback: Generate a simple template based on common keywords
    const fallbackProject = generateFallbackProject(description);
    if (fallbackProject) {
      return { success: true, project: fallbackProject };
    }
    
    return { success: false, error: error.message };
  }
}

function generateFallbackProject(description: string): {
  name: string;
  files: Record<string, string>;
  config: any;
} | null {
  const lowerDesc = description.toLowerCase();
  
  // Landing page template
  if (lowerDesc.includes('landing') || lowerDesc.includes('fitness') || lowerDesc.includes('app')) {
    return {
      name: "Fitness App Landing",
      files: {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitTracker - Your Personal Fitness Journey</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .hero p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .cta-button {
            display: inline-block;
            background: #ff6b6b;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover { transform: translateY(-2px); }
        
        .features {
            padding: 80px 0;
            background: #f8f9fa;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 50px;
        }
        
        .feature {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature:hover { transform: translateY(-5px); }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 20px;
        }
        
        .stats {
            background: #667eea;
            color: white;
            padding: 60px 0;
            text-align: center;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
        }
        
        .stat h3 {
            font-size: 3rem;
            margin-bottom: 10px;
        }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .hero p { font-size: 1.1rem; }
            .features-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>Transform Your Fitness Journey</h1>
            <p>Track workouts, monitor progress, and achieve your fitness goals with our AI-powered app</p>
            <a href="#" class="cta-button">Download Free App</a>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2 class="section-title">Why Choose FitTracker?</h2>
            <div class="features-grid">
                <div class="feature">
                    <div class="feature-icon">💪</div>
                    <h3>Smart Workouts</h3>
                    <p>AI-generated workout plans tailored to your fitness level and goals</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <h3>Progress Tracking</h3>
                    <p>Visual analytics to monitor your strength, endurance, and body composition</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <h3>Goal Setting</h3>
                    <p>Set personalized fitness goals and get guided step-by-step plans</p>
                </div>
            </div>
        </div>
    </section>

    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                <div class="stat">
                    <h3>100K+</h3>
                    <p>Active Users</p>
                </div>
                <div class="stat">
                    <h3>2M+</h3>
                    <p>Workouts Completed</p>
                </div>
                <div class="stat">
                    <h3>4.9★</h3>
                    <p>App Store Rating</p>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Simple smooth scrolling for CTA button
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            alert('🎉 App download coming soon! This is a demo landing page.');
        });
        
        // Add some interactive animations
        const features = document.querySelectorAll('.feature');
        features.forEach(feature => {
            feature.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                this.style.color = 'white';
            });
            feature.addEventListener('mouseleave', function() {
                this.style.background = 'white';
                this.style.color = '#333';
            });
        });
    </script>
</body>
</html>`
      },
      config: {
        type: "landing",
        framework: "vanilla",
        features: ["hero-section", "features-grid", "statistics", "responsive", "animations"]
      }
    };
  }
  
  // Portfolio template
  if (lowerDesc.includes('portfolio') || lowerDesc.includes('personal')) {
    return {
      name: "Creative Portfolio",
      files: {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        .nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            z-index: 1000;
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        
        .logo { font-size: 1.5rem; font-weight: 700; }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 30px;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
        }
        
        .hero {
            padding: 120px 0 80px;
            text-align: center;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
        }
        
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .hero p {
            font-size: 1.3rem;
            opacity: 0.9;
        }
        
        .projects {
            padding: 80px 0;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            padding: 0 20px;
        }
        
        .project-card {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .project-card:hover { transform: translateY(-10px); }
        
        .project-image {
            height: 200px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: white;
        }
        
        .project-content {
            padding: 30px;
        }
        
        .contact {
            background: #f8f9fa;
            padding: 80px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="nav-container">
            <div class="logo">Portfolio</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section class="hero" id="home">
        <h1>Creative Designer</h1>
        <p>Crafting beautiful digital experiences</p>
    </section>

    <section class="projects" id="projects">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 50px;">Featured Projects</h2>
        <div class="projects-grid">
            <div class="project-card">
                <div class="project-image">🎨</div>
                <div class="project-content">
                    <h3>Brand Identity</h3>
                    <p>Complete visual identity for modern startup</p>
                </div>
            </div>
            <div class="project-card">
                <div class="project-image">📱</div>
                <div class="project-content">
                    <h3>Mobile App UI</h3>
                    <p>Intuitive user interface for fitness tracking app</p>
                </div>
            </div>
            <div class="project-card">
                <div class="project-image">🌐</div>
                <div class="project-content">
                    <h3>Web Platform</h3>
                    <p>E-commerce platform with modern design</p>
                </div>
            </div>
        </div>
    </section>

    <section class="contact" id="contact">
        <h2>Let's Work Together</h2>
        <p>Ready to bring your ideas to life?</p>
        <button style="background: #667eea; color: white; padding: 15px 30px; border: none; border-radius: 25px; font-size: 1.1rem; margin-top: 20px;">Get In Touch</button>
    </section>
</body>
</html>`
      },
      config: {
        type: "portfolio",
        framework: "vanilla",
        features: ["navigation", "hero", "project-grid", "contact", "smooth-scroll"]
      }
    };
  }
  
  // E-commerce template
  if (lowerDesc.includes('shop') || lowerDesc.includes('store') || lowerDesc.includes('ecommerce')) {
    return {
      name: "Modern Shop",
      files: {
        "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Shop - Premium Products</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        .header {
            background: white;
            padding: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        
        .logo { font-size: 2rem; font-weight: 700; color: #333; }
        
        .cart {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }
        
        .products {
            padding: 80px 0;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            padding: 0 20px;
        }
        
        .product-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .product-card:hover { transform: translateY(-5px); }
        
        .product-image {
            height: 200px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: white;
        }
        
        .product-info {
            padding: 20px;
        }
        
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
            margin: 10px 0;
        }
        
        .add-to-cart {
            width: 100%;
            background: #667eea;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .add-to-cart:hover { background: #5a6fd8; }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-container">
            <div class="logo">ModernShop</div>
            <a href="#" class="cart">Cart (0)</a>
        </div>
    </header>

    <section class="hero">
        <h1>Premium Products</h1>
        <p>Discover our curated collection of premium items</p>
    </section>

    <section class="products">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 50px;">Featured Products</h2>
        <div class="products-grid">
            <div class="product-card">
                <div class="product-image">👟</div>
                <div class="product-info">
                    <h3>Premium Sneakers</h3>
                    <p>Comfortable and stylish sneakers for everyday wear</p>
                    <div class="product-price">$89.99</div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">👕</div>
                <div class="product-info">
                    <h3>Designer T-Shirt</h3>
                    <p>High-quality cotton t-shirt with modern design</p>
                    <div class="product-price">$39.99</div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">⌚</div>
                <div class="product-info">
                    <h3>Smart Watch</h3>
                    <p>Advanced fitness tracking and connectivity features</p>
                    <div class="product-price">$199.99</div>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    </section>

    <script>
        let cartCount = 0;
        const cartElement = document.querySelector('.cart');
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                cartCount++;
                cartElement.textContent = \`Cart (\${cartCount})\`;
                this.textContent = 'Added!';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.background = '#667eea';
                }, 2000);
            });
        });
    </script>
</body>
</html>`
      },
      config: {
        type: "ecommerce",
        framework: "vanilla",
        features: ["product-grid", "shopping-cart", "responsive", "interactions"]
      }
    };
  }
  
  return null;
}
