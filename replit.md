# BuildDost - AI-Powered Full-Stack Website Builder

## Overview

BuildDost is an AI-powered platform that enables non-technical users to create and deploy full-stack web applications using visual design tools combined with AI-assisted code generation. The platform allows users to design frontend interfaces visually, automatically generate production-ready code, create backend APIs and database models, and deploy complete applications with minimal technical knowledge.

The application follows a modern full-stack architecture with a React frontend built using Vite, an Express.js backend with TypeScript, PostgreSQL database with Drizzle ORM, and AI integration for code generation. The platform emphasizes ease of use for non-technical founders while providing powerful features like drag-and-drop design, AI chat assistance, and one-click deployment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built as a Single Page Application (SPA) using React with TypeScript and Vite as the build tool. The application uses a component-based architecture with shadcn/ui components for consistent UI design. Routing is handled by Wouter for client-side navigation, and state management utilizes React Query (TanStack Query) for server state and React hooks for local state. The styling system combines Tailwind CSS for utility-first styling with CSS custom properties for theming, supporting both dark and light modes.

### Backend Architecture
The backend implements a RESTful API using Express.js with TypeScript, following a modular route-based structure. The server includes middleware for request logging, error handling, and JSON parsing. The application uses an in-memory storage implementation (MemStorage) for development with interfaces designed to support database integration. The AI service integration uses OpenAI's API for component generation, backend API generation, and code optimization.

### Visual Builder System
The core builder functionality consists of three main components: a drag-and-drop canvas for visual design, a component library with categorized UI elements, and a properties panel for component customization. The canvas supports real-time component placement and editing, while the component library provides pre-built elements organized by categories (layout, UI, forms). The properties panel offers dynamic property editing based on the selected component type.

### Database Design
The database schema uses PostgreSQL with Drizzle ORM, defining four main entities: users for authentication and user management, projects for storing application data and configurations, templates for reusable design patterns, and components for custom UI elements. Each table includes proper relationships, timestamps, and JSON fields for flexible data storage. The schema supports features like project sharing, component categorization, and deployment tracking.

### AI Integration
The AI system integrates with OpenAI's API to provide intelligent code generation capabilities. The service handles component generation from natural language descriptions, backend API generation with database models, and code optimization. The AI assistant provides real-time help through a chat interface, allowing users to describe their requirements and receive generated components or suggestions.

### Authentication and Security
The application implements session-based authentication with user registration and login functionality. Security measures include input validation using Zod schemas, error handling middleware, and proper CORS configuration. The system supports user isolation for projects and components while allowing public sharing of templates.

## External Dependencies

### Core Framework Dependencies
- **React 18** with TypeScript for the frontend framework
- **Express.js** for the backend server framework
- **Vite** as the build tool and development server
- **Wouter** for client-side routing

### Database and ORM
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations
- **Neon Database** serverless PostgreSQL hosting
- **Drizzle Kit** for database migrations and schema management

### UI and Styling
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessible UI primitives
- **shadcn/ui** component library for consistent design
- **Lucide React** for icon library
- **Class Variance Authority** for component variants

### State Management and Data Fetching
- **TanStack React Query** for server state management
- **React Hook Form** with Hookform Resolvers for form handling
- **Zod** for runtime type validation and schema definition

### AI and External Services
- **OpenAI API** for AI-powered code generation
- **React Icons** for additional icon sets

### Development and Build Tools
- **TypeScript** for type safety across the application
- **ESBuild** for production server bundling
- **PostCSS** with Autoprefixer for CSS processing
- **TSX** for TypeScript execution in development

### UI Enhancement Libraries
- **Embla Carousel** for carousel components
- **React Day Picker** for date selection
- **CMDK** for command palette functionality
- **Date-fns** for date manipulation utilities