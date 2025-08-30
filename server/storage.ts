import { type User, type InsertUser, type Project, type InsertProject, type Template, type InsertTemplate, type Component, type InsertComponent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Template operations
  getTemplate(id: string): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;

  // Component operations
  getComponent(id: string): Promise<Component | undefined>;
  getAllComponents(): Promise<Component[]>;
  getComponentsByCategory(category: string): Promise<Component[]>;
  createComponent(component: InsertComponent): Promise<Component>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private templates: Map<string, Template>;
  private components: Map<string, Component>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.templates = new Map();
    this.components = new Map();
    this.seedData();
  }

  private seedData() {
    // Add some default templates
    const templates: Template[] = [
      {
        id: randomUUID(),
        name: "SaaS Landing",
        description: "Modern SaaS product landing page",
        category: "landing",
        components: [],
        config: {},
        previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        isPublic: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "E-commerce Store",
        description: "Complete online store solution",
        category: "ecommerce",
        components: [],
        config: {},
        previewImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        isPublic: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Portfolio",
        description: "Creative portfolio showcase",
        category: "portfolio",
        components: [],
        config: {},
        previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        isPublic: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Blog",
        description: "Content-rich blog platform",
        category: "blog",
        components: [],
        config: {},
        previewImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        isPublic: true,
        createdAt: new Date(),
      },
    ];

    templates.forEach(template => this.templates.set(template.id, template));

    // Add some default components
    const components: Component[] = [
      {
        id: randomUUID(),
        name: "Header",
        category: "layout",
        code: { jsx: "", props: {} },
        config: { props: {}, styling: {} },
        previewImage: "",
        isPublic: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Button",
        category: "ui",
        code: { jsx: "", props: {} },
        config: { props: {}, styling: {} },
        previewImage: "",
        isPublic: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Card",
        category: "ui",
        code: { jsx: "", props: {} },
        config: { props: {}, styling: {} },
        previewImage: "",
        isPublic: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Grid",
        category: "layout",
        code: { jsx: "", props: {} },
        config: { props: {}, styling: {} },
        previewImage: "",
        isPublic: true,
        createdAt: new Date(),
      },
    ];

    components.forEach(component => this.components.set(component.id, component));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      userId: insertProject.userId,
      name: insertProject.name,
      description: insertProject.description || null,
      components: insertProject.components || [],
      config: insertProject.config || {},
      isPublic: insertProject.isPublic ?? false,
      status: insertProject.status || "draft",
      deploymentUrl: insertProject.deploymentUrl || null,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = {
      ...project,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.isPublic);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      template => template.category === category && template.isPublic
    );
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      name: insertTemplate.name,
      description: insertTemplate.description || null,
      category: insertTemplate.category,
      components: insertTemplate.components,
      config: insertTemplate.config,
      previewImage: insertTemplate.previewImage || null,
      isPublic: insertTemplate.isPublic ?? true,
      id,
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async getComponent(id: string): Promise<Component | undefined> {
    return this.components.get(id);
  }

  async getAllComponents(): Promise<Component[]> {
    return Array.from(this.components.values()).filter(component => component.isPublic);
  }

  async getComponentsByCategory(category: string): Promise<Component[]> {
    return Array.from(this.components.values()).filter(
      component => component.category === category && component.isPublic
    );
  }

  async createComponent(insertComponent: InsertComponent): Promise<Component> {
    const id = randomUUID();
    const component: Component = {
      name: insertComponent.name,
      category: insertComponent.category,
      code: insertComponent.code,
      config: insertComponent.config,
      previewImage: insertComponent.previewImage || null,
      isPublic: insertComponent.isPublic ?? true,
      id,
      createdAt: new Date(),
    };
    this.components.set(id, component);
    return component;
  }
}

export const storage = new MemStorage();
