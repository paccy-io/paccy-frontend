"use server";

interface AuthResponse {
  success: boolean;
  error?: string;
  redirect?: string;
}

export async function authenticateUser(
  email: string,
  password: string,
  isLogin: boolean,
  redirectPath?: string
): Promise<AuthResponse> {
  // Server-side environment check
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    if (isLogin) {
      // Development environment - allow actual login
      const ADMIN_EMAIL = "admin@paccy.io";
      const ADMIN_PASSWORD = "123";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        return {
          success: true,
          redirect: redirectPath || "/dashboard",
        };
      } else {
        return {
          success: false,
          error:
            "Invalid email or password. Use admin@paccy.io / 123",
        };
      }
    } else {
      // Signup not available in development
      return {
        success: false,
        error:
          "Sign up is not available in development. Please use admin credentials to login.",
      };
    }
  } else {
    // Production environment - block authentication
    return {
      success: false,
      error: "AUTH_NOT_AVAILABLE",
    };
  }
}

export async function checkEnvironment(): Promise<{ isDevelopment: boolean }> {
  return {
    isDevelopment: process.env.NODE_ENV === "development",
  };
}
