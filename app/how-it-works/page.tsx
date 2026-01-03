"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function HowItWorks() {
  const router = useRouter();

  useEffect(() => {
    document.title = "How It Works | Paccy";
  }, []);

  const navigateToAuth = () => {
    router.push("/auth");
  };

  return (
    <div className="">
      <Navbar />

      <div className="min-h-screen bg-[#0a0a0a] py-20 pt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-climate-crisis">
              How Paccy Works
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              A simple, step-by-step guide to mastering your college
              applications with AI-powered assistance.
            </p>
          </div>

          {/* Step-by-step process */}
          <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    1
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    Create Your Profile
                  </h2>
                </div>
                <p className="text-white/70 leading-relaxed">
                  Start by building your academic profile. Input your GPA, test
                  scores, coursework, and extracurricular activities. Our AI
                  will analyze your competitiveness for different schools and
                  suggest reach, target, and safety options.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-8 border border-neutral-700/50">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Academic Tracking
                </h3>
                <p className="text-white/70 text-sm">
                  Monitor your academic progress and competitiveness
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-8 border border-neutral-700/50">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Essay Manager + AI
                  </h3>
                  <p className="text-white/70 text-sm">
                    Get real-time AI feedback on your essays
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    2
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    Write & Refine Essays
                  </h2>
                </div>
                <p className="text-white/70 leading-relaxed">
                  Upload your Common App essays, UC PIQs, or school-specific
                  prompts. Our AI provides instant feedback on clarity,
                  coherence, and relevance. Access our topic bank for
                  inspiration and get suggestions to improve your writing.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    3
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    Stay Organized
                  </h2>
                </div>
                <p className="text-white/70 leading-relaxed">
                  Let our smart calendar auto-generate your application
                  timeline. Track deadlines, testing windows, and submission
                  dates. Never miss an important deadline with automated
                  reminders and progress tracking.
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-8 border border-neutral-700/50">
                <div className="text-4xl mb-4">📆</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Smart Calendar
                </h3>
                <p className="text-white/70 text-sm">
                  Auto-generated timelines and deadline tracking
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-8 border border-neutral-700/50">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Peer Network
                  </h3>
                  <p className="text-white/70 text-sm">
                    Collaborate on projects and extracurriculars
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    4
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    Connect & Collaborate
                  </h2>
                </div>
                <p className="text-white/70 leading-relaxed">
                  Join our peer network to connect with students from different
                  countries and majors. Collaborate on projects, share insights
                  privately, and build a supportive community throughout your
                  application journey.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-6 text-white/90">
                Join thousands of students who are using Paccy to streamline
                their college applications.
              </p>
              <button
                onClick={navigateToAuth}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                Start Building Your Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
