
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

export class InMemoryStorage implements IStorage {
  private users: User[] = [];
  private courses: Course[] = [];
  private enrollments: Enrollment[] = [];
  private assignments: Assignment[] = [];
  private announcements: Announcement[] = [];
  private resources: Resource[] = [];

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByAsurite(asuriteId: string): Promise<User | undefined> {
    return this.users.find(u => u.asuriteId === asuriteId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const user: User = { id, ...insertUser } as unknown as User;
    this.users.push(user);
    return user;
  }

  async getDashboardData(userId: number): Promise<DashboardData> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const userEnrollments = this.enrollments.filter(e => e.userId === userId);

    const courseList: Array<any> = [];
    const allTasks: Assignment[] = [];

    for (const enrollment of userEnrollments) {
      const course = this.courses.find(c => c.id === enrollment.courseId);
      if (course) {
        const courseAssignments = this.assignments.filter(a => a.courseId === course.id);
        allTasks.push(...courseAssignments);
        courseList.push({
          ...course,
          grade: (enrollment as any).currentGrade || undefined,
          assignments: courseAssignments
        });
      }
    }

    return {
      user,
      courses: courseList,
      announcements: this.announcements,
      resources: this.resources,
      tasks: allTasks.filter(t => (t as any).status !== 'completed')
    } as DashboardData;
  }

  async getCourses(): Promise<Course[]> {
    return this.courses;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.find(c => c.id === id);
  }

  async getAssignments(courseId?: number): Promise<Assignment[]> {
    if (typeof courseId === 'number') {
      return this.assignments.filter(a => a.courseId === courseId);
    }
    return this.assignments;
  }

  async updateAssignment(id: number, updates: Partial<InsertAssignment>): Promise<Assignment> {
    const idx = this.assignments.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Assignment not found');
    const updated = { ...this.assignments[idx], ...updates } as Assignment;
    this.assignments[idx] = updated;
    return updated;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return this.announcements;
  }

  async seedInitialData(): Promise<void> {
    if (this.users.length > 0) return;

    // Create 'Andy'
    const andy = await this.createUser({
      asuriteId: "andy",
      name: "Andy Tercero Vargas",
      email: "andy@asu.edu",
      affiliations: ["Student", "Staff"],
    });

    // Create Courses
    const cse445: Course = { id: 1, code: "CSE 445", title: "Distributed Software Development", term: "Spring 2026", instructor: "Dr. Chen", location: "BYENG 210", schedule: "MWF 10:30 AM - 11:20 AM", color: "maroon" } as Course;
    const cse463: Course = { id: 2, code: "CSE 463", title: "Introduction to Human-Computer Interaction", term: "Spring 2026", instructor: "Dr. Walker", location: "CAVC 101", schedule: "TTh 1:30 PM - 2:45 PM", color: "gold" } as Course;
    const mat267: Course = { id: 3, code: "MAT 267", title: "Calculus for Engineers III", term: "Spring 2026", instructor: "Dr. Smith", location: "PSF 173", schedule: "MWF 9:00 AM - 9:50 AM", color: "maroon" } as Course;

    this.courses.push(cse445, cse463, mat267);

    // Enroll Andy
    this.enrollments.push(
      { id: 1, userId: andy.id, courseId: cse445.id, currentGrade: "92%" } as Enrollment,
      { id: 2, userId: andy.id, courseId: cse463.id, currentGrade: "88%" } as Enrollment,
      { id: 3, userId: andy.id, courseId: mat267.id, currentGrade: "76%" } as Enrollment,
    );

    // Create Assignments
    this.assignments.push(
      { id: 1, courseId: cse445.id, title: "Project 3: SOA Services", dueDate: new Date("2026-03-15"), status: "pending", maxScore: "100" } as unknown as Assignment,
      { id: 2, courseId: cse445.id, title: "Quiz 4", dueDate: new Date("2026-03-10"), status: "pending", maxScore: "20" } as unknown as Assignment,
      { id: 3, courseId: cse463.id, title: "Heuristic Evaluation", dueDate: new Date("2026-03-12"), status: "pending", maxScore: "50" } as unknown as Assignment,
      { id: 4, courseId: mat267.id, title: "WebWork Set 8", dueDate: new Date("2026-03-08"), status: "completed", score: "10/10", maxScore: "10" } as unknown as Assignment,
    );

    // Create Announcements
    this.announcements.push(
      { id: 1, title: "Graduation Application Deadline", content: "The deadline to apply for Spring 2026 graduation is March 30th.", source: "University Registrar", priority: "high" } as Announcement,
      { id: 2, title: "Career Fair Next Week", content: "Join us at the Memorial Union for the Spring Career Fair.", source: "Career Services", priority: "normal" } as Announcement,
      { id: 3, title: "System Maintenance", content: "MyASU will be down for maintenance on Sunday from 2AM to 4AM.", source: "UTO", priority: "alert" } as Announcement,
    );

    // Create Resources
    this.resources.push(
      { id: 1, title: "Gmail", url: "#", category: "Tools", icon: "Mail" } as Resource,
      { id: 2, title: "Canvas", url: "#", category: "Tools", icon: "BookOpen" } as Resource,
      { id: 3, title: "Drive", url: "#", category: "Tools", icon: "HardDrive" } as Resource,
      { id: 4, title: "Finances", url: "#", category: "Info", icon: "DollarSign" } as Resource,
      { id: 5, title: "Health & Wellness", url: "#", category: "Info", icon: "Heart" } as Resource,
    );
  }
}

export const storage = new InMemoryStorage();
