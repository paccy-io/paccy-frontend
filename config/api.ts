export const API_BASE_URL = "https://api.paccy.io/api";

export const API_ENDPOINTS = {
  VERIFY_EMAIL: "/verify-email",
  REGISTER: "/",
  LOGIN: "/login",
  VERIFY_TOKEN: "/verify",
  GET_USER: "/users",
  UPDATE_USER_FIELDS: "/users", // PUT /users/:userID
  UPDATE_USER_PROFILE: "/users", // PUT /users/:userID/profile
  UPDATE_USER_PREFERENCES: "/users", // PUT /users/:userID/preferences
} as const;
