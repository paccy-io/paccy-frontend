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
  // For now, allow development admin access
  if (isLogin) {
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
        error: "Invalid email or password.",
      };
    }
  } else {
    // Signup functionality will use the registration page instead
    return {
      success: false,
      error: "Please use the registration page to create an account.",
    };
  }
}

export async function checkEnvironment(): Promise<{ isDevelopment: boolean }> {
  return {
    isDevelopment: process.env.NODE_ENV === "development",
  };
}
