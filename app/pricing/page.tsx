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

  const handlePaymentClick = (planName: string) => {
    setAlertInfo({ show: true, planName });
  };

  const closeAlert = () => {
    setAlertInfo({ show: false, planName: "" });
  };
  return (
    <div className="">
      <Navbar />

      <div className="min-h-screen bg-[#141414] py-20 pt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FEEBD8] via-blue-300 to-purple-500 bg-clip-text text-transparent mb-6 font-climate-crisis">
              Simple Pricing
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Choose the plan that best fits your college application needs.
              Start for free and upgrade as you grow.
            </p>

            {/* Notification Banner */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/50 rounded-xl p-4 ">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🚧</span>
                  <div className="text-center">
                    <p className="text-orange-200 font-semibold">
                      Payment System Coming Soon!
                    </p>
                    <p className="text-orange-300/80 text-sm">
                      We're currently integrating our payment system. Contact us
                      for early access opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Free Plan */}
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20 relative flex flex-col h-full">
              <div className="text-center flex-grow">
                <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">Free</h3>
                <div className="text-4xl font-bold text-white mb-2">$0</div>
                <p className="text-white/70 mb-6">
                  Perfect for getting started
                </p>

                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Basic profile tracking
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>3 essay
                    reviews per month
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Basic calendar reminders
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Limited university database
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Community access
                  </li>
                </ul>
              </div>

              <button
                onClick={navigateToAuth}
                className="w-full px-6 py-3 border border-[#FEEBD8] text-[#FEEBD8] rounded-xl hover:bg-[#FEEBD8]/10 transition-all duration-300 mt-auto"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-700/20 rounded-2xl p-8 border border-blue-400/50 relative flex flex-col h-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </span>
              </div>

              <div className="text-center flex-grow">
                <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-1">$29</div>
                <p className="text-white/70 text-sm mb-6">per month</p>

                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Everything in Free
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Unlimited essay reviews
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Advanced AI feedback
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Full university database
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Smart calendar automation
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Analytics dashboard
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePaymentClick("Pro")}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 font-bold mt-auto"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20 relative flex flex-col h-full">
              <div className="text-center flex-grow">
                <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold text-white mb-2">$99</div>
                <p className="text-white/70 text-sm mb-6">per month</p>

                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    1-on-1 counselor sessions
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Custom application strategy
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Interview preparation
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Scholarship finder
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    White-glove support
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="text-green-400 mr-3">✓</span>
                    Custom integrations
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePaymentClick("Enterprise")}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] rounded-xl hover:opacity-90 transition-all duration-300 font-bold mt-auto"
              >
                Contact Sales
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#FEEBD8] mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#FEEBD8]/20">
                <h3 className="text-xl font-bold text-[#FEEBD8] mb-3">
                  Can I switch plans anytime?
                </h3>
                <p className="text-white/70">
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes take effect at your next billing cycle, and you'll
                  have access to all features immediately upon upgrading.
                </p>
              </div>

              <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#FEEBD8]/20">
                <h3 className="text-xl font-bold text-[#FEEBD8] mb-3">
                  Is there a student discount?
                </h3>
                <p className="text-white/70">
                  We offer a 50% discount for verified students with a valid
                  .edu email address. Contact us at support@paccy.io to verify
                  your student status.
                </p>
              </div>

              <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#FEEBD8]/20">
                <h3 className="text-xl font-bold text-[#FEEBD8] mb-3">
                  What if I'm not satisfied?
                </h3>
                <p className="text-white/70">
                  We offer a 30-day money-back guarantee on all paid plans. If
                  you're not completely satisfied, we'll refund your payment in
                  full, no questions asked.
                </p>
              </div>

              <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#FEEBD8]/20">
                <h3 className="text-xl font-bold text-[#FEEBD8] mb-3">
                  Do you offer family plans?
                </h3>
                <p className="text-white/70">
                  Yes! Families with multiple students can get up to 30% off
                  when subscribing to multiple Pro accounts. Contact our sales
                  team for a custom family plan quote.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-[#FEEBD8] to-blue-300 rounded-2xl p-8 text-[#141414]">
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-xl mb-6 opacity-80">
                Our team is here to help you choose the right plan for your
                college application journey.
              </p>
              <button
                onClick={() => handlePaymentClick("Support")}
                className="px-8 py-4 bg-[#141414] text-[#FEEBD8] font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cool Custom Alert Modal */}
      {alertInfo.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] rounded-2xl border border-orange-400/50 max-w-md w-full mx-4 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-6 border-b border-orange-400/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl">
                  🚧
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-200">
                    Payment System Coming Soon!
                  </h3>
                  <p className="text-orange-300/80 text-sm">
                    We're working hard to bring you the best experience
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-white/80 mb-4 leading-relaxed">
                We're currently integrating our payment system for the{" "}
                <span className="font-semibold text-[#FEEBD8]">
                  {alertInfo.planName}
                </span>{" "}
                plan. Our team is working around the clock to make this
                available soon!
              </p>

              <div className="bg-[#141414] rounded-xl p-4 mb-6 border border-[#FEEBD8]/20">
                <h4 className="text-[#FEEBD8] font-semibold mb-2">
                  Want Early Access?
                </h4>
                <p className="text-white/70 text-sm mb-2">
                  Contact us directly and we'll get you set up personally:
                </p>
                <p className="text-blue-400 font-mono text-sm">
                  support@paccy.io
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeAlert}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-500 text-[#141414] rounded-xl font-bold hover:from-orange-500 hover:to-yellow-600 transition-all duration-300"
                >
                  Got it!
                </button>
                <button
                  onClick={() => {
                    window.open(
                      "mailto:support@paccy.io?subject=Early Access Request for " +
                        alertInfo.planName +
                        " Plan",
                      "_blank"
                    );
                    closeAlert();
                  }}
                  className="flex-1 px-4 py-3 border border-[#FEEBD8] text-[#FEEBD8] rounded-xl font-bold hover:bg-[#FEEBD8]/10 transition-all duration-300"
                >
                  Contact Us
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
