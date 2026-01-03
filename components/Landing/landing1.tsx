"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showFeatureDemo, setShowFeatureDemo] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-play functionality
  useEffect(() => {
    if (!showFeatureDemo || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [showFeatureDemo, isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    if (!showFeatureDemo) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveFeature((prev) => (prev > 0 ? prev - 1 : features.length - 1));
        setIsAutoPlaying(false);
      } else if (e.key === "ArrowRight") {
        setActiveFeature((prev) => (prev + 1) % features.length);
        setIsAutoPlaying(false);
      } else if (e.key === "Escape") {
        closeFeatureDemo();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showFeatureDemo]);

  useEffect(() => {
    if (showFeatureDemo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showFeatureDemo]);

  // Auto-scroll to active feature button
  useEffect(() => {
    if (!showFeatureDemo || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const activeButton = container.children[activeFeature] as HTMLElement;

    if (activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Calculate if button is out of view
      const isOutOfView =
        buttonRect.right > containerRect.right ||
        buttonRect.left < containerRect.left;

      if (isOutOfView) {
        // Calculate scroll position to center the active button
        const scrollLeft =
          activeButton.offsetLeft -
          container.clientWidth / 2 +
          activeButton.clientWidth / 2;

        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth",
        });
      }
    }
  }, [activeFeature, showFeatureDemo]);

  const features = [
    {
      id: 0,
      icon: "📝",
      title: "Essay Manager + AI",
      description: "Track essays by school with real-time AI feedback",
      demo: {
        title: "AI Essay Assistant in Action",
        content: "Watch how our AI analyzes your essay in real-time",
        mockData: {
          essayText:
            "The most meaningful experience of my high school years...",
          feedback: [
            "Strong opening hook ✓",
            "Consider adding more specific examples",
            "Excellent personal reflection",
            "Grammar: 98% accuracy",
          ],
          score: 8.7,
        },
      },
    },
    {
      id: 1,
      icon: "📆",
      title: "Smart Calendar",
      description: "Auto-generated timelines and deadline tracking",
      demo: {
        title: "Your Personalized Application Timeline",
        content: "See how deadlines are automatically organized",
        mockData: {
          upcomingDeadlines: [
            {
              school: "Stanford",
              task: "Common App Essay",
              date: "Oct 15",
              priority: "high",
            },
            {
              school: "MIT",
              task: "SAT Scores",
              date: "Nov 1",
              priority: "medium",
            },
            {
              school: "Harvard",
              task: "Supplemental Essays",
              date: "Nov 15",
              priority: "high",
            },
          ],
        },
      },
    },
    {
      id: 2,
      icon: "🎓",
      title: "Academic Tracking",
      description: "Monitor GPA, test scores, and competitiveness",
      demo: {
        title: "Your Academic Profile Overview",
        content: "Track your competitiveness across different schools",
        mockData: {
          gpa: 3.85,
          satScore: 1480,
          matches: [
            { school: "UC Berkeley", match: "85%", type: "target" },
            { school: "Stanford", match: "45%", type: "reach" },
            { school: "UC Davis", match: "95%", type: "safety" },
          ],
        },
      },
    },
    {
      id: 3,
      icon: "🧩",
      title: "Extracurricular Manager",
      description: "Organize activities with AI-enhanced descriptions",
      demo: {
        title: "Smart Activity Organization",
        content: "AI helps enhance your activity descriptions",
        mockData: {
          activities: [
            {
              name: "Debate Team Captain",
              hours: "10 hrs/week",
              impact: "Led team to state finals",
            },
            {
              name: "Community Tutoring",
              hours: "5 hrs/week",
              impact: "Helped 25+ students improve grades",
            },
            {
              name: "Research Internship",
              hours: "15 hrs/week",
              impact: "Co-authored published paper",
            },
          ],
        },
      },
    },
    {
      id: 4,
      icon: "🌍",
      title: "Peer Network",
      description: "Connect and collaborate on projects together",
      demo: {
        title: "Global Student Collaboration",
        content: "Connect with peers worldwide for projects",
        mockData: {
          connections: [
            {
              name: "Sarah M.",
              country: "Canada",
              project: "Climate Research",
            },
            { name: "Ahmed K.", country: "UAE", project: "App Development" },
            { name: "Li W.", country: "Singapore", project: "Debate Prep" },
          ],
        },
      },
    },
  ];

  const openFeatureDemo = (featureId: number) => {
    setActiveFeature(featureId);
    setShowFeatureDemo(true);
    setIsAutoPlaying(true);
  };

  const closeFeatureDemo = () => {
    setShowFeatureDemo(false);
    setIsAutoPlaying(false);
  };

  const navigateToAuth = () => {
    router.push("/auth");
  };

  const handleFeatureChange = (newIndex: number) => {
    setActiveFeature(newIndex);
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates

    // Auto-scroll to bring the new active feature into view
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const activeButton = container.children[newIndex] as HTMLElement;

        if (activeButton) {
          const containerRect = container.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();

          // Calculate if button is out of view
          const isOutOfView =
            buttonRect.right > containerRect.right ||
            buttonRect.left < containerRect.left;

          if (isOutOfView) {
            // Calculate scroll position to center the active button
            const scrollLeft =
              activeButton.offsetLeft -
              container.clientWidth / 2 +
              activeButton.clientWidth / 2;

            container.scrollTo({
              left: Math.max(0, scrollLeft),
              behavior: "smooth",
            });
          }
        }
      }
    }, 100); // Small delay to ensure state update
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background decorative elements with GPU acceleration */}
      <div className="pt-32">
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
        <div
          className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            filter: "blur(48px)",
            transform: "translateZ(0)",
            willChange: "filter",
          }}
        ></div>

        <div className="z-10 text-center px-6">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 font-climate-crisis text-content animate-hero-fade-in">
            paccy
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-6 font-bold tracking-wide text-content animate-hero-fade-in delay-200">
            Smart, AI-Powered College Application Platform
          </p>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed font-medium text-content animate-hero-fade-in delay-400">
            Navigate the complex college application process with structure,
            clarity, and collaboration. From AI essay feedback to peer
            networking - everything you need in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in-up delay-400">
            <button
              onClick={navigateToAuth}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[250px]"
            >
              Start Building Your Profile
            </button>
            <button
              onClick={() => setShowFeatureDemo(true)}
              className="px-8 py-4 bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-blue-500/50 text-white font-bold rounded-xl hover:bg-blue-500/10 hover:border-blue-500/70 transition-all duration-300 shadow-md hover:shadow-lg min-w-[250px] group"
            >
              <span className="flex items-center justify-center gap-2">
                Explore Features
                <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </button>
          </div>

          {/* Core MVP Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div
              onClick={() => openFeatureDemo(0)}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-3 text-content">
                Essay Manager + AI
              </h3>
              <p className="text-white/70 text-base text-content leading-relaxed">
                Track essays by school with real-time AI feedback and
                suggestions
              </p>
            </div>
            <div
              onClick={() => openFeatureDemo(1)}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl mb-4">📆</div>
              <h3 className="text-xl font-bold text-white mb-3 text-content">
                Smart Calendar
              </h3>
              <p className="text-white/70 text-base text-content leading-relaxed">
                Auto-generated timelines and intelligent deadline tracking
              </p>
            </div>
            <div
              onClick={() => openFeatureDemo(2)}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-white mb-3 text-content">
                Academic Tracking
              </h3>
              <p className="text-white/70 text-base text-content leading-relaxed">
                Monitor GPA, test scores, and college competitiveness
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
            <div
              onClick={() => openFeatureDemo(3)}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-bold text-white mb-3 text-content">
                Extracurricular Manager
              </h3>
              <p className="text-white/70 text-base text-content leading-relaxed">
                Organize activities with AI-enhanced descriptions and impact
                tracking
              </p>
            </div>
            <div
              onClick={() => openFeatureDemo(4)}
              className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] rounded-xl p-6 border border-neutral-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-white mb-3 text-content">
                Peer Network
              </h3>
              <p className="text-white/70 text-base text-content leading-relaxed">
                Connect and collaborate on projects with students worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Demo Modal */}
      {showFeatureDemo && (
        <div className="fixed inset-0 w-screen bg-black/90 z-50 flex items-center justify-center">
          <div className="bg-[#1A1A1A] rounded-2xl sm:rounded-3xl border border-[#FEEBD8]/20 shadow-2xl max-w-4xl w-full mx-2 sm:mx-4 overflow-hidden max-h-[95vh] sm:max-h-[90vh] relative">
            {/* Custom Scrollable Content */}
            <div className="max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#FEEBD8]/10 to-blue-300/10 p-4 sm:p-6 border-b border-[#FEEBD8]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="text-2xl sm:text-3xl flex-shrink-0">
                      {features[activeFeature].icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-2xl font-bold text-[#FEEBD8] mb-1 truncate">
                        {features[activeFeature].demo.title}
                      </h3>
                      <p className="text-white/90 text-sm sm:text-base hidden sm:block">
                        {features[activeFeature].demo.content}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeFeatureDemo}
                    className="w-12 h-12 sm:w-10 sm:h-10 bg-[#FEEBD8]/10 hover:bg-[#FEEBD8]/20 rounded-full flex items-center justify-center transition-all duration-300 border border-[#FEEBD8]/30 flex-shrink-0 ml-2"
                  >
                    <span className="text-[#FEEBD8] text-xl">×</span>
                  </button>
                </div>
              </div>

              {/* Feature Tabs */}
              <div className="bg-[#141414] px-4 sm:px-6 py-4 border-b border-[#FEEBD8]/20">
                <div className="relative">
                  {/* Feature Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() =>
                        handleFeatureChange(
                          activeFeature > 0
                            ? activeFeature - 1
                            : features.length - 1
                        )
                      }
                      className="w-12 h-12 sm:w-12 sm:h-12 bg-[#FEEBD8]/10 hover:bg-[#FEEBD8]/20 rounded-full flex items-center justify-center transition-all duration-300 border border-[#FEEBD8]/30"
                    >
                      <span className="text-[#FEEBD8] text-lg sm:text-xl">
                        ‹
                      </span>
                    </button>

                    <div className="flex-1 text-center px-2 sm:px-0">
                      <h4 className="text-base sm:text-xl font-bold text-[#FEEBD8]">
                        {features[activeFeature].title}
                      </h4>
                      <p className="text-white/80 text-xs sm:text-base hidden sm:block">
                        {features[activeFeature].description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleFeatureChange(
                          activeFeature < features.length - 1
                            ? activeFeature + 1
                            : 0
                        )
                      }
                      className="w-12 h-12 sm:w-12 sm:h-12 bg-[#FEEBD8]/10 hover:bg-[#FEEBD8]/20 rounded-full flex items-center justify-center transition-all duration-300 border border-[#FEEBD8]/30"
                    >
                      <span className="text-[#FEEBD8] text-lg sm:text-xl">
                        ›
                      </span>
                    </button>
                  </div>

                  {/* All Feature Buttons - Scrollable */}
                  <div
                    ref={scrollContainerRef}
                    className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"
                  >
                    {features.map((feature, index) => (
                      <button
                        key={feature.id}
                        onClick={() => handleFeatureChange(index)}
                        className={`flex-shrink-0 px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 border text-xs sm:text-base ${
                          activeFeature === index
                            ? "bg-gradient-to-r from-[#FEEBD8] to-blue-300 text-[#141414] font-bold border-transparent"
                            : "bg-[#1A1A1A] text-white/80 hover:text-[#FEEBD8] hover:bg-[#1A1A1A]/80 border-[#FEEBD8]/20 hover:border-[#FEEBD8]/40"
                        }`}
                      >
                        <span className="text-base sm:text-xl mr-1 sm:mr-3">
                          {feature.icon}
                        </span>
                        <span className="text-xs sm:text-base font-medium">
                          {feature.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleFeatureChange(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeFeature === index
                            ? "bg-[#FEEBD8] w-6"
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Auto-play Toggle */}
                  <div className="flex justify-center mt-3">
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className={`px-3 py-1 rounded-full text-xs transition-all duration-300 border ${
                        isAutoPlaying
                          ? "bg-[#FEEBD8]/20 text-[#FEEBD8] border-[#FEEBD8]/30"
                          : "bg-[#1A1A1A] text-white/70 border-[#FEEBD8]/20 hover:border-[#FEEBD8]/40"
                      }`}
                    >
                      {isAutoPlaying ? "⏸️ Pause" : "▶️ Auto-play"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-4 sm:p-6">
                {/* Essay Manager Demo */}
                {activeFeature === 0 && (
                  <div className="space-y-6">
                    <div className="bg-[#0F0F0F] rounded-xl p-4 sm:p-6 border border-[#FEEBD8]/20 shadow-lg">
                      <h4 className="text-[#FEEBD8] font-bold mb-4 text-lg sm:text-xl">
                        Your Essay Draft
                      </h4>
                      <div className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4 mb-4 border border-[#FEEBD8]/10">
                        <p className="text-white/90 italic text-sm sm:text-base">
                          {features[0].demo.mockData.essayText}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-[#FEEBD8] font-semibold mb-2 text-base sm:text-lg">
                            AI Feedback
                          </h5>
                          <ul className="space-y-2">
                            {features[0].demo.mockData?.feedback?.map(
                              (item, i) => (
                                <li
                                  key={i}
                                  className="text-white/90 text-sm sm:text-base flex items-start"
                                >
                                  <span className="text-green-400 mr-2 mt-0.5 flex-shrink-0">
                                    •
                                  </span>
                                  <span>{item}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-[#FEEBD8] font-semibold mb-2 text-base sm:text-lg">
                            Overall Score
                          </h5>
                          <div className="text-2xl sm:text-3xl font-bold text-[#FEEBD8]">
                            {features[0].demo.mockData?.score}/10
                          </div>
                          <p className="text-white/80 text-sm sm:text-base">
                            Strong foundation with room for enhancement
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Smart Calendar Demo */}
                {activeFeature === 1 && (
                  <div className="space-y-6">
                    <div className="bg-[#0F0F0F] rounded-xl p-4 sm:p-6 border border-[#FEEBD8]/20 shadow-lg">
                      <h4 className="text-[#FEEBD8] font-bold mb-4 text-lg sm:text-xl">
                        Upcoming Deadlines
                      </h4>
                      <div className="space-y-3">
                        {features[1].demo.mockData?.upcomingDeadlines?.map(
                          (deadline, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-3 sm:p-4 border border-[#FEEBD8]/10"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    deadline.priority === "high"
                                      ? "bg-red-400"
                                      : "bg-yellow-400"
                                  }`}
                                ></div>
                                <div>
                                  <p className="text-white font-semibold drop-shadow-sm">
                                    {deadline.school}
                                  </p>
                                  <p className="text-white/70 text-sm drop-shadow-sm">
                                    {deadline.task}
                                  </p>
                                </div>
                              </div>
                              <div className="text-[#FEEBD8] font-bold drop-shadow-sm">
                                {deadline.date}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Academic Tracking Demo */}
                {activeFeature === 2 && (
                  <div className="space-y-6">
                    <div className="bg-[#0F0F0F] rounded-xl p-4 sm:p-6 border border-[#FEEBD8]/20 shadow-lg">
                      <h4 className="text-[#FEEBD8] font-bold mb-4 text-lg sm:text-xl">
                        Your Academic Profile
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <h5 className="text-[#FEEBD8] font-semibold mb-3 text-base sm:text-lg">
                            Stats
                          </h5>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm sm:text-base">
                                GPA:
                              </span>
                              <span className="text-[#FEEBD8] font-bold text-base sm:text-lg">
                                {features[2].demo.mockData?.gpa}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/80 text-sm sm:text-base">
                                SAT Score:
                              </span>
                              <span className="text-[#FEEBD8] font-bold text-base sm:text-lg">
                                {features[2].demo.mockData?.satScore}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-[#FEEBD8] font-semibold mb-3 text-base sm:text-lg">
                            School Matches
                          </h5>
                          <div className="space-y-2">
                            {features[2].demo.mockData?.matches?.map(
                              (match, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-3 border border-[#FEEBD8]/10"
                                >
                                  <span className="text-white text-sm sm:text-base">
                                    {match.school}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[#FEEBD8] font-bold text-sm sm:text-base">
                                      {match.match}
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        match.type === "safety"
                                          ? "bg-green-400/20 text-green-400"
                                          : match.type === "target"
                                          ? "bg-yellow-400/20 text-yellow-400"
                                          : "bg-red-400/20 text-red-400"
                                      }`}
                                    >
                                      {match.type}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Extracurricular Manager Demo */}
                {activeFeature === 3 && (
                  <div className="space-y-6">
                    <div className="bg-[#0F0F0F] rounded-xl p-4 sm:p-6 border border-[#FEEBD8]/20 shadow-lg">
                      <h4 className="text-[#FEEBD8] font-bold mb-4 text-lg sm:text-xl">
                        Your Activities
                      </h4>
                      <div className="space-y-4">
                        {features[3].demo.mockData?.activities?.map(
                          (activity, i) => (
                            <div
                              key={i}
                              className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4 border border-[#FEEBD8]/10"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                                <h5 className="text-white font-semibold text-base sm:text-lg">
                                  {activity.name}
                                </h5>
                                <span className="text-[#FEEBD8] text-sm sm:text-base font-medium">
                                  {activity.hours}
                                </span>
                              </div>
                              <p className="text-white/80 text-sm sm:text-base">
                                {activity.impact}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Peer Network Demo */}
                {activeFeature === 4 && (
                  <div className="space-y-6">
                    <div className="bg-[#0F0F0F] rounded-xl p-4 sm:p-6 border border-[#FEEBD8]/20 shadow-lg">
                      <h4 className="text-[#FEEBD8] font-bold mb-4 text-lg sm:text-xl">
                        Your Network
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {features[4].demo.mockData?.connections?.map(
                          (connection, i) => (
                            <div
                              key={i}
                              className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4 border border-[#FEEBD8]/10"
                            >
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FEEBD8] to-blue-300 rounded-full flex items-center justify-center text-[#141414] font-bold text-sm sm:text-base">
                                  {connection.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-white font-semibold text-sm sm:text-base">
                                    {connection.name}
                                  </p>
                                  <p className="text-white/80 text-xs sm:text-sm">
                                    {connection.country}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[#FEEBD8] text-xs sm:text-sm">
                                Working on: {connection.project}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6 sm:mt-8 text-center">
                  <div className="bg-gradient-to-r from-[#FEEBD8] to-blue-300 rounded-xl p-4 sm:p-6 text-[#141414]">
                    <h4 className="text-lg sm:text-xl font-bold mb-2">
                      Ready to Experience This?
                    </h4>
                    <p className="mb-4 opacity-80 text-sm sm:text-base">
                      Join thousands of students already using Paccy for their
                      college applications.
                    </p>
                    <button
                      onClick={navigateToAuth}
                      className="px-4 sm:px-6 py-3 bg-[#141414] text-[#FEEBD8] rounded-xl font-bold hover:bg-gray-800 transition-colors text-sm sm:text-base"
                    >
                      Start Your Free Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
