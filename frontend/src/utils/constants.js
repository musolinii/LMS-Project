export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
};

export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const COURSE_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  // Student routes
  STUDENT_DASHBOARD: '/student/dashboard',
  MY_COURSES: '/student/courses',
  COURSE_VIEW: '/student/courses/:courseId',
  // Instructor routes
  INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
  MANAGE_COURSES: '/instructor/courses',
  CREATE_COURSE: '/instructor/courses/create',
  EDIT_COURSE: '/instructor/courses/:courseId/edit',
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
};

export const CATEGORIES = [
  'web-development',
  'mobile-development',
  'data-science',
  'machine-learning',
  'design',
  'devops',
  'cybersecurity',
  'business',
  'general',
];
