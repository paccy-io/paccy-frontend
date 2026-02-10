"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Pricing() {
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    planName: string;
  }>({ show: false, planName: "" });
  const router = useRouter();

  useEffect(() => {
    document.title = "Pricing | Paccy";
  }, []);

  const navigateToAuth = () => {
    router.push("/auth");
  };

  const showWelcome = () => {
    setAlertInfo({ show: true, planName: "Paccy" });
  };

  const closeAlert = () => {
    setAlertInfo({ show: false, planName: "" });
  };
  return (
    <div className="">
      <Navbar />

      <div className="min-h-screen bg-[#0a0a0a] py-20 pt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-climate-crisis">
              Completely Free
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Paccy is completely free for all students. Access all features
              without any limitations or hidden costs.
            </p>

            {/* Success Banner */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🎉</span>
                  <div className="text-center">
                    <p className="text-green-200 font-semibold">
                      100% Free Forever!
                    </p>
                    <p className="text-green-300/80 text-sm">
                      No credit card required. No limitations. Start building
                      your college applications today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-2xl mx-auto mb-16">
            {/* Free Plan - Now the Only Plan */}
            <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-2xl p-8 border border-green-500/50 relative flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  100% Free Forever
                </span>
              </div>

              <div className="text-center flex-grow">
                <h3 className="text-3xl font-bold text-white mb-4">Paccy</h3>
                <div className="text-6xl font-bold text-white mb-2">$0</div>
                <p className="text-white/70 mb-8">
                  Everything you need for your college applications
                </p>

                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Unlimited college applications tracking
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Unlimited essay writing and reviews
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Advanced AI feedback and suggestions
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Full university database access
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Smart calendar and deadline management
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Extracurricular activity tracking
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Academic performance monitoring
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Document and template management
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Peer collaboration features
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Priority support and community access
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Analytics and progress tracking
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Custom application strategies
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Interview preparation tools
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    Scholarship finder
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3 text-xl">✓</span>
                    White-glove support
                  </li>
                </ul>
              </div>

              <button
                onClick={showWelcome}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold mt-auto text-lg"
              >
                Get Started Free
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  Is Paccy really completely free?
                </h3>
                <p className="text-white/70">
                  Yes! Paccy is 100% free for all students. We believe that
                  every student should have access to powerful college
                  application tools without financial barriers. No credit card
                  required, no hidden fees, no limitations.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  What features are included?
                </h3>
                <p className="text-white/70">
                  Everything! You get unlimited access to all features including
                  college tracking, essay writing tools, AI feedback, calendar
                  management, extracurricular tracking, document management,
                  peer collaboration, analytics, and priority support.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  How do I get started?
                </h3>
                <p className="text-white/70">
                  Simply create a free account and you'll have immediate access
                  to all features. No payment information required. Start
                  building your college applications right away!
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  Is my data secure?
                </h3>
                <p className="text-white/70">
                  Absolutely. We take your privacy seriously and use
                  industry-standard encryption to protect your personal
                  information and college application data. Your essays,
                  personal details, and application progress are completely
                  secure.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50">
                <h3 className="text-xl font-bold text-white mb-3">
                  Can I get help if I need it?
                </h3>
                <p className="text-white/70">
                  Yes! We provide comprehensive support through our help center,
                  community forums, and direct email support. Our team is here
                  to help you succeed in your college applications.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-6 text-white/90">
                Join thousands of students who are already using Paccy to
                organize their college applications. It's completely free!
              </p>
              <button
                onClick={navigateToAuth}
                className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                Start Your Free Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Alert Modal */}
      {alertInfo.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] rounded-2xl border border-green-400/50 max-w-md w-full mx-4 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 border-b border-green-400/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
                  🎉
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-200">
                    Welcome to Paccy!
                  </h3>
                  <p className="text-green-300/80 text-sm">
                    Your college application journey starts here
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-white/80 mb-4 leading-relaxed">
                You're about to get started with Paccy - completely free! Access
                all features including unlimited essay reviews, AI feedback, and
                comprehensive college tracking tools.
              </p>

              <div className="bg-[#141414] rounded-xl p-4 mb-6 border border-green-400/20">
                <h4 className="text-green-200 font-semibold mb-2">
                  What you'll get:
                </h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Unlimited college applications</li>
                  <li>• AI-powered essay feedback</li>
                  <li>• Smart deadline management</li>
                  <li>• Full community access</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeAlert}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-600 transition-all duration-300"
                >
                  Get Started!
                </button>
                <button
                  onClick={() => {
                    window.open(
                      "mailto:support@paccy.io?subject=Welcome to Paccy!",
                      "_blank",
                    );
                    closeAlert();
                  }}
                  className="flex-1 px-4 py-3 border border-green-400 text-green-400 rounded-xl font-bold hover:bg-green-400/10 transition-all duration-300"
                >
                  Contact Support
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
