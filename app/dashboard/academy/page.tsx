"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddTermModal from "../../../components/Modals/AddTermModal";
import AddExamScoreModal from "../../../components/Modals/AddExamScoreModal";
import { calendarApi } from "../../../lib/api/calendar";
import { CalendarEvent, EventType } from "../../../lib/types";
import {
  FaArrowLeft,
  FaGraduationCap,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaTrophy,
  FaStar,
  FaMedal,
  FaAward,
  FaBullseye,
  FaFireAlt,
} from "react-icons/fa";

// Mock academic data
const mockAcademicData = {
  gpa: {
    current: 3.85,
    target: 3.95,
    terms: [
      { term: "Fall 2024", gpa: 3.92, courses: 6 },
      { term: "Spring 2024", gpa: 3.78, courses: 6 },
      { term: "Fall 2023", gpa: 3.85, courses: 5 },
      { term: "Spring 2023", gpa: 3.81, courses: 5 },
    ],
  },
  exams: [
    {
      id: 1,
      name: "SAT",
      score: 1480,
      maxScore: 1600,
      date: "2024-10-15",
      target: 1520,
      attempts: 2,
    },
    {
      id: 2,
      name: "ACT",
      score: 33,
      maxScore: 36,
      date: "2024-08-20",
      target: 35,
      attempts: 1,
    },
    {
      id: 3,
      name: "AP Calculus BC",
      score: 5,
      maxScore: 5,
      date: "2024-05-15",
      target: 5,
      attempts: 1,
    },
    {
      id: 4,
      name: "AP Physics 1",
      score: 4,
      maxScore: 5,
      date: "2024-05-20",
      target: 5,
      attempts: 1,
    },
  ],
  academicGoals: [
    { id: 1, goal: "Achieve 3.95 GPA", completed: false, priority: "high" },
    { id: 2, goal: "Score 1520+ on SAT", completed: false, priority: "high" },
    { id: 3, goal: "Take 5 AP courses", completed: true, priority: "medium" },
    { id: 4, goal: "Maintain honor roll", completed: true, priority: "medium" },
  ],
};

const gradeColorMap: { [key: string]: string } = {
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

// Simple GPA Interface
interface GradeYear {
  grade: number; // 9, 10, 11, 12
  name: string;
  gpa: number | null;
}

type GPAScale = "4.0" | "5.0" | "100";

export default function AcademyPage() {
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [showAddExamScoreModal, setShowAddExamScoreModal] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // GPA Tracker State
  const [gpaScale, setGpaScale] = useState<GPAScale>("4.0");
  const [isEditingGPA, setIsEditingGPA] = useState(false);
  const [gradeYears, setGradeYears] = useState<GradeYear[]>([
    { grade: 9, name: "Freshman", gpa: null },
    { grade: 10, name: "Sophomore", gpa: null },
    { grade: 11, name: "Junior", gpa: null },
    { grade: 12, name: "Senior", gpa: null },
  ]);

  // GPA Conversion Functions
  const convertGPA = (
    gpa: number,
    fromScale: GPAScale,
    toScale: GPAScale
  ): string => {
    if (fromScale === toScale) return gpa.toFixed(2);

    // Convert to 4.0 scale first
    let normalized = gpa;
    if (fromScale === "5.0") normalized = (gpa / 5) * 4;
    if (fromScale === "100") normalized = (gpa / 100) * 4;

    // Convert from 4.0 to target scale
    if (toScale === "5.0") return ((normalized / 4) * 5).toFixed(2);
    if (toScale === "100") return ((normalized / 4) * 100).toFixed(1);
    return normalized.toFixed(2);
  };

  const updateYearGPA = (gradeIndex: number, newGPA: number | null) => {
    const updated = [...gradeYears];
    updated[gradeIndex].gpa = newGPA;
    setGradeYears(updated);
  };

  const calculateCumulativeGPA = (): number => {
    const validGPAs = gradeYears.filter((year) => year.gpa !== null);
    if (validGPAs.length === 0) return 0;

    // Convert all to 4.0 scale for calculation
    const normalizedGPAs = validGPAs.map((year) => {
      let normalized = year.gpa!;
      if (gpaScale === "5.0") normalized = (year.gpa! / 5) * 4;
      if (gpaScale === "100") normalized = (year.gpa! / 100) * 4;
      return normalized;
    });

    return (
      normalizedGPAs.reduce((sum, gpa) => sum + gpa, 0) / normalizedGPAs.length
    );
  };

  const getGPALevel = (
    gpa: number
  ): { level: string; color: string; icon: any } => {
    if (gpa >= 3.8)
      return { level: "Outstanding", color: "text-purple-400", icon: FaMedal };
    if (gpa >= 3.5)
      return { level: "Excellent", color: "text-green-400", icon: FaTrophy };
    if (gpa >= 3.0)
      return { level: "Good", color: "text-blue-400", icon: FaAward };
    if (gpa >= 2.5)
      return { level: "Fair", color: "text-yellow-400", icon: FaBullseye };
    return {
      level: "Needs Improvement",
      color: "text-red-400",
      icon: FaFireAlt,
    };
  };

  const cumulativeGPA = calculateCumulativeGPA();
  const gpaLevel = getGPALevel(cumulativeGPA);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const events = await calendarApi.getAll();
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      }
    };

    fetchCalendarEvents();
  }, []);

  const handleAddTerm = () => {
    setShowAddTermModal(true);
  };

  const handleAddExamScore = () => {
    setShowAddExamScoreModal(true);
  };

  const [academicData, setAcademicData] = useState(mockAcademicData);

  const calculateGPAProgress = () => {
    const current = academicData.gpa.current;
    const target = academicData.gpa.target;
    return (current / target) * 100;
  };

  const getExamProgress = (exam: any) => {
    return (exam.score / exam.maxScore) * 100;
  };

  // Memoize exam dates to avoid multiple function calls
  const satExamDate = getSATExamDate();
  const apExamDates = getAPExamDates(); // Changed to plural for multiple APs
  const ibExamDate = getIBExamDate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FEEBD8]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              <FaArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#FEEBD8] flex items-center gap-3">
                <FaGraduationCap className="text-[#FEEBD8]" />
                Academy Dashboard
              </h1>
              <p className="text-[#FEEBD8]/60 mt-1">
                Track your academic progress and achievements
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* High School GPA Tracker */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#FEEBD8] to-[#E5D5B7] shadow-md">
                  <FaChartLine className="text-[#141414]" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#FEEBD8] mb-1">
                    High School GPA
                  </h2>
                  <p className="text-[#FEEBD8]/70 text-sm">
                    Track your academic journey through high school
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditingGPA(!isEditingGPA)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isEditingGPA
                    ? "bg-[#FEEBD8] text-[#141414] hover:bg-[#E5D5B7]"
                    : "bg-neutral-700/50 text-[#FEEBD8] hover:bg-neutral-700"
                }`}
              >
                <FaEdit size={12} />
                {isEditingGPA ? "Save" : "Edit"}
              </button>
            </div>

            {/* GPA Scale Selector - Only show when editing */}
            {isEditingGPA && (
              <div className="mb-6">
                <label className="block text-[#FEEBD8]/70 text-sm mb-3">
                  GPA Scale
                </label>
                <div className="inline-flex bg-neutral-800/50 rounded-xl p-1 border border-neutral-700/50">
                  {(["4.0", "5.0", "100"] as const).map((scale, index) => (
                    <button
                      key={scale}
                      onClick={() => setGpaScale(scale)}
                      className={`relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out min-w-[60px] ${
                        gpaScale === scale
                          ? "bg-[#FEEBD8] text-[#141414] shadow-lg shadow-[#FEEBD8]/20 transform scale-105"
                          : "text-[#FEEBD8]/60 hover:text-[#FEEBD8] hover:bg-neutral-700/40 hover:scale-102"
                      } ${index === 0 ? "ml-0" : "ml-1"}`}
                    >
                      <span className="relative z-10">
                        {scale === "100" ? "100%" : scale}
                      </span>
                      {gpaScale === scale && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] rounded-lg opacity-10" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cumulative GPA Display */}
            <div className="mb-6">
              <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/30">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <gpaLevel.icon className={`${gpaLevel.color} text-lg`} />
                    <span className={`text-sm font-semibold ${gpaLevel.color}`}>
                      {gpaLevel.level}
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-[#FEEBD8] mb-2">
                    {cumulativeGPA > 0
                      ? convertGPA(cumulativeGPA, "4.0", gpaScale)
                      : "--"}
                  </div>

                  <div className="text-[#FEEBD8]/70 text-sm mb-3">
                    Cumulative GPA (
                    {gpaScale === "100" ? "Percentage" : `${gpaScale} Scale`})
                  </div>

                  {/* Scale Conversions */}
                  {cumulativeGPA > 0 && (
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center p-3 rounded-lg bg-neutral-700/30">
                        <div className="font-semibold text-[#FEEBD8] text-sm">
                          {convertGPA(cumulativeGPA, "4.0", "4.0")}
                        </div>
                        <div className="text-[#FEEBD8]/60 mt-1">4.0</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-neutral-700/30">
                        <div className="font-semibold text-[#FEEBD8] text-sm">
                          {convertGPA(cumulativeGPA, "4.0", "5.0")}
                        </div>
                        <div className="text-[#FEEBD8]/60 mt-1">5.0</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-neutral-700/30">
                        <div className="font-semibold text-[#FEEBD8] text-sm">
                          {convertGPA(cumulativeGPA, "4.0", "100")}%
                        </div>
                        <div className="text-[#FEEBD8]/60 mt-1">%</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grade Years Grid */}
            <div className="grid grid-cols-2 gap-4">
              {gradeYears.map((year, index) => (
                <div key={year.grade} className="group">
                  <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/30 hover:border-[#FEEBD8]/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-[#FEEBD8]">
                          Grade {year.grade}
                        </h3>
                        <p className="text-xs text-[#FEEBD8]/60 mt-1">
                          {year.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-[#FEEBD8]">
                          {year.gpa !== null
                            ? convertGPA(year.gpa, gpaScale, gpaScale)
                            : "--"}
                        </div>
                      </div>
                    </div>

                    {/* Read-only mode by default, editable when editing */}
                    {isEditingGPA ? (
                      <div className="space-y-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={
                            gpaScale === "4.0"
                              ? "4"
                              : gpaScale === "5.0"
                              ? "5"
                              : "100"
                          }
                          placeholder={`Enter GPA (${
                            gpaScale === "100" ? "%" : gpaScale
                          })`}
                          value={year.gpa || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            updateYearGPA(index, isNaN(value) ? null : value);
                          }}
                          className="w-full bg-neutral-700/50 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] text-center text-sm font-medium placeholder-[#FEEBD8]/40 focus:outline-none focus:border-[#FEEBD8] focus:bg-neutral-700 transition-all duration-200"
                        />

                        {year.gpa !== null && (
                          <div className="text-xs text-center">
                            <div className="flex justify-between text-[#FEEBD8]/60 space-x-2">
                              <span>
                                4.0: {convertGPA(year.gpa, gpaScale, "4.0")}
                              </span>
                              <span>
                                5.0: {convertGPA(year.gpa, gpaScale, "5.0")}
                              </span>
                              <span>
                                %: {convertGPA(year.gpa, gpaScale, "100")}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        {year.gpa !== null ? (
                          <div className="text-xs text-[#FEEBD8]/60">
                            <div className="flex justify-between space-x-2">
                              <span>
                                4.0: {convertGPA(year.gpa, gpaScale, "4.0")}
                              </span>
                              <span>
                                5.0: {convertGPA(year.gpa, gpaScale, "5.0")}
                              </span>
                              <span>
                                %: {convertGPA(year.gpa, gpaScale, "100")}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            No GPA entered
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Summary */}
            {cumulativeGPA > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-900/15 to-blue-900/15 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <FaBullseye className="text-green-400 text-lg" />
                  <h3 className="text-lg font-semibold text-green-400">
                    Academic Progress
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  Your cumulative high school GPA is{" "}
                  <span className="font-bold text-white">
                    {convertGPA(cumulativeGPA, "4.0", gpaScale)}
                  </span>
                  .
                  {cumulativeGPA >= 3.8 &&
                    " 🏆 Outstanding! You're in the top tier for college admissions."}
                  {cumulativeGPA >= 3.5 &&
                    cumulativeGPA < 3.8 &&
                    " 🎯 Excellent work! You're competitive for most universities."}
                  {cumulativeGPA >= 3.0 &&
                    cumulativeGPA < 3.5 &&
                    " 📈 Good progress! Keep pushing to reach your target schools."}
                  {cumulativeGPA < 3.0 &&
                    " 💪 Focus on your remaining years to boost your overall GPA."}
                </p>
              </div>
            )}
          </div>

          {/* Exam Scores and Events */}
          <div className="space-y-6">
            {/* Exam Scores Overview */}
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FEEBD8] to-[#E5D5B7]">
                    <FaTrophy className="text-[#141414]" size={18} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#FEEBD8]">
                      Exam Scores
                    </h3>
                    <p className="text-[#FEEBD8]/70 text-sm mt-1">
                      Track your standardized test performance
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAddExamScore}
                  className="bg-[#FEEBD8] text-[#141414] px-3 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
                >
                  <FaPlus size={12} />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-4">
                {academicData.exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/30"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-[#FEEBD8] text-sm">
                          {exam.name}
                        </h4>
                        <p className="text-[#FEEBD8]/60 text-xs mt-1">
                          {new Date(exam.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-[#FEEBD8]">
                          {exam.score}/{exam.maxScore}
                        </div>
                        <div className="text-xs text-[#FEEBD8]/60">
                          {getExamProgress(exam).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-[#FEEBD8]/60 mb-1">
                        <span>Progress</span>
                        <span>{getExamProgress(exam).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-[#FEEBD8] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getExamProgress(exam)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#FEEBD8]/60">
                        Target: {exam.target}
                      </span>
                      <span className="text-gray-400">
                        Attempts: {exam.attempts}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Academic Events */}
            <div className="bg-[#141414] border border-neutral-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-neutral-800">
                  <FaGraduationCap className="text-[#FEEBD8]" size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#FEEBD8]">
                    Upcoming Events
                  </h3>
                  <p className="text-[#FEEBD8]/60 text-sm mt-1">
                    Academic deadlines and important dates
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* SAT Exam Date - Only if upcoming */}
                {new Date(satExamDate).getTime() > new Date().getTime() && (
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-blue-300">SAT Exam</h4>
                        <p className="text-[#FEEBD8]/60 text-sm">
                          {new Date(satExamDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-blue-400 font-semibold">
                        {Math.ceil(
                          (new Date(satExamDate).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </div>
                    </div>
                  </div>
                )}

                {/* AP Exam Dates - Only upcoming ones */}
                {apExamDates
                  .filter(
                    (ap) => new Date(ap.date).getTime() > new Date().getTime()
                  )
                  .slice(0, 3)
                  .map((ap, index) => (
                    <div
                      key={index}
                      className="bg-green-900/20 border border-green-700/50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-green-300">
                            AP {ap.subject}
                          </h4>
                          <p className="text-[#FEEBD8]/60 text-sm">
                            {new Date(ap.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-green-400 font-semibold">
                          {Math.ceil(
                            (new Date(ap.date).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Calendar Events - Test Dates Only */}
                {calendarEvents
                  .filter(
                    (event) =>
                      event.date &&
                      event.type === EventType.TEST_DATE &&
                      new Date(event.date).getTime() > new Date().getTime()
                  )
                  .slice(0, 3)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-purple-300">
                            {event.title}
                          </h4>
                          <p className="text-[#FEEBD8]/60 text-sm">
                            {event.date &&
                              new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                          </p>
                        </div>
                        <div className="text-purple-400 font-semibold">
                          {event.date &&
                            Math.ceil(
                              (new Date(event.date).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                          days
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {showAddTermModal && (
        <AddTermModal
          isOpen={showAddTermModal}
          onClose={() => setShowAddTermModal(false)}
          onSave={(termData) => {
            // Handle term save
            console.log("Term saved:", termData);
            setShowAddTermModal(false);
          }}
        />
      )}
      {showAddExamScoreModal && (
        <AddExamScoreModal
          isOpen={showAddExamScoreModal}
          onClose={() => setShowAddExamScoreModal(false)}
          onSave={(examData) => {
            // Handle exam save
            console.log("Exam saved:", examData);
            setShowAddExamScoreModal(false);
          }}
        />
      )}
    </div>
  );
}

// Utility functions for exam dates
function getSATExamDate() {
  // Return next SAT exam date (always future)
  const nextYear = new Date().getFullYear() + 1;
  return `${nextYear}-03-08`;
}

function getAPExamDates() {
  // Return array of AP exam dates (always future)
  const nextYear = new Date().getFullYear() + 1;
  return [
    { subject: "Computer Science A", date: `${nextYear}-05-08` },
    { subject: "Calculus BC", date: `${nextYear}-05-12` },
    { subject: "Physics 1", date: `${nextYear}-05-15` },
  ];
}

function getIBExamDate() {
  // Return IB exam period
  return "2025-05-01";
}
