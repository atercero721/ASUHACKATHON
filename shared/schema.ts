
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// User table (mocking CAS user data)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  asuriteId: text("asurite_id").notNull().unique(), // e.g. "andy"
  name: text("name").notNull(),
  email: text("email").notNull(),
  affiliations: text("affiliations").array(), // e.g. ["student", "staff"]
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses/Classes
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(), // e.g. "CSE 445"
  title: text("title").notNull(), // e.g. "Distributed Software Development"
  term: text("term").notNull(), // e.g. "Spring 2024"
  instructor: text("instructor").notNull(),
  location: text("location"),
  schedule: text("schedule"), // e.g. "MWF 10:30 AM - 11:20 AM"
  credits: integer("credits").default(3),
  color: text("color").default("maroon"), // UI color theme
});

// Enrollments (link users to courses)
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  role: text("role").default("student"), // student, ta, instructor
  currentGrade: text("current_grade"), // e.g. "A", "95%"
});

// Assignments/Tasks
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  dueDate: timestamp("due_date"),
  status: text("status").default("pending"), // pending, submitted, graded
  score: text("score"),
  maxScore: text("max_score"),
});

// Announcements/News
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull(), // e.g. "University Registrar", "CSE Department"
  date: timestamp("date").defaultNow(),
  priority: text("priority").default("normal"), // normal, high, alert
});

// Quick Links / Resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(), // e.g. "Academic Support", "Finances"
  icon: text("icon"), // lucide icon name
});


// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

// Compound types for UI
export type CourseWithGrade = Course & {
  grade?: string;
  assignments?: Assignment[];
};

export type DashboardData = {
  user: User;
  courses: CourseWithGrade[];
  announcements: Announcement[];
  resources: Resource[];
  tasks: Assignment[];
};
