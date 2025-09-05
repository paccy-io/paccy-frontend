export const API_BASE_URL = "https://api.paccy.io/api";

export const API_ENDPOINTS = {
  VERIFY_EMAIL: "/verify-email",
  REGISTER: "/register",
  LOGIN: "/login",
  VERIFY_TOKEN: "/verify",
  GET_USER: "/users",
  UPDATE_USER_FIELDS: "/users", // PUT /users/:userID
  UPDATE_USER_PROFILE: "/users", // PUT /users/:userID/profile
  UPDATE_USER_PREFERENCES: "/users", // PUT /users/:userID/preferences

  // College Applications
  COLLEGE_APPLICATIONS: "/college-applications",
  COLLEGE_APPLICATION_DEADLINES: "/college-applications/deadlines/upcoming",
  COLLEGE_APPLICATION_CHECKLISTS: "/college-applications/checklists",
  COLLEGE_APPLICATION_TASKS: "/college-applications/tasks",

  // Essays
  ESSAYS: "/essays",

  // Extracurriculars
  EXTRACURRICULARS: "/extracurriculars",

  // Calendar
  CALENDAR: "/calendar",
  CALENDAR_INBOX: "/calendar/inbox",
  CALENDAR_DATE_RANGE: "/calendar/date-range",
  CALENDAR_TYPE: "/calendar/type",
  CALENDAR_PRIORITY: "/calendar/priority",
  CALENDAR_UPCOMING: "/calendar/upcoming",
  CALENDAR_COUNT: "/calendar/count",
} as const;
