"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddExtracurricularModal from "../../../components/Modals/AddExtracurricularModal";
import EditExtracurricularModal from "../../../components/Modals/EditExtracurricularModal";
import {
  FaArrowLeft,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTrophy,
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaHeart,
  FaBriefcase,
  FaGraduationCap,
  FaMusic,
  FaRunning,
} from "react-icons/fa";

// Mock extracurriculars data
const mockExtracurriculars = [
  {
    id: 1,
    name: "Student Government President",
    category: "Leadership",
    role: "President",
    organization: "Lincoln High School",
    startDate: "2023-09-01",
    endDate: "2025-06-01",
    hoursPerWeek: 15,
    description:
      "Led a student body of 1,200+ students, organized school events, and advocated for student interests with administration.",
    achievements: [
      "Increased student participation by 40%",
      "Implemented new mental health resources",
    ],
    impact: "High",
    skills: ["Leadership", "Public Speaking", "Event Planning"],
  },
  {
    id: 2,
    name: "Habitat for Humanity Volunteer",
    category: "Community Service",
    role: "Volunteer Coordinator",
    organization: "Habitat for Humanity",
    startDate: "2022-06-01",
    endDate: "Present",
    hoursPerWeek: 8,
    description:
      "Coordinated volunteer groups and helped build homes for low-income families in the community.",
    achievements: ["Helped build 5 homes", "Recruited 50+ new volunteers"],
    impact: "High",
    skills: ["Project Management", "Teamwork", "Construction"],
  },
  {
    id: 3,
    name: "Varsity Soccer Team",
    category: "Sports",
    role: "Team Captain",
    organization: "Lincoln High School",
    startDate: "2021-08-01",
    endDate: "2025-05-01",
    hoursPerWeek: 20,
    description:
      "Competed at varsity level and led team to state championships. Maintained team morale and coordinated training schedules.",
    achievements: ["State Championship 2024", "All-Conference Selection"],
    impact: "Medium",
    skills: ["Teamwork", "Discipline", "Time Management"],
  },
  {
    id: 4,
    name: "Math Tutoring Program",
    category: "Academic",
    role: "Tutor",
    organization: "Self-organized",
    startDate: "2023-01-01",
    endDate: "Present",
    hoursPerWeek: 6,
    description:
      "Provide free math tutoring to middle school students struggling with algebra and geometry.",
    achievements: [
      "Tutored 20+ students",
      "Average grade improvement of 2 letter grades",
    ],
    impact: "Medium",
    skills: ["Teaching", "Communication", "Patience"],
  },
  {
    id: 5,
    name: "School Newspaper Editor",
    category: "Media/Arts",
    role: "Editor-in-Chief",
    organization: "Lincoln High School",
    startDate: "2023-09-01",
    endDate: "2025-06-01",
    hoursPerWeek: 10,
    description:
      "Managed editorial team, wrote articles, and oversaw publication of monthly school newspaper.",
    achievements: ["Increased readership by 60%", "Won state journalism award"],
    impact: "Medium",
    skills: ["Writing", "Leadership", "Design"],
  },
  {
    id: 6,
    name: "Part-time Job at Local Bookstore",
    category: "Work Experience",
    role: "Sales Associate",
    organization: "Chapter & Verse Bookstore",
    startDate: "2024-01-01",
    endDate: "Present",
    hoursPerWeek: 12,
    description:
      "Customer service, inventory management, and book recommendations. Learned valuable workplace skills.",
    achievements: [
      "Employee of the Month (3x)",
      "Increased book club membership",
    ],
    impact: "Medium",
    skills: ["Customer Service", "Sales", "Responsibility"],
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Leadership: <FaTrophy className="text-yellow-400" />,
  "Community Service": <FaHeart className="text-red-400" />,
  Sports: <FaRunning className="text-green-400" />,
  Academic: <FaGraduationCap className="text-blue-400" />,
  "Media/Arts": <FaMusic className="text-purple-400" />,
  "Work Experience": <FaBriefcase className="text-orange-400" />,
  Clubs: <FaUsers className="text-cyan-400" />,
};

const impactColors: Record<string, string> = {
  High: "bg-green-500",
  Medium: "bg-yellow-500",
  Low: "bg-blue-500",
};

const categoryColors: Record<string, string> = {
  Leadership: "bg-yellow-500/20 text-yellow-400",
  "Community Service": "bg-red-500/20 text-red-400",
  Sports: "bg-green-500/20 text-green-400",
  Academic: "bg-blue-500/20 text-blue-400",
  "Media/Arts": "bg-purple-500/20 text-purple-400",
  "Work Experience": "bg-orange-500/20 text-orange-400",
  Clubs: "bg-cyan-500/20 text-cyan-400",
};

export default function ExtracurricularsPage() {
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  useEffect(() => {
    document.title = "Extracurriculars | Paccy";
  }, []);

  const handleAddActivity = () => {
    setShowAddActivityModal(true);
  };

  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity);
    setShowEditActivityModal(true);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <div className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/dashboard"
                className="text-[#FEEBD8] hover:text-[#E5D5B7] transition-colors flex items-center gap-2 mb-4"
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-3xl font-bold text-[#FEEBD8] flex items-center gap-3">
                <FaUsers className="text-purple-400" />
                Extracurricular Activities
              </h1>
              <p className="text-neutral-400 mt-2">
                Track and manage your extracurricular activities and
                achievements
              </p>
            </div>
            <button
              onClick={handleAddActivity}
              className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
            >
              <FaPlus />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {mockExtracurriculars.length}
                  </p>
                  <p className="text-neutral-400 text-sm">Total Activities</p>
                </div>
                <FaUsers className="text-purple-400 text-2xl" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {mockExtracurriculars.reduce(
                      (total, activity) => total + activity.hoursPerWeek,
                      0
                    )}
                  </p>
                  <p className="text-neutral-400 text-sm">Hours per Week</p>
                </div>
                <FaClock className="text-blue-400 text-2xl" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {
                      mockExtracurriculars.filter(
                        (activity) => activity.impact === "High"
                      ).length
                    }
                  </p>
                  <p className="text-neutral-400 text-sm">High Impact</p>
                </div>
                <FaStar className="text-yellow-400 text-2xl" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {mockExtracurriculars.reduce(
                      (total, activity) => total + activity.achievements.length,
                      0
                    )}
                  </p>
                  <p className="text-neutral-400 text-sm">Achievements</p>
                </div>
                <FaTrophy className="text-orange-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-6">
            {mockExtracurriculars.map((activity) => (
              <div
                key={activity.id}
                className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">
                          {categoryIcons[activity.category]}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-[#FEEBD8]">
                              {activity.name}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                categoryColors[activity.category]
                              }`}
                            >
                              {activity.category}
                            </span>
                          </div>
                          <p className="text-neutral-300 font-medium">
                            {activity.role} • {activity.organization}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <FaCalendarAlt />
                        <span>
                          {activity.startDate} -{" "}
                          {activity.endDate === "Present"
                            ? "Present"
                            : activity.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <FaClock />
                        <span>{activity.hoursPerWeek} hours/week</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-400">Impact:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              impactColors[activity.impact]
                            }`}
                          />
                          <span className="text-[#FEEBD8] font-medium">
                            {activity.impact}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-neutral-300 mb-4">
                      {activity.description}
                    </p>

                    {activity.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-[#FEEBD8] font-medium mb-2 flex items-center gap-2">
                          <FaTrophy className="text-yellow-400" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-1">
                          {activity.achievements.map((achievement, index) => (
                            <li
                              key={index}
                              className="text-neutral-300 text-sm flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-[#FEEBD8] rounded-full" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {activity.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#2A2A2A] text-[#FEEBD8] px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2">
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {showAddActivityModal && (
        <AddExtracurricularModal
          isOpen={showAddActivityModal}
          onClose={() => setShowAddActivityModal(false)}
          onSave={(data) => {
            console.log("Activity data:", data);
            setShowAddActivityModal(false);
          }}
        />
      )}

      {showEditActivityModal && selectedActivity && (
        <EditExtracurricularModal
          isOpen={showEditActivityModal}
          onClose={() => {
            setShowEditActivityModal(false);
            setSelectedActivity(null);
          }}
          extracurricular={selectedActivity}
          onSave={(data) => {
            console.log("Updated activity data:", data);
            setShowEditActivityModal(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
}
