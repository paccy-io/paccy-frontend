import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Paccy",
  description: "Sorry, we couldn't find the page you were looking for.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FEEBD8]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

      <div className="text-center px-6 relative z-10">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#FEEBD8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#FEEBD8] via-blue-300 to-purple-500 bg-clip-text text-transparent mb-4 font-climate-crisis">
          404
        </h1>

        {/* Error Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        {/* Error Description */}
        <p className="text-white/70 text-lg mb-2 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the
          digital void.
        </p>

        <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
          Don't worry, even the best explorers get lost sometimes. Let's get you
          back on track!
        </p>

        {/* Actions */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Go Home
          </Link>

          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[#1A1A1A] border border-[#FEEBD8]/20 text-white rounded-xl font-medium hover:bg-[#FEEBD8]/10 transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 rounded-2xl border border-blue-400/30 max-w-md mx-auto">
          <p className="text-blue-300 text-sm">
            <span className="font-semibold">💡 Fun Fact:</span> The term "404"
            comes from the room number at CERN where the original web servers
            were located!
          </p>
        </div>
      </div>
    </div>
  );
}
