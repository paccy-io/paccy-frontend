"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FaCheckCircle, FaCalendarAlt, FaDollarSign } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!mounted || user) {
    return null;
  }

  const features = [
    {
      title: "📝 Essay Manager + AI Feedback",
      description:
        "Track essays by school or prompt (Common App, UC PIQs). Real-time AI feedback on clarity & coherence. Topic bank and inspiration feed with common themes: leadership, adversity, growth. Smart suggestions for improvement.",
    },
    {
      title: "📆 Application Calendar & Deadlines",
      description:
        "Smart timeline auto-generates tasks. Visual calendar for progress monitoring. Submit dates and testing windows. SAT, IELTS, and other test tracking. Never miss important deadlines.",
    },
    {
      title: "🎓 Academic Profile Tracking",
      description:
        "Enter and update GPA and test scores. Track coursework and academic progress. Competitiveness level for each school. Reach / target / safety suggestions. Data-driven school recommendations.",
    },
    {
      title: "🧩 Extracurricular Manager",
      description:
        "Organize ECAs, awards, and leadership. Track jobs and volunteer experience. Role, impact, and hours/week tracking. AI feedback on Common App entries. Optimize activity descriptions.",
    },
    {
      title: "🌍 Peer Network",
      description:
        "Connect with non-competing applicants. Collaborate on projects and extracurriculars. Different countries or majors. Share insights and tips privately. Build supportive community together.",
    },
  ];

  const stats = [
    {
      icon: <FaCheckCircle className="text-3xl" />,
      label: "BETA USERS",
      value: "50+",
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      label: "ESSAYS TRACKED",
      value: "200+",
    },
    {
      icon: <FaDollarSign className="text-3xl" />,
      label: "HOURS SAVED",
      value: "1,000+",
    },
  ];

  return (
    <>
      <div className="bg-[#0a0a0a] min-h-screen relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div
          className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%)",
            filter: "blur(80px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.25) 40%, transparent 70%)",
            filter: "blur(70px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-[450px] h-[450px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.55) 0%, rgba(59, 130, 246, 0.28) 40%, transparent 70%)",
            filter: "blur(60px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>
        <div
          className="absolute top-2/3 right-1/3 w-[380px] h-[380px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0.25) 40%, transparent 70%)",
            filter: "blur(50px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(59, 130, 246, 0.08)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Radial Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(10, 10, 10, 0.5) 50%, rgba(10, 10, 10, 0.9) 100%)",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Paccy AI 2.0 Live Banner */}
        <div className="flex justify-center py-4 px-6 mt-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm animate-fade-in">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-sm font-semibold text-green-400 tracking-wide">
              paccy.io 2.0 has launched 🚀
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative px-6 lg:px-8 pt-12 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-fade-in">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-climate-crisis animate-slide-in-up">
                  Your Dream College is{" "}
                  <span className="text-blue-400">Within Reach</span>
                </h1>

                <p
                  className="text-lg md:text-xl text-neutral-400 mb-8 max-w-xl animate-slide-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  Stop stressing over spreadsheets. Track deadlines, essays, and
                  decisions in one intelligent workspace designed to get you
                  accepted.
                </p>

                <div
                  className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <button
                    onClick={() => router.push("/auth")}
                    className="group relative bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Your Journey
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Explore Features
                      <svg
                        className="w-5 h-5 group-hover:translate-y-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Right - Laptop Mockup */}
              <div
                className="relative animate-slide-in-right"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
                  {/* Laptop Screen */}
                  <div className="bg-[#0a0a0a] p-3">
                    <div className="bg-[#0a0a0a] rounded-t-lg overflow-hidden">
                      {/* Browser Chrome */}
                      <div className="bg-neutral-800 px-3 py-2 flex items-center gap-2 border-b border-neutral-700">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 bg-neutral-900 rounded px-3 py-1 text-xs text-neutral-500">
                          www.paccy.io/
                        </div>
                      </div>
                      {/* Real Dashboard Preview */}
                      <div className="bg-[#0a0a0a] p-3 h-96 overflow-hidden">
                        {/* Welcome Header */}
                        <div className="mb-3">
                          <h2 className="text-white text-sm font-bold mb-0.5">
                            Welcome back, Leo! 👋
                          </h2>
                          <p className="text-neutral-500 text-xs">
                            Let's continue building your future together.
                          </p>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-4 gap-1.5 mb-3">
                          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-800 rounded-lg p-2">
                            <div className="text-blue-400 text-xs mb-0.5 flex items-center gap-1">
                              🏛️
                              <span className="text-[10px]">Applications</span>
                            </div>
                            <div className="text-white font-bold text-lg">
                              7
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-800 rounded-lg p-2">
                            <div className="text-purple-400 text-xs mb-0.5 flex items-center gap-1">
                              ✍️
                              <span className="text-[10px]">Essays</span>
                            </div>
                            <div className="text-white font-bold text-lg">
                              5
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-800 rounded-lg p-2">
                            <div className="text-yellow-400 text-xs mb-0.5 flex items-center gap-1">
                              🏆
                              <span className="text-[10px]">ECAs</span>
                            </div>
                            <div className="text-white font-bold text-lg">
                              8
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-800 rounded-lg p-2">
                            <div className="text-green-400 text-xs mb-0.5 flex items-center gap-1">
                              🎁
                              <span className="text-[10px]">Deadlines</span>
                            </div>
                            <div className="text-white font-bold text-lg">
                              0
                            </div>
                          </div>
                        </div>

                        {/* Progress Overview */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-800 rounded-lg p-2.5 mb-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-4 h-4 bg-green-500/20 rounded flex items-center justify-center">
                              <span className="text-green-400 text-xs">✓</span>
                            </div>
                            <h3 className="text-white text-xs font-semibold">
                              Progress Overview
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-400 text-[10px]">
                                Application Status
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div className="flex justify-between">
                                <span className="text-neutral-500">
                                  Not Started
                                </span>
                                <span className="text-white font-semibold">
                                  1
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">
                                  In Progress
                                </span>
                                <span className="text-white font-semibold">
                                  1
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">
                                  Under Review
                                </span>
                                <span className="text-white font-semibold">
                                  4
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500">
                                  Accepted
                                </span>
                                <span className="text-white font-semibold">
                                  1
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* College Applications */}
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-800 rounded-lg p-2.5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-blue-400 text-xs">🏛️</span>
                              <h3 className="text-white text-xs font-semibold">
                                College Applications
                              </h3>
                            </div>
                            <button className="text-blue-400 text-[10px] hover:text-blue-300">
                              View All →
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            <div className="bg-[#0a0a0a] border border-neutral-700/50 rounded-lg p-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                                  S
                                </div>
                                <div>
                                  <div className="text-white text-[10px] font-medium">
                                    Stanford University
                                  </div>
                                  <div className="text-neutral-500 text-[9px]">
                                    Computer Engineering • Early Decision
                                  </div>
                                </div>
                              </div>
                              <div className="bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                Under Review
                              </div>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-700/50 rounded-lg p-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-white text-[10px] font-bold">
                                  MIT
                                </div>
                                <div>
                                  <div className="text-white text-[10px] font-medium">
                                    Massachusetts Institute of Technology
                                  </div>
                                  <div className="text-neutral-500 text-[9px]">
                                    Computer Science • Regular Decision
                                  </div>
                                </div>
                              </div>
                              <div className="bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                Under Review
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center animate-fade-in-up hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex justify-center mb-4 text-blue-500">
                    {stat.icon}
                  </div>
                  <div className="text-xs text-neutral-500 tracking-wider mb-2">
                    {stat.label}
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* University Logos Section */}
        <section className="px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <p className="text-xs text-neutral-500 tracking-wider mb-6">
                STUDENTS ACCEPTED INTO
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="text-neutral-400 hover:text-white transition-colors text-xl font-semibold">
                  Stanford
                </div>
                <div className="text-neutral-400 hover:text-white transition-colors text-xl font-semibold">
                  MIT
                </div>
                <div className="text-neutral-400 hover:text-white transition-colors text-xl font-semibold">
                  Waterloo
                </div>
                <div className="text-neutral-400 hover:text-white transition-colors text-xl font-semibold">
                  Harvard
                </div>
                <div className="text-neutral-400 hover:text-white transition-colors text-xl font-semibold">
                  Yale
                </div>
                <div className="text-neutral-400 hover:text-white transition-colors text-xl font-semibold">
                  Princeton
                </div>
                <div className="text-neutral-400 hover:text-white transition-colors text-xl font-semibold">
                  University of Toronto
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-full text-xs text-blue-400 tracking-wider mb-6">
                FEATURES
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-climate-crisis">
                Tools for every step of the journey
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                From building your initial list to clicking submit, we provide
                the modern tools to keep you organized and stress-free.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-8 transition-all duration-300 hover:bg-neutral-900/80 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for Modern Applicant Section */}
        <section className="px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-climate-crisis">
                Built for the modern applicant.
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                Forget spreadsheets and scattered docs. Paccy centralizes your
                entire admissions strategy.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Smart Essay Manager */}
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 animate-fade-in-up hover:border-neutral-700 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Smart Essay Manager
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Track prompts by school. Get real-time AI feedback on
                      structure, tone, and clarity before you hit submit.
                    </p>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-neutral-700/50">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-400 font-semibold">
                      AI Insight
                    </div>
                    <div className="text-xs text-neutral-500">Just now</div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    "Strong opening hook, but the second paragraph lacks
                    concrete examples of your leadership..."
                  </p>
                </div>
              </div>

              {/* Auto-Timeline */}
              <div
                className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 animate-fade-in-up hover:border-neutral-700 transition-all"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">📆</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Auto-Timeline
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Never miss a deadline. Paccy auto-generates your schedule
                      based on your school list.
                    </p>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-neutral-700/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span className="text-xs text-white">
                        UC Application Due
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">Nov 30</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-xs text-white">
                        Common App Early
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">Nov 1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stat Tracker */}
              <div
                className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 animate-fade-in-up hover:border-neutral-700 transition-all"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      High School GPA
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Track your academic journey through high school.
                    </p>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-4 border border-neutral-700/50">
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-green-400 text-xs">🏆</span>
                        <span className="text-green-400 text-xs font-semibold">
                          Excellent
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">90.9</div>
                      <div className="text-xs text-neutral-500">
                        Cumulative GPA
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-neutral-900 rounded p-2">
                      <div className="text-xs text-neutral-500 mb-1">
                        Grade 9
                      </div>
                      <div className="text-sm font-bold text-white">83.00</div>
                    </div>
                    <div className="bg-neutral-900 rounded p-2">
                      <div className="text-xs text-neutral-500 mb-1">
                        Grade 10
                      </div>
                      <div className="text-sm font-bold text-white">89.70</div>
                    </div>
                    <div className="bg-neutral-900 rounded p-2">
                      <div className="text-xs text-neutral-500 mb-1">
                        Grade 11
                      </div>
                      <div className="text-sm font-bold text-white">91.70</div>
                    </div>
                    <div className="bg-neutral-900 rounded p-2">
                      <div className="text-xs text-neutral-500 mb-1">
                        Grade 12
                      </div>
                      <div className="text-sm font-bold text-white">99.20</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network & Activities */}
              <div
                className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 animate-fade-in-up hover:border-neutral-700 transition-all"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">🧩</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Network & Activities
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                      Organize your extracurriculars with impact descriptions,
                      then connect with peers globally to collaborate on
                      projects.
                    </p>
                    <button
                      onClick={() => router.push("/auth")}
                      className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors"
                    >
                      Explore the network →
                    </button>
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3 border border-neutral-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      You
                    </div>
                    <div className="flex-1 bg-green-500/20 rounded px-2 py-1">
                      <p className="text-xs text-green-300">
                        I am trying to focus on my coding hobby
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 pl-10">
                    Hey! Anyone working on the Stanford roommate essay?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Turn Activities into Impact Section */}
        <section className="px-6 lg:px-8 py-20 bg-neutral-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Code Editor Preview */}
              <div className="animate-fade-in-up">
                <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-700">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-neutral-500">
                      activity-list.json
                    </span>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    <div>
                      <div className="text-green-400 text-xs mb-1">
                        POSITION
                      </div>
                      <div className="text-white">
                        Founder & President, Coding Club
                      </div>
                    </div>
                    <div>
                      <div className="text-green-400 text-xs mb-1">
                        DESCRIPTION (OPTIMIZED)
                      </div>
                      <div className="text-white leading-relaxed">
                        Initiated 4-week Python bootcamp for 50+
                        underrepresented students; secured $2K grant for
                        hardware.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-climate-crisis">
                  Turn activities into{" "}
                  <span className="text-green-400">impact.</span>
                </h2>
                <p className="text-lg text-neutral-400 mb-8">
                  Colleges don't just want a list of what you did. They want to
                  know the impact. Our AI helps rewrite your activity
                  descriptions to highlight leadership, initiative, and results.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-white">
                      Character count optimization
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Action-verb enhancements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Common App formatting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collaborate Without Competition Section */}
        <section className="px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div className="animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-climate-crisis">
                  Collaborate without{" "}
                  <span className="text-purple-400">competition.</span>
                </h2>
                <p className="text-lg text-neutral-400 mb-8">
                  The Peer Network connects you with students applying to
                  different majors or regions, so you can share essays and get
                  feedback without the fear of competition.
                </p>
                <button
                  onClick={() => router.push("/auth")}
                  className="inline-block text-white border-b-2 border-white pb-1 hover:border-blue-400 hover:text-blue-400 transition-colors font-semibold"
                >
                  Join the community
                </button>
              </div>

              {/* Right - Network Visualization */}
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-800 rounded-2xl p-12 relative">
                  <div className="relative h-64">
                    {/* Center Node (You) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg shadow-purple-600/50">
                      You
                    </div>

                    {/* Connection Lines */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      style={{ zIndex: 1 }}
                    >
                      <line
                        x1="50%"
                        y1="50%"
                        x2="20%"
                        y2="20%"
                        stroke="rgba(168, 85, 247, 0.3)"
                        strokeWidth="2"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="80%"
                        y2="20%"
                        stroke="rgba(168, 85, 247, 0.3)"
                        strokeWidth="2"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="15%"
                        y2="70%"
                        stroke="rgba(168, 85, 247, 0.3)"
                        strokeWidth="2"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="85%"
                        y2="75%"
                        stroke="rgba(168, 85, 247, 0.3)"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Peer Nodes */}
                    <div
                      className="absolute top-[15%] left-[15%] w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ zIndex: 5 }}
                    >
                      NY
                    </div>
                    <div
                      className="absolute top-[15%] right-[15%] w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ zIndex: 5 }}
                    >
                      CA
                    </div>
                    <div
                      className="absolute bottom-[15%] left-[10%] w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ zIndex: 5 }}
                    >
                      TX
                    </div>
                    <div
                      className="absolute bottom-[10%] right-[10%] w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ zIndex: 5 }}
                    >
                      UK
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-climate-crisis">
                Trusted by students worldwide
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                See what students are saying about their experience with Paccy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 animate-fade-in-up hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    SK
                  </div>
                  <div>
                    <div className="text-white font-semibold">Sarah Kim</div>
                    <div className="text-neutral-400 text-sm">
                      Admitted to Stanford
                    </div>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  "Paccy helped me stay organized with 12 different
                  applications. The AI essay feedback was incredibly helpful!"
                </p>
              </div>

              <div
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 animate-fade-in-up hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    MP
                  </div>
                  <div>
                    <div className="text-white font-semibold">Marcus Patel</div>
                    <div className="text-neutral-400 text-sm">
                      Admitted to MIT
                    </div>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  "The deadline tracking saved me so many times. I never missed
                  a single submission thanks to Paccy's reminders."
                </p>
              </div>

              <div
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 animate-fade-in-up hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    EL
                  </div>
                  <div>
                    <div className="text-white font-semibold">Emily Lopez</div>
                    <div className="text-neutral-400 text-sm">
                      Admitted to Harvard
                    </div>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  "The peer network feature connected me with students
                  worldwide. We collaborated and supported each other
                  throughout!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl animate-fade-in-up">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
              <div className="absolute inset-0">
                <div
                  className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    transform: "translateZ(0)",
                    willChange: "filter",
                  }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)",
                    filter: "blur(50px)",
                    transform: "translateZ(0)",
                    willChange: "filter",
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-12 text-center">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white tracking-wider mb-6 font-semibold">
                  GET STARTED TODAY
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-climate-crisis">
                  Your college journey starts here
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join students who are already using Paccy to organize their
                  applications and make their college dreams a reality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push("/auth")}
                    className="group relative bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get Started Free
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={() => router.push("/contact")}
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all hover:scale-105"
                  >
                    Get in Touch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      
    </div>
    <Footer />
    </>
  );
}
