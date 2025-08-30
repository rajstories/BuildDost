import OpenAI from "openai";

// Use OpenRouter for dynamic AI generation with multiple models
const useOpenRouter = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== '';

export const openai = useOpenRouter 
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

// Choose the best model for each task
const getModelForTask = (task: 'analysis' | 'generation' | 'optimization') => {
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
