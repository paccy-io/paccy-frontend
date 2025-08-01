"use client";
import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaRocket,
  FaLock,
  FaCrown,
  FaCalendarAlt,
  FaUserGraduate,
  FaEnvelopeOpenText,
  FaChartBar,
  FaComments,
  FaFileAlt,
  FaBell,
  FaShieldAlt,
} from "react-icons/fa";
import Link from "next/link";

type RoadmapFeature = {
  name: string;
  description: string;
  icon: React.ReactNode;
  alert?: string;
};

type RoadmapSection = {
  title: string;
  icon: React.ReactNode;
  color: string;
  features: RoadmapFeature[];
};

const roadmapSections: RoadmapSection[] = [
  {
    title: "Launched Features",
    icon: <FaCheckCircle className="text-green-400 text-2xl" />,
    color: "from-green-500/20 to-green-700/20 border-green-400/30",
    features: [
      {
        name: "Dashboard",
        description:
          "Your personalized hub for college applications, tasks, and progress.",
        icon: <FaRocket className="text-green-300" />,
      },
      {
        name: "College Tracker",
        description:
          "Track and manage your college list, deadlines, and requirements.",
        icon: <FaCrown className="text-yellow-400" />,
      },
      {
        name: "Calendar Integration",
        description:
          "Visualize all your important dates and deadlines in one place.",
        icon: <FaCalendarAlt className="text-blue-400" />,
      },
      {
        name: "Essay Management",
        description:
          "Organize, draft, and store your application essays securely.",
        icon: <FaFileAlt className="text-orange-300" />,
      },
      {
        name: "Notifications",
        description:
          "Stay on top of deadlines and updates with smart notifications.",
        icon: <FaBell className="text-pink-400" />,
      },
      {
        name: "Privacy Controls",
        description:
          "Comprehensive privacy settings for your data and profile.",
        icon: <FaShieldAlt className="text-purple-400" />,
      },
    ],
  },
  {
    title: "In Progress",
    icon: (
      <FaHourglassHalf className="text-yellow-300 text-2xl animate-pulse" />
    ),
    color: "from-orange-500/20 to-yellow-500/20 border-orange-400/30",
    features: [
      {
        name: "Payment System",
        description:
          "Secure and seamless payment integration for premium plans.",
        icon: <FaLock className="text-orange-300" />,
        alert: "Payment System Coming Soon!",
      },
      {
        name: "AI Essay Feedback",
        description:
          "Get instant, actionable feedback on your essays using AI.",
        icon: <FaComments className="text-blue-300" />,
        alert: "AI Essay Feedback is being developed!",
      },
      {
        name: "Advanced Analytics",
        description:
          "Gain insights into your application journey and performance.",
        icon: <FaChartBar className="text-green-300" />,
        alert: "Advanced Analytics Coming Soon!",
      },
      {
        name: "Peer Connections",
        description:
          "Connect and collaborate with other students on similar journeys.",
        icon: <FaUserGraduate className="text-purple-300" />,
        alert: "Peer Connections Coming Soon!",
      },
    ],
  },
  {
    title: "Planned Features",
    icon: <FaRocket className="text-blue-400 text-2xl" />,
    color: "from-blue-500/20 to-purple-500/20 border-blue-400/30",
    features: [
      {
        name: "Scholarship Matching",
        description:
          "Personalized scholarship recommendations based on your profile.",
        icon: <FaCrown className="text-yellow-400" />,
      },
      {
        name: "Interview Prep",
        description:
          "Practice and prepare for college interviews with expert tips.",
        icon: <FaEnvelopeOpenText className="text-pink-400" />,
      },
      {
        name: "Document Collaboration",
        description:
          "Work on essays and documents with mentors or peers in real time.",
        icon: <FaFileAlt className="text-orange-300" />,
      },
      {
        name: "Mobile App",
        description: "Access Paccy on the go with our upcoming mobile app.",
        icon: <FaRocket className="text-blue-400" />,
      },
    ],
  },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/dashboard"
            className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
          >
            <span className="text-2xl">←</span>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#FEEBD8]">Paccy Roadmap</h1>
            <p className="text-[#FEEBD8]/70 mt-2">
              See what's live, what's coming soon, and what's planned for the
              future!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roadmapSections.map((section, idx) => (
            <div
              key={section.title}
              className={`bg-gradient-to-r ${section.color} border rounded-2xl p-6 flex flex-col shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-2xl font-bold text-[#FEEBD8]">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-6 flex-1">
                {section.features.map((feature) => (
                  <div
                    key={feature.name}
                    className="bg-[#141414] border border-neutral-700 rounded-xl p-4 flex items-start gap-4 relative"
                  >
                    <div className="mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#FEEBD8]">
                        {feature.name}
                      </h3>
                      <p className="text-[#FEEBD8]/70 text-sm mb-1">
                        {feature.description}
                      </p>
                      {feature.alert && (
                        <div className="mt-2 p-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg flex items-center gap-2 animate-pulse">
                          <FaHourglassHalf className="text-yellow-300" />
                          <span className="text-orange-200 font-medium text-sm">
                            {feature.alert}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-[#FEEBD8]/70 text-lg">
            Have a feature request or want to give feedback?{" "}
            <a
              href="mailto:support@paccy.io"
              className="text-[#FEEBD8] underline hover:text-[#E5D5B7]"
            >
              Contact us
            </a>{" "}
            — we love hearing from you!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
