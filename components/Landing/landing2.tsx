"use client";

import { useRouter } from "next/navigation";

const mvpFeatures: Array<ICard> = [
  {
    img: "/assets/landing.jpg",
    title: "📝 Essay Manager + AI Feedback",
    description: [
      "Track essays by school or prompt (Common App, UC PIQs)",
      "Real-time AI feedback on clarity & coherence",
      "Topic bank and inspiration feed",
      "Common themes: leadership, adversity, growth",
      "Smart suggestions for improvement",
    ],
    link: "/how-it-works",
  },
  {
    img: "/assets/landing.jpg",
    title: "📆 Application Calendar & Deadlines",
    description: [
      "Smart timeline auto-generates tasks",
      "Visual calendar for progress monitoring",
      "Submit dates and testing windows",
      "SAT, IELTS, and other test tracking",
      "Never miss important deadlines",
    ],
    link: "/how-it-works",
  },
  {
    img: "/assets/landing.jpg",
    title: "🎓 Academic Profile Tracking",
    description: [
      "Enter and update GPA and test scores",
      "Track coursework and academic progress",
      "Competitiveness level for each school",
      "Reach / target / safety suggestions",
      "Data-driven school recommendations",
    ],
    link: "/how-it-works",
  },
  {
    img: "/assets/landing.jpg",
    title: "🧩 Extracurricular Manager",
    description: [
      "Organize ECAs, awards, and leadership",
      "Track jobs and volunteer experience",
      "Role, impact, and hours/week tracking",
      "AI feedback on Common App entries",
      "Optimize activity descriptions",
    ],
    link: "/how-it-works",
  },
  {
    img: "/assets/landing.jpg",
    title: "🌍 Peer Network",
    description: [
      "Connect with non-competing applicants",
      "Collaborate on projects and extracurriculars",
      "Different countries or majors",
      "Share insights and tips privately",
      "Build supportive community together",
    ],
    link: "/how-it-works",
  },
];

export default function Home2() {
  const router = useRouter();

  const navigateToAuth = () => {
    router.push("/auth");
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#FEEBD8] via-blue-300 to-purple-500 bg-clip-text text-transparent mb-4 font-climate-crisis">
            Complete College Application Suite
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Five powerful features designed to bring structure, clarity, and
            collaboration to your college application journey.
          </p>
        </div>

        <div
          id="features"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-16"
        >
          {mvpFeatures.map((feature, index) => {
            return (
              <Card
                key={index}
                index={index}
                img={feature.img}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            );
          })}
        </div>

        {/* Why Paccy Section */}
        <div className="mt-12 md:mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-[#FEEBD8] mb-6 md:mb-8">
            Why Students Choose Paccy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#FEEBD8]/20 hover:border-[#FEEBD8]/40 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-2">
                Structure & Clarity
              </h4>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                Transform the chaotic application process into an organized,
                step-by-step journey with clear milestones.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#FEEBD8]/20 hover:border-[#FEEBD8]/40 transition-all duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-2">
                AI-Powered Guidance
              </h4>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                Get intelligent feedback on essays, activities, and profile
                optimization from our advanced AI assistant.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#FEEBD8]/20 hover:border-[#FEEBD8]/40 transition-all duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-2">
                Collaborative Network
              </h4>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                Connect with peers globally, share insights, and support each
                other through the application journey.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 bg-gradient-to-r from-[#FEEBD8] to-blue-300 rounded-2xl p-8 text-[#141414] text-center shadow-xl">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Application Process?
          </h3>
          <p className="text-xl text-[#141414]/80 mb-6 max-w-2xl mx-auto leading-relaxed">
            Join high school students worldwide who are using Paccy to navigate
            college applications with confidence and clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={navigateToAuth}
              className="px-8 py-4 bg-[#141414] text-[#FEEBD8] font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              Start Building Your Profile
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 border-2 border-[#141414]/30 text-[#141414] font-bold rounded-xl hover:bg-[#141414]/10 transition-all duration-300"
            >
              Explore All Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type ICard = {
  index?: number;
  img: string;
  title: string;
  description: Array<String>;
  link?: string;
};

export const Card = ({ index, img, title, description, link }: ICard) => {
  const router = useRouter();
  const gradients = [
    "from-[#FEEBD8] to-blue-300",
    "from-blue-400 to-indigo-500",
    "from-indigo-500 to-purple-600",
    "from-purple-600 to-blue-500",
    "from-blue-500 to-[#FEEBD8]",
  ];

  const bgColors = [
    "bg-[#1A1A1A] border-[#FEEBD8]/20 hover:border-[#FEEBD8]/40",
    "bg-[#1A1A1A] border-blue-400/20 hover:border-blue-400/40",
    "bg-[#1A1A1A] border-indigo-500/20 hover:border-indigo-500/40",
    "bg-[#1A1A1A] border-purple-600/20 hover:border-purple-600/40",
    "bg-[#1A1A1A] border-blue-500/20 hover:border-blue-500/40",
  ];

  const currentGradient = gradients[index! % gradients.length];
  const currentBg = bgColors[index! % bgColors.length];

  return (
    <div
      className={`group hover:scale-105 transition-all duration-300 ${currentBg} border rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl h-full flex flex-col`}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg md:text-xl font-bold text-[#FEEBD8] mb-4">
          {title}
        </h3>
        <div
          className={`w-16 h-1 bg-gradient-to-r ${currentGradient} mx-auto rounded-full`}
        ></div>
      </div>

      <ul className="space-y-3 flex-grow mb-6">
        {description.map((item, idx) => (
          <li key={idx} className="flex items-start text-white/90">
            <span
              className={`w-2 h-2 bg-gradient-to-r ${currentGradient} rounded-full mr-3 mt-2 flex-shrink-0`}
            ></span>
            <span className="text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 border-t border-[#FEEBD8]/20">
        <button
          onClick={() => link && router.push(link)}
          className="w-full py-3 bg-[#1A1A1A] border border-[#FEEBD8]/40 text-[#FEEBD8] font-semibold rounded-lg hover:bg-[#FEEBD8]/10 hover:border-[#FEEBD8]/60 transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-lg group"
        >
          <span className="flex items-center justify-center gap-2">
            Learn More
            <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </button>
      </div>
    </div>
  );
};
