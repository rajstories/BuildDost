import { type User, type InsertUser, type UpsertUser, type UpdateUserProfile, type Project, type InsertProject, type Template, type InsertTemplate, type Component, type InsertComponent } from "@shared/schema";
import { db } from "./db";
import { users, projects, templates, components } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profile: UpdateUserProfile): Promise<User | undefined>;

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

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, profileData: UpdateUserProfile): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...profileData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Project operations
  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async updateProject(id: string, updateData: Partial<Project>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Template operations
  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.isPublic, true));
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.category, category));
  }

  async createTemplate(templateData: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values(templateData)
      .returning();
    return template;
  }

  // Component operations
  async getComponent(id: string): Promise<Component | undefined> {
    const [component] = await db.select().from(components).where(eq(components.id, id));
    return component || undefined;
  }

  async getAllComponents(): Promise<Component[]> {
    return await db.select().from(components).where(eq(components.isPublic, true));
  }

  async getComponentsByCategory(category: string): Promise<Component[]> {
    return await db.select().from(components).where(eq(components.category, category));
  }

  async createComponent(componentData: InsertComponent): Promise<Component> {
    const [component] = await db
      .insert(components)
      .values(componentData)
      .returning();
    return component;
  }
}

export const storage = new DatabaseStorage();
