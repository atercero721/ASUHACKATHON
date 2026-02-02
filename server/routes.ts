
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed data on startup
  await storage.seedInitialData();

  // Mock Authentication Middleware (sets user to 'Andy' for demo)
  app.use(async (req, res, next) => {
    // In a real app, this would check session/token
    // For this demo, we assume the user is ID 1 (Andy)
    const user = await storage.getUser(1);
    if (user) {
      (req as any).user = user;
    }
    next();
  });

  // API Routes

  app.get(api.dashboard.get.path, async (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const data = await storage.getDashboardData(user.id);
    res.json(data);
  });

  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get(api.courses.get.path, async (req, res) => {
    const course = await storage.getCourse(Number(req.params.id));
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  });

  app.get(api.assignments.list.path, async (req, res) => {
    const assignments = await storage.getAssignments();
    res.json(assignments);
  });

  app.patch(api.assignments.update.path, async (req, res) => {
    try {
      const input = api.assignments.update.input.parse(req.body);
      const updated = await storage.updateAssignment(Number(req.params.id), input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(404).json({ message: "Assignment not found" });
    }
  });

  app.get(api.announcements.list.path, async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  return httpServer;
}
