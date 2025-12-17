"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
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
      label: "STUDENTS ACCEPTED",
      value: "10,000+",
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      label: "DEADLINES TRACKED",
      value: "500k+",
    },
    {
      icon: <FaDollarSign className="text-3xl" />,
      label: "SCHOLARSHIPS FOUND",
      value: "$2M+",
    },
  ];

  return (
    <div className="bg-[#0a0c10] min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="text-2xl font-climate-crisis font-bold text-white hover:opacity-80 transition-opacity"
            >
              paccy
            </button>
            <div className="hidden md:flex items-center gap-8">
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                Features
              </button>
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                Pricing
              </button>
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                About
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/auth")}
                className="text-sm text-white hover:text-neutral-300 transition-colors px-4 py-2"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all px-5 py-2 rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Your Dream College is{" "}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  Within Reach
                </span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 mb-8 max-w-xl">
                Stop stressing over spreadsheets. Track deadlines, essays, and
                decisions in one intelligent workspace designed to get you
                accepted.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => router.push("/auth")}
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Start Tracking F...
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-neutral-800 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-neutral-700 transition-all"
                >
                  See How it Wor...
                </button>
              </div>
            </div>

            {/* Right - Laptop Mockup */}
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
                {/* Laptop Screen */}
                <div className="bg-[#0a0a0a] p-3">
                  <div className="bg-neutral-900 rounded-t-lg overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="bg-neutral-800 px-3 py-2 flex items-center gap-2 border-b border-neutral-700">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 bg-neutral-900 rounded px-3 py-1 text-xs text-neutral-500">
                        app.paccy.io
                      </div>
                    </div>
                    {/* Dashboard Preview */}
                    <div className="bg-neutral-900 p-6 h-96">
                      {/* Simple dashboard preview */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-white">
                            My Applications
                          </div>
                          <div className="text-xs text-neutral-500">
                            8 Total
                          </div>
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="bg-neutral-800/50 rounded-lg p-4 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-lg" />
                                <div>
                                  <div className="w-32 h-3 bg-neutral-700 rounded mb-2" />
                                  <div className="w-24 h-2 bg-neutral-700/50 rounded" />
                                </div>
                              </div>
                              <div className="w-20 h-2 bg-neutral-700 rounded" />
                            </div>
                          ))}
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
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center"
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

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-full text-xs text-blue-400 tracking-wider mb-6">
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tools for every step of the journey
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              From building your initial list to clicking submit, we provide the
              modern tools to keep you organized and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-8 transition-all duration-300 hover:bg-neutral-900/80"
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

          <div className="text-center mt-12">
            <button className="bg-neutral-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-all">
              View All Features
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
