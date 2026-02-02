
import { db } from "./db";
import {
  users, courses, enrollments, assignments, announcements, resources,
  type User, type InsertUser,
  type Course, type InsertCourse,
  type Enrollment, type InsertEnrollment,
  type Assignment, type InsertAssignment,
  type Announcement, type InsertAnnouncement,
  type Resource, type InsertResource,
  type DashboardData
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByAsurite(asuriteId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dashboard Data Aggregation
  getDashboardData(userId: number): Promise<DashboardData>;

  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  
  // Assignments
  getAssignments(courseId?: number): Promise<Assignment[]>;
  updateAssignment(id: number, updates: Partial<InsertAssignment>): Promise<Assignment>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;

  // Seeding
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByAsurite(asuriteId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.asuriteId, asuriteId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getDashboardData(userId: number): Promise<DashboardData> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    // Get enrollments to find courses
    const userEnrollments = await db.select().from(enrollments).where(eq(enrollments.userId, userId));
    
    const courseList = [];
    const allTasks = [];

    for (const enrollment of userEnrollments) {
      const [course] = await db.select().from(courses).where(eq(courses.id, enrollment.courseId));
      if (course) {
        // Get assignments for this course
        const courseAssignments = await db.select().from(assignments).where(eq(assignments.courseId, course.id));
        allTasks.push(...courseAssignments);

        courseList.push({
          ...course,
          grade: enrollment.currentGrade || undefined,
          assignments: courseAssignments
        });
      }
    }

    const allAnnouncements = await db.select().from(announcements);
    const allResources = await db.select().from(resources);

    return {
      user,
      courses: courseList,
      announcements: allAnnouncements,
      resources: allResources,
      tasks: allTasks.filter(t => t.status !== 'completed') // Only show pending tasks in main dashboard
    };
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getAssignments(courseId?: number): Promise<Assignment[]> {
    if (courseId) {
      return await db.select().from(assignments).where(eq(assignments.courseId, courseId));
    }
    return await db.select().from(assignments);
  }

  async updateAssignment(id: number, updates: Partial<InsertAssignment>): Promise<Assignment> {
    const [updated] = await db.update(assignments)
      .set(updates)
      .where(eq(assignments.id, id))
      .returning();
    return updated;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements);
  }

  async seedInitialData(): Promise<void> {
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) return;

    // Create 'Andy'
    const andy = await this.createUser({
      asuriteId: "andy",
      name: "Andy Tercero Vargas",
      email: "andy@asu.edu",
      affiliations: ["Student", "Staff"],
    });

    // Create Courses
    const [cse445] = await db.insert(courses).values({
      code: "CSE 445",
      title: "Distributed Software Development",
      term: "Spring 2026",
      instructor: "Dr. Chen",
      location: "BYENG 210",
      schedule: "MWF 10:30 AM - 11:20 AM",
      color: "maroon"
    }).returning();

    const [cse463] = await db.insert(courses).values({
      code: "CSE 463",
      title: "Introduction to Human-Computer Interaction",
      term: "Spring 2026",
      instructor: "Dr. Walker",
      location: "CAVC 101",
      schedule: "TTh 1:30 PM - 2:45 PM",
      color: "gold"
    }).returning();

    const [mat267] = await db.insert(courses).values({
      code: "MAT 267",
      title: "Calculus for Engineers III",
      term: "Spring 2026",
      instructor: "Dr. Smith",
      location: "PSF 173",
      schedule: "MWF 9:00 AM - 9:50 AM",
      color: "maroon"
    }).returning();

    // Enroll Andy
    await db.insert(enrollments).values([
      { userId: andy.id, courseId: cse445.id, currentGrade: "92%" },
      { userId: andy.id, courseId: cse463.id, currentGrade: "88%" },
      { userId: andy.id, courseId: mat267.id, currentGrade: "76%" },
    ]);

    // Create Assignments
    await db.insert(assignments).values([
      { courseId: cse445.id, title: "Project 3: SOA Services", dueDate: new Date("2026-03-15"), status: "pending", maxScore: "100" },
      { courseId: cse445.id, title: "Quiz 4", dueDate: new Date("2026-03-10"), status: "pending", maxScore: "20" },
      { courseId: cse463.id, title: "Heuristic Evaluation", dueDate: new Date("2026-03-12"), status: "pending", maxScore: "50" },
      { courseId: mat267.id, title: "WebWork Set 8", dueDate: new Date("2026-03-08"), status: "completed", score: "10/10", maxScore: "10" },
    ]);

    // Create Announcements
    await db.insert(announcements).values([
      { title: "Graduation Application Deadline", content: "The deadline to apply for Spring 2026 graduation is March 30th.", source: "University Registrar", priority: "high" },
      { title: "Career Fair Next Week", content: "Join us at the Memorial Union for the Spring Career Fair.", source: "Career Services", priority: "normal" },
      { title: "System Maintenance", content: "MyASU will be down for maintenance on Sunday from 2AM to 4AM.", source: "UTO", priority: "alert" },
    ]);

    // Create Resources
    await db.insert(resources).values([
      { title: "Gmail", url: "#", category: "Tools", icon: "Mail" },
      { title: "Canvas", url: "#", category: "Tools", icon: "BookOpen" },
      { title: "Drive", url: "#", category: "Tools", icon: "HardDrive" },
      { title: "Finances", url: "#", category: "Info", icon: "DollarSign" },
      { title: "Health & Wellness", url: "#", category: "Info", icon: "Heart" },
    ]);
  }
}

export const storage = new DatabaseStorage();
