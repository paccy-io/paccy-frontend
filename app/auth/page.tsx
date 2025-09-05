"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { authenticateUser, checkEnvironment } from "../actions/auth";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDevModal, setShowDevModal] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    acceptTerms: false,
  });

  useEffect(() => {
    document.title = `${isLogin ? "Sign In" : "Sign Up"} | Paccy`;
  }, [isLogin]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/dashboard";
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Real-time username validation
    if (name === "username" && !isLogin) {
      const usernameValidationError = validateUsername(value);
      setUsernameError(usernameValidationError || "");
    }
  };

  const validateUsername = (username: string): string | null => {
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (username.length > 50) {
      return "Username must be no more than 50 characters long";
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return "Username can only contain letters and numbers";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        // Handle Login using backend API
        // Validate form
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields");
          return;
        }
        // Make API call for login
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        if (response.ok) {
          const loginData = await response.json();
          console.log("Login successful:", loginData); // Debug log

          // Check if user is verified from backend response
          const isVerified =
            loginData.is_verified ||
            loginData.verified ||
            loginData.email_verified ||
            true; // Default to true if not specified

          if (!isVerified) {
            setError(
              "Please verify your email address before signing in. Check your inbox for a verification link."
            );
            return;
          }

          // Handle successful login - store token for verification
          const token = loginData.data.token || loginData.data.access_token;

          if (token) {
            // Store token temporarily for dashboard verification process
            localStorage.setItem("auth-token", token);
            document.cookie = `auth-token=${token}; path=/; max-age=86400`; // 24 hours

            // Basic user data for immediate auth state
            const basicUserData = {
              id: loginData.id,
              email: loginData.email || formData.email,
              name:
                loginData.name ||
                loginData.first_name + " " + loginData.last_name ||
                formData.email,
              verified: isVerified,
            };

            // Use the updated AuthProvider login method with basic data
            // Full user data will be fetched by dashboard via verifyTokenAndFetchUser
            const loginSuccess = await login(basicUserData, token);
            if (loginSuccess) {
              const redirectPath = searchParams.get("redirect") || "/dashboard";
              router.push(redirectPath);
            } else {
              setError("Failed to complete login. Please try again.");
            }
          } else {
            setError("No authentication token received. Please try again.");
          }
        } else {
          console.log("Login failed with status:", response.status); // Debug log

          let errorMessage = "Login failed. Please try again.";

          // Handle different HTTP status codes
          if (response.status === 400) {
            errorMessage = "Invalid email or password.";
          } else if (response.status === 401) {
            errorMessage = "Invalid email or password.";
          } else if (response.status === 403) {
            errorMessage = "Account is not verified. Please check your email.";
          } else if (response.status === 429) {
            errorMessage =
              "Too many login attempts. Please wait a moment and try again.";
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }

          try {
            const errorData = await response.json();
            console.log("Login error data:", errorData); // Debug log

            // Handle different error response structures
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (typeof errorData === "string") {
              errorMessage = errorData;
            } else if (
              errorData.non_field_errors &&
              Array.isArray(errorData.non_field_errors)
            ) {
              errorMessage = errorData.non_field_errors.join(", ");
            }
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
            // Keep the status-based error message if JSON parsing fails
          }

          setError(errorMessage);
        }
      } else {
        // Handle Registration using API
        // Validate form
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.username ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setError("Please fill in all fields");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return;
        }

        if (!formData.acceptTerms) {
          setError("You must accept the Terms of Service to continue");
          return;
        }

        // Validate username
        const usernameError = validateUsername(formData.username);
        if (usernameError) {
          setError(usernameError);
          return;
        }

        // Make API call for registration
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              username: formData.username,
              first_name: formData.firstName,
              last_name: formData.lastName,
              password: formData.password,
              terms_accepted: formData.acceptTerms,
            }),
          }
        );

        if (response.ok) {
          // Registration successful - switch to login mode
          setIsLogin(true);
          setFormData({
            email: formData.email, // Keep email for convenience
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            username: "",
            acceptTerms: false,
          });
          setError("");
          // Show success message
          setSuccess(
            "Registration successful! Please check your email to verify your account."
          );
        } else {
          console.log("Registration failed with status:", response.status); // Debug log

          let errorMessage = "Registration failed. Please try again.";

          // Handle different HTTP status codes
          if (response.status === 400) {
            errorMessage =
              "Invalid registration data. Please check your inputs.";
          } else if (response.status === 409) {
            errorMessage =
              "An account with this email or username already exists.";
          } else if (response.status === 422) {
            errorMessage = "Validation error. Please check your inputs.";
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (response.status === 429) {
            errorMessage =
              "Too many requests. Please wait a moment and try again.";
          }

          try {
            const errorData = await response.json();
            console.log("Registration error data:", errorData); // Debug log

            // Handle different error response structures
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (typeof errorData === "string") {
              errorMessage = errorData;
            } else if (errorData.errors && Array.isArray(errorData.errors)) {
              // Handle validation errors array
              errorMessage = errorData.errors.join(", ");
            } else if (
              errorData.non_field_errors &&
              Array.isArray(errorData.non_field_errors)
            ) {
              // Handle Django-style errors
              errorMessage = errorData.non_field_errors.join(", ");
            } else if (typeof errorData === "object") {
              // Handle field-specific errors
              const fieldErrors = [];
              for (const [field, errors] of Object.entries(errorData)) {
                if (
                  field === "email" ||
                  field === "username" ||
                  field === "password" ||
                  field === "first_name" ||
                  field === "last_name"
                ) {
                  if (Array.isArray(errors)) {
                    fieldErrors.push(`${field}: ${errors.join(", ")}`);
                  } else if (typeof errors === "string") {
                    fieldErrors.push(`${field}: ${errors}`);
                  }
                }
              }
              if (fieldErrors.length > 0) {
                errorMessage = fieldErrors.join("; ");
              }
            }
          } catch (parseError) {
            console.error("Failed to parse error response:", parseError);
            // Keep the status-based error message if JSON parsing fails
          }

          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err); // Debug log

      // More detailed error handling for both login and registration
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Unable to connect to server. Please check your internet connection."
        );
      } else if (err instanceof Error) {
        setError(`Network error: ${err.message}`);
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setShowDevModal(true);
  };

  const handleActualSubmit = async () => {
    setShowDevModal(false);
    // Redirect to alpha registration instead of actual login
    router.push("/alpha");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setUsernameError("");
    // Reset form when switching modes
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      username: "",
      acceptTerms: false,
    });
  };

  return (
    <div className="">
      <Navbar />

      <div className="min-h-screen bg-[#141414] py-20 pt-28">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FEEBD8]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

        {/* Development Notice Banner */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg p-4 text-center">
            <p className="text-orange-300 text-sm">
              <span className="font-semibold">🚀 Coming Soon:</span> A few
              features are still under active development! Most of the interface
              is ready for you to explore, with the remaining updates coming
              very soon.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FEEBD8] via-blue-300 to-purple-500 bg-clip-text text-transparent mb-4 font-climate-crisis">
              {isLogin ? "Welcome Back" : "Start Your Journey"}
            </h1>
            <p className="text-white/70 text-lg">
              {isLogin
                ? "Sign in to continue your college application journey"
                : "Create your account and unlock your potential"}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20 backdrop-blur-sm">
            {/* Mode Toggle */}
            <div className="flex mb-8 bg-[#141414] rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isLogin
                    ? "bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !isLogin
                    ? "bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields (Register only) */}
              {!isLogin && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                        placeholder="John"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                        placeholder="Doe"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#141414] border rounded-xl text-white placeholder-white/50 focus:outline-none transition-colors ${
                        usernameError
                          ? "border-red-500/50 focus:border-red-500"
                          : formData.username && !usernameError
                          ? "border-green-500/50 focus:border-green-500"
                          : "border-[#FEEBD8]/20 focus:border-[#FEEBD8]"
                      }`}
                      placeholder="johndoe123"
                      required={!isLogin}
                      maxLength={50}
                    />
                    <div className="mt-2 text-xs">
                      <p className="text-white/50 mb-1">
                        3-50 characters, letters and numbers only
                      </p>
                      {usernameError && (
                        <p className="text-red-400">{usernameError}</p>
                      )}
                      {formData.username && !usernameError && (
                        <p className="text-green-400">✓ Username is valid</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white placeholder-white/50 focus:border-[#FEEBD8] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Terms & Conditions (Register only) */}
              {!isLogin && (
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[#FEEBD8] bg-[#141414] border border-[#FEEBD8]/20 rounded focus:ring-[#FEEBD8]"
                    required={!isLogin}
                  />
                  <label className="text-white/70 text-sm">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => window.open("/terms", "_blank")}
                      className="text-[#FEEBD8] hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => window.open("/privacy", "_blank")}
                      className="text-[#FEEBD8] hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <a
                    href="#"
                    className="text-[#FEEBD8] text-sm hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Success Display */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#141414] mr-2"></div>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In to Paccy"
                ) : (
                  "Create Your Account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-[#FEEBD8]/20"></div>
              <span className="px-4 text-white/50 text-sm">or</span>
              <div className="flex-1 border-t border-[#FEEBD8]/20"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full px-6 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white font-medium hover:bg-[#FEEBD8]/10 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin("GitHub")}
                className="w-full px-6 py-3 bg-[#141414] border border-[#FEEBD8]/20 rounded-xl text-white font-medium hover:bg-[#FEEBD8]/10 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.166 1.219-5.166s-.312-.623-.312-1.544c0-1.448.839-2.529 1.884-2.529.888 0 1.319.664 1.319 1.46 0 .888-.565 2.212-.857 3.441-.244 1.03.517 1.871 1.533 1.871 1.84 0 3.258-1.944 3.258-4.75 0-2.484-1.785-4.221-4.34-4.221-2.958 0-4.694 2.214-4.694 4.499 0 .891.344 1.848.772 2.365.085.102.097.192.072.297-.08.331-.256 1.04-.292 1.186-.047.188-.154.228-.355.137-1.279-.595-2.077-2.462-2.077-3.965 0-3.275 2.381-6.283 6.86-6.283 3.6 0 6.397 2.565 6.397 5.996 0 3.578-2.254 6.455-5.38 6.455-1.05 0-2.039-.546-2.376-1.195 0 0-.519 1.979-.645 2.464-.234.897-.867 2.019-1.291 2.7.973.301 2.003.462 3.07.462 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Switch Mode */}
            <div className="mt-8 text-center">
              <p className="text-white/70">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={toggleMode}
                  className="text-[#FEEBD8] hover:underline font-medium"
                >
                  {isLogin ? "Sign up for free" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Benefits Section (Register only) */}
          {!isLogin && (
            <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 rounded-2xl p-6 border border-blue-400/30">
              <h3 className="text-[#FEEBD8] font-bold text-lg mb-4">
                What you'll get:
              </h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Free profile tracking and essay reviews
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Personalized college recommendations
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Smart deadline reminders
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-3">✓</span>
                  Access to our college application community
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Development Modal */}
      {showDevModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">
                  Feature Under Development
                </h3>
                <p className="text-white/70 mb-6">
                  Authentication is currently being developed. This is a
                  demonstration of the UI design.
                  <br />
                  <br />
                  <span className="text-orange-300 font-medium">
                    Interested in trying our alpha version? Join our closed
                    alpha program to get early access to dashboard features.
                  </span>
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDevModal(false)}
                  className="flex-1 px-4 py-2 bg-[#141414] border border-[#FEEBD8]/20 rounded-lg text-white text-sm font-medium hover:bg-[#FEEBD8]/10 transition-all duration-300"
                >
                  Go Back
                </button>
                <button
                  onClick={handleActualSubmit}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-lg text-sm font-bold hover:opacity-90 transition-all duration-300"
                >
                  Join Alpha Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141414] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
