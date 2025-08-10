"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    document.title = "Verify Email | Paccy";

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.VERIFY_EMAIL}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setStatus("success");
        setMessage("Your email has been successfully verified!");

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus("error");
        setMessage(
          errorData.message ||
            "Failed to verify email. The token may be invalid or expired."
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "An error occurred while verifying your email. Please try again."
      );
      console.error("Email verification error:", error);
    }
  };

  const handleRetry = () => {
    if (token) {
      setStatus("loading");
      verifyEmail(token);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto animate-pulse">
              📧
            </div>
            <h1 className="text-3xl font-bold text-[#FEEBD8] mb-4">
              Verifying Your Email
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Please wait while we verify your email address...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FEEBD8]"></div>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
              ✅
            </div>
            <h1 className="text-3xl font-bold text-green-400 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-white/80 text-lg mb-8">{message}</p>
            <p className="text-white/60 mb-6">
              You will be redirected to your dashboard in a few seconds...
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl font-bold hover:opacity-90 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
              ❌
            </div>
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              Email Verification Failed
            </h1>
            <p className="text-white/80 text-lg mb-8">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {token && (
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-600 transition-all duration-300"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => router.push("/auth")}
                className="px-6 py-3 border border-[#FEEBD8] text-[#FEEBD8] rounded-xl font-bold hover:bg-[#FEEBD8]/10 transition-all duration-300"
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full">
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#FEEBD8]/20 p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#141414] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full">
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#FEEBD8]/20 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto animate-pulse">
                  📧
                </div>
                <h1 className="text-3xl font-bold text-[#FEEBD8] mb-4">
                  Loading...
                </h1>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FEEBD8]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
