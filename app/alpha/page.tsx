"use client";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import router from "next/router";

export default function Alpha() {
  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    type: "success" | "info";
  }>({ show: false, type: "info" });

  const handleEmailCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("support@paccy.io");
      setAlertInfo({ show: true, type: "info" });
    }
  };

  const closeAlert = () => {
    setAlertInfo({ show: false, type: "info" });
  };
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0a]">
      {/* Subtle grid/line overlay only */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-8 mix-blend-soft-light"
          style={{ zIndex: 1 }}
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#FEEBD8"
                strokeWidth="1.05"
                opacity="0.07"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 pt-28 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto text-center mb-20 animate-fade-in-long">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-[#FEEBD8] mb-6 leading-tight drop-shadow-lg animate-slide-in-up-long">
            Paccy Alpha is Coming
          </h1>
          <p className="text-[#FEEBD8]/80 text-2xl md:text-3xl font-medium mb-10 max-w-2xl mx-auto animate-fade-in-up-long">
            The next generation of college application management launches soon.
            <br />
            <span className="text-blue-300 font-bold">
              Be the first to experience the future.
            </span>
          </p>
          <div className="flex justify-center items-center animate-fade-in-up-long mt-8">
            <button
              type="button"
              onClick={handleEmailCopy}
              className="px-8 py-4 rounded-lg bg-white text-[#181A20] font-semibold text-lg shadow-md shadow-black/20 transition-transform duration-200 hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-white/70 active:scale-95 select-none"
            >
              Sign Up for Alpha
            </button>
          </div>
          {/* Modal overlay, only when alertInfo.show is true */}
          {alertInfo.show && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1A1A1A] rounded-2xl border border-blue-400/50 max-w-md w-full mx-4 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 border-b border-blue-400/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl">
                      🚀
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-blue-200 text-left">
                        Alpha Registration Coming Soon!
                      </h3>
                      <p className="text-blue-300/80 text-sm text-left">
                        We're working hard to bring you the best experience
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-left">
                  <p className="text-white/80 mb-4 leading-relaxed text-left">
                    We're currently building our alpha registration system.
                    <br />
                    If you'd like to be notified when it's ready, just drop us
                    an email!
                  </p>

                  <div className="bg-[#141414] rounded-xl p-4 mb-6 border border-[#FEEBD8]/20 text-left">
                    <h4 className="text-[#FEEBD8] font-semibold mb-2 text-left">
                      Want Early Access?
                    </h4>
                    <p className="text-white/70 text-sm mb-2 text-left">
                      Contact us directly and we'll get you set up personally:
                    </p>
                    <p className="text-blue-400 font-mono text-sm text-left">
                      support@paccy.io
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={closeAlert}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-600 transition-all duration-300"
                    >
                      Got it!
                    </button>
                    <button
                      onClick={() => {
                        window.open(
                          "mailto:support@paccy.io?subject=Alpha Early Access Request",
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
        </section>
        {/* Feature Cards, matching roadmap style */}
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 border rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200">
            <span className="text-5xl mb-4">🚀</span>
            <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">
              Early Access
            </h3>
            <p className="text-[#FEEBD8]/80 text-lg text-center mb-2">
              Be among the first to try new features and shape the future of
              Paccy.
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-400/30 border rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200">
            <span className="text-5xl mb-4">💬</span>
            <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">
              Direct Feedback
            </h3>
            <p className="text-[#FEEBD8]/80 text-lg text-center mb-2">
              Work closely with our team and help us build the best experience
              for you.
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 border-green-400/30 border rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200">
            <span className="text-5xl mb-4">🎁</span>
            <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">
              Special Rewards
            </h3>
            <p className="text-[#FEEBD8]/80 text-lg text-center mb-2">
              Alpha testers get exclusive perks and lifetime benefits when we
              launch.
            </p>
          </div>
        </section>
        {/* Timeline Section - styled like feature cards */}
        <section className="w-full max-w-6xl mx-auto mt-8 mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FEEBD8] mb-8 text-center">
            Alpha Timeline
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6 md:p-5 flex flex-col items-center shadow-lg min-h-[220px]">
              <span className="text-3xl md:text-4xl mb-3">📝</span>
              <h3 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-2 text-center">
                Signups Open
              </h3>
              <p className="text-[#FEEBD8]/70 text-center text-sm md:text-base">
                Register your interest to join the Paccy Alpha and get exclusive
                early access.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 rounded-2xl p-6 md:p-5 flex flex-col items-center shadow-lg min-h-[220px]">
              <span className="text-3xl md:text-4xl mb-3">📩</span>
              <h3 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-2 text-center">
                Alpha Invitations
              </h3>
              <p className="text-[#FEEBD8]/70 text-center text-sm md:text-base">
                Selected users will receive invites and onboarding instructions
                via email.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 border border-green-400/30 rounded-2xl p-6 md:p-5 flex flex-col items-center shadow-lg min-h-[220px]">
              <span className="text-3xl md:text-4xl mb-3">🧪</span>
              <h3 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-2 text-center">
                Alpha Testing
              </h3>
              <p className="text-[#FEEBD8]/70 text-center text-sm md:text-base">
                Test new features, give feedback, and help us shape the future
                of Paccy.
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-2xl p-6 md:p-5 flex flex-col items-center shadow-lg min-h-[220px]">
              <span className="text-3xl md:text-4xl mb-3">🚀</span>
              <h3 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-2 text-center">
                Public Launch
              </h3>
              <p className="text-[#FEEBD8]/70 text-center text-sm md:text-base">
                Alpha testers get early access to the public release and special
                rewards.
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Alpha Section */}
        <section className="w-full max-w-4xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FEEBD8] mb-8 text-center">
            Why Join Paccy Alpha?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#141414]/80 border border-blue-400/20 rounded-2xl p-6 flex flex-col items-center shadow-lg">
              <span className="text-4xl mb-3">🧪</span>
              <h3 className="text-lg font-bold text-[#FEEBD8] mb-2">
                Shape the Product
              </h3>
              <p className="text-[#FEEBD8]/70 text-center">
                Your feedback directly impacts features, design, and the future
                of Paccy.
              </p>
            </div>
            <div className="bg-[#141414]/80 border border-green-400/20 rounded-2xl p-6 flex flex-col items-center shadow-lg">
              <span className="text-4xl mb-3">🌟</span>
              <h3 className="text-lg font-bold text-[#FEEBD8] mb-2">
                Exclusive Perks
              </h3>
              <p className="text-[#FEEBD8]/70 text-center">
                Get lifetime benefits, early access to new features, and special
                recognition.
              </p>
            </div>
            <div className="bg-[#141414]/80 border border-orange-400/20 rounded-2xl p-6 flex flex-col items-center shadow-lg">
              <span className="text-4xl mb-3">🤝</span>
              <h3 className="text-lg font-bold text-[#FEEBD8] mb-2">
                Community
              </h3>
              <p className="text-[#FEEBD8]/70 text-center">
                Join a passionate group of students and help each other succeed.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FEEBD8] mb-8 text-center">
            Alpha FAQ
          </h2>
          <div className="space-y-6">
            <div className="bg-[#141414]/80 border border-[#FEEBD8]/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#FEEBD8] mb-2">
                Who can join the alpha?
              </h3>
              <p className="text-[#FEEBD8]/70">
                Any student interested in college applications and willing to
                provide feedback is welcome to register their interest.
              </p>
            </div>
            <div className="bg-[#141414]/80 border border-[#FEEBD8]/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#FEEBD8] mb-2">
                How do I get selected?
              </h3>
              <p className="text-[#FEEBD8]/70">
                We’ll select a diverse group of students based on interest,
                need, and enthusiasm. Watch your inbox for an invite!
              </p>
            </div>
            <div className="bg-[#141414]/80 border border-[#FEEBD8]/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#FEEBD8] mb-2">
                What do alpha testers do?
              </h3>
              <p className="text-[#FEEBD8]/70">
                Test new features, report bugs, and share your honest thoughts
                to help us improve Paccy for everyone.
              </p>
            </div>
            <div className="bg-[#141414]/80 border border-[#FEEBD8]/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#FEEBD8] mb-2">
                Will I get rewards?
              </h3>
              <p className="text-[#FEEBD8]/70">
                Yes! Alpha testers receive exclusive perks, early access, and
                special recognition when Paccy launches.
              </p>
            </div>
          </div>
        </section>

        {/* Animated CTA Section */}
        <section className="w-full max-w-3xl text-center mt-8 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#FEEBD8] mb-4 animate-slide-in-up">
            Stay Tuned!
          </h2>
          <p className="text-[#FEEBD8]/70 text-xl mb-8 animate-fade-in-up">
            Sign up for our newsletter or follow us on social media to be the
            first to know when Paccy Alpha opens.
          </p>
          <a
            href="mailto:support@paccy.io"
            className="inline-block px-12 py-4 rounded-2xl bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#181A20] font-bold text-xl shadow-xl hover:scale-105 hover:shadow-[#FEEBD8]/30 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FEEBD8]/40 animate-fade-in-up"
          >
            Contact Us
          </a>
        </section>
      </main>
      {/* Footer with solid background to hide grid/lines */}
      <div
        className="relative z-20 w-full bg-[#0a0a0a] pt-2"
        style={{ boxShadow: "0 -2px 24px 0 #0a0a0a" }}
      >
        <Footer />
      </div>
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in-long {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-long {
          animation: fade-in-long 2.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fade-in-up-long {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up-long {
          animation: fade-in-up-long 2.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes slide-in-up-long {
          from {
            opacity: 0;
            transform: translateY(120px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up-long {
          animation: slide-in-up-long 2.4s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}
