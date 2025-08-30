import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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
