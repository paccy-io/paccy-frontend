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

      <div className="min-h-screen bg-[#141414] py-20 pt-28">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FEEBD8]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FEEBD8] via-blue-300 to-purple-500 bg-clip-text text-transparent mb-6 font-climate-crisis">
              About Paccy
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              We're a newly founded team of passionate educators, developers,
              and former college applicants building the future of college
              admissions guidance through AI-powered technology.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-[#FEEBD8]/10 to-blue-300/10 rounded-2xl p-8 border border-[#FEEBD8]/20 ">
              <div className="text-center">
                <div className="text-5xl mb-6">🎯</div>
                <h2 className="text-3xl font-bold text-[#FEEBD8] mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
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
              <h2 className="text-3xl font-bold text-[#FEEBD8] mb-4">
                Our Values
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                These principles guide everything we do at Paccy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Accessibility */}
              <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#FEEBD8]/20 text-center hover:border-[#FEEBD8]/40 transition-all duration-300">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-[#FEEBD8] mb-3">
                  Accessibility
                </h3>
                <p className="text-white/70">
                  Quality college guidance should be available to every student,
                  regardless of their geographic location or economic
                  background.
                </p>
              </div>

              {/* Innovation */}
              <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-blue-400/20 text-center hover:border-blue-400/40 transition-all duration-300">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-blue-300 mb-3">
                  Innovation
                </h3>
                <p className="text-white/70">
                  We leverage cutting-edge AI and technology to personalize the
                  application process and make it more efficient for students.
                </p>
              </div>

              {/* Community */}
              <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-purple-400/20 text-center hover:border-purple-400/40 transition-all duration-300">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">
                  Community
                </h3>
                <p className="text-white/70">
                  We believe in the power of peer support and create spaces
                  where students can learn from and inspire each other.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#FEEBD8] to-blue-300 rounded-2xl p-8 text-[#141414]">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-xl mb-6 opacity-80">
                Be among the first to experience the future of college
                admissions guidance. Join our beta program and help shape
                Paccy's development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={navigateToAuth}
                  className="px-8 py-4 bg-[#141414] text-[#FEEBD8] font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
                >
                  Join Beta Program
                </button>
                <button
                  onClick={navigateToContact}
                  className="px-8 py-4 border-2 border-[#141414]/30 text-[#141414] font-bold rounded-xl hover:bg-[#141414]/10 transition-all duration-300"
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
