import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

interface TemplateExportOptions {
  templateId: string;
  format: 'zip' | 'github';
  repository?: string;
}

export class TemplateExportService {
  private getTemplatePath(templateId: string): string {
    const templatePaths: Record<string, string> = {
      'landing': 'client/src/templates/landing-page.tsx',
      'portfolio': 'client/src/templates/portfolio.tsx',
      'ecommerce': 'client/src/templates/ecommerce.tsx',
      'blog': 'client/src/templates/blog.tsx',
      'dashboard': 'client/src/templates/dashboard.tsx',
      'todo': 'client/src/templates/task-manager.tsx'
    };
    
    return templatePaths[templateId] || '';
  }

  async getTemplateSource(templateId: string): Promise<string> {
    const templatePath = this.getTemplatePath(templateId);
    
    if (!templatePath || !fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    return fs.readFileSync(templatePath, 'utf-8');
  }

  async createTemplateProject(templateId: string): Promise<string> {
    const templateSource = await this.getTemplateSource(templateId);
    
    // Create a complete project structure
    const projectStructure = {
      'package.json': this.generatePackageJson(templateId),
      'index.html': this.generateIndexHtml(templateId),
      'src/App.tsx': this.generateAppComponent(templateId, templateSource),
      'src/main.tsx': this.generateMainComponent(),
      'vite.config.ts': this.generateViteConfig(),
      'tailwind.config.js': this.generateTailwindConfig(),
      'tsconfig.json': this.generateTsConfig(),
      'README.md': this.generateReadme(templateId),
      '.gitignore': this.generateGitignore()
    };

    return JSON.stringify(projectStructure, null, 2);
  }

  async exportAsZip(templateId: string): Promise<Buffer> {
    const projectStructure = JSON.parse(await this.createTemplateProject(templateId));
    
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];
      
      archive.on('data', chunk => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);
      
      // Add each file to the archive
      Object.entries(projectStructure).forEach(([filePath, content]) => {
        archive.append(content as string, { name: filePath });
      });
      
      archive.finalize();
    });
  }

  async exportToGitHub(templateId: string, repository: string): Promise<{ success: boolean; repositoryUrl?: string; error?: string }> {
    try {
      // In a real implementation, this would use GitHub API
      // For demo purposes, we'll simulate the process
      const projectData = await this.createTemplateProject(templateId);
      
      // Simulate GitHub repository creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        repositoryUrl: `https://github.com/user/${repository}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private generatePackageJson(templateId: string): string {
    const templateNames: Record<string, string> = {
      'landing': 'Landing Page Template',
      'portfolio': 'Portfolio Template',
      'ecommerce': 'E-commerce Template',
      'blog': 'Blog Template',
      'dashboard': 'Dashboard Template',
      'todo': 'Task Manager Template'
    };

    return JSON.stringify({
      name: `${templateId}-template`,
      version: "1.0.0",
      description: templateNames[templateId] || "BuildDost Template",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "lucide-react": "^0.263.1",
        "class-variance-authority": "^0.7.0",
        clsx: "^2.0.0",
        "tailwind-merge": "^1.14.0"
      },
      devDependencies: {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@vitejs/plugin-react": "^4.0.3",
        autoprefixer: "^10.4.14",
        postcss: "^8.4.27",
        tailwindcss: "^3.3.0",
        typescript: "^5.0.2",
        vite: "^4.4.5"
      }
    }, null, 2);
  }

  private generateIndexHtml(templateId: string): string {
    const templateNames: Record<string, string> = {
      'landing': 'Landing Page',
      'portfolio': 'Portfolio',
      'ecommerce': 'E-commerce Store',
      'blog': 'Blog',
      'dashboard': 'Admin Dashboard',
      'todo': 'Task Manager'
    };

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${templateNames[templateId]} - BuildDost Template</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }

  private generateAppComponent(templateId: string, templateSource: string): string {
    // Extract the component content and modify it to work as a standalone app
    const componentContent = templateSource
      .replace(/import.*from.*@\/.*;\n/g, '') // Remove local imports
      .replace(/export default function.*Template/, 'function App')
      .replace(/TemplateActions[^}]*}/, ''); // Remove TemplateActions

    return `import React from 'react';
import './index.css';

// Button Component
const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: any) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md'
  };
  
  return (
    <button 
      className={\`\${baseClasses} \${variants[variant]} \${sizes[size]} \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
};

// Badge Component  
const Badge = ({ children, className = '', ...props }: any) => {
  return (
    <div className={\`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 \${className}\`} {...props}>
      {children}
    </div>
  );
};

// Lucide Icons (simplified)
const ArrowRight = ({ className = '', ...props }: any) => (
  <svg className={\`\${className}\`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// Add other icons as needed...

${componentContent}

export default App;`;
  }

  private generateMainComponent(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})`;
  }

  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
  }

  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    }, null, 2);
  }

  private generateReadme(templateId: string): string {
    const templateNames: Record<string, string> = {
      'landing': 'Landing Page',
      'portfolio': 'Portfolio', 
      'ecommerce': 'E-commerce Store',
      'blog': 'Blog',
      'dashboard': 'Admin Dashboard',
      'todo': 'Task Manager'
    };

    return `# ${templateNames[templateId]} Template

This is a React + TypeScript + Tailwind CSS template generated by BuildDost.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Features

- ⚡️ Vite for fast development
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🚀 Ready for deployment

## Customization

This template is fully customizable. Edit the components in the \`src\` directory to match your needs.

---

Generated with ❤️ by [BuildDost](https://builddost.replit.app)`;
  }

  private generateGitignore(): string {
    return `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`;
  }
}

export const templateExportService = new TemplateExportService();