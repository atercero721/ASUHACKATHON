
import { z } from 'zod';
import { 
  insertUserSchema, 
  insertCourseSchema,
  insertAssignmentSchema,
  users,
  courses,
  assignments,
  announcements,
  resources
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  // Dashboard Aggregate
  dashboard: {
    get: {
      method: 'GET' as const,
      path: '/api/dashboard',
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          courses: z.array(z.custom<typeof courses.$inferSelect & { grade?: string }>()),
          announcements: z.array(z.custom<typeof announcements.$inferSelect>()),
          resources: z.array(z.custom<typeof resources.$inferSelect>()),
          tasks: z.array(z.custom<typeof assignments.$inferSelect>()),
        }),
        401: errorSchemas.internal, // Not authenticated
      },
    },
  },

  // Courses
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses',
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/courses/:id',
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },

  // Assignments
  assignments: {
    list: {
      method: 'GET' as const,
      path: '/api/assignments',
      responses: {
        200: z.array(z.custom<typeof assignments.$inferSelect>()),
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/assignments/:id',
      input: insertAssignmentSchema.partial(),
      responses: {
        200: z.custom<typeof assignments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  
  // Announcements
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements',
      responses: {
        200: z.array(z.custom<typeof announcements.$inferSelect>()),
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE EXPORTS
// ============================================
export type DashboardResponse = z.infer<typeof api.dashboard.get.responses[200]>;
