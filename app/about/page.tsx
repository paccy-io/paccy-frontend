"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  const router = useRouter();

  useEffect(() => {
    document.title = "About Us | Paccy";
  }, []);

  const navigateToAuth = () => {
    router.push("/auth");
  };

  const navigateToContact = () => {
    router.push("/contact");
  };

  return (
    <div className="">
      <Navbar />

      <div className="min-h-screen bg-[#0a0a0a] py-20 pt-28">
        {/* Background decorative elements */}
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
            filter: "blur(48px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>
        <div
          className="absolute bottom-32 right-16 w-48 h-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            filter: "blur(48px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
            filter: "blur(48px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-climate-crisis">
              About Paccy
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              We're a newly founded team of passionate educators, developers,
              and former college applicants building the future of college
              admissions guidance through AI-powered technology.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-[#141414] to-[#1a1a1a] rounded-2xl p-8 border border-neutral-700/50 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-5xl mb-6">🎯</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-white/70 max-w-4xl mx-auto leading-relaxed">
                  To democratize college admissions by building AI-powered tools
                  that provide every student with personalized guidance and
                  support. We're working to create a future where your
                  potential, not your background, determines your opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#FEEBD8] mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-white/80">
                  <p>
                    Paccy was born from a simple observation: college
                    applications are unnecessarily complicated, stressful, and
                    inequitable. Our founders, having recently navigated this
                    process themselves, experienced firsthand how students from
                    different backgrounds face vastly different levels of
                    support.
                  </p>
                  <p>
                    We founded Paccy in early 2025 with the ambitious vision of
                    creating an AI-powered platform that could democratize
                    college guidance and provide personalized support to every
                    student, regardless of their school's resources or family's
                    familiarity with admissions.
                  </p>
                  <p>
                    As a young startup, we're currently in our beta phase,
                    working closely with early adopters to refine our platform
                    and ensure it truly serves the needs of students worldwide.
                    Our goal is to launch publicly and help thousands of
                    students craft compelling applications.
                  </p>
                </div>
              </div>
              <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#FEEBD8]/20">
                <div className="text-center">
                  <div className="text-4xl mb-4">�</div>
                  <h3 className="text-xl font-bold text-[#FEEBD8] mb-4">
                    Our Progress
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Beta Testers</span>
                      <span className="text-[#FEEBD8] font-bold">50+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Features Built</span>
                      <span className="text-[#FEEBD8] font-bold">15+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Development Hours</span>
                      <span className="text-[#FEEBD8] font-bold">2,500+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Code Commits</span>
                      <span className="text-[#FEEBD8] font-bold">320+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                These principles guide everything we do at Paccy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Accessibility */}
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-2xl p-6 border border-neutral-700/50 text-center hover:border-blue-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Accessibility
                </h3>
                <p className="text-white/70">
                  Quality college guidance should be available to every student,
                  regardless of their geographic location or economic
                  background.
                </p>
              </div>

              {/* Innovation */}
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-2xl p-6 border border-neutral-700/50 text-center hover:border-blue-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Innovation
                </h3>
                <p className="text-white/70">
                  We leverage cutting-edge AI and technology to personalize the
                  application process and make it more efficient for students.
                </p>
              </div>

              {/* Community */}
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-2xl p-6 border border-neutral-700/50 text-center hover:border-blue-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-white mb-3">Community</h3>
                <p className="text-white/70">
                  We believe in the power of peer support and create spaces
                  where students can learn from and inspire each other.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Join Our Journey
              </h2>
              <p className="text-xl mb-6 text-white/90">
                Be among the first to experience the future of college
                admissions guidance. Join our beta program and help shape
                Paccy's development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={navigateToAuth}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  Join Beta Program
                </button>
                <button
                  onClick={navigateToContact}
                  className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
