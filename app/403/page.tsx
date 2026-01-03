import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="text-center px-6">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚫</span>
          </div>
        </div>

        {/* Error Content */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4">
          403
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Access Forbidden
        </h2>

        <p className="text-white/70 text-lg mb-2 max-w-md mx-auto">
          The dashboard is currently under development and not available in
          production.
        </p>

        <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
          We're working hard to bring you these features. Please check back
          soon!
        </p>

        {/* Actions */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl font-bold hover:opacity-90 transition-all duration-300"
          >
            Go Home
          </Link>

          <Link
            href="/auth"
            className="inline-block px-6 py-3 bg-[#1A1A1A] border border-[#FEEBD8]/20 text-white rounded-xl font-medium hover:bg-[#FEEBD8]/10 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
