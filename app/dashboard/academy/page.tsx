"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import AddTermModal from "../../../components/Modals/AddTermModal";
import AddExamScoreModal from "../../../components/Modals/AddExamScoreModal";
import { calendarApi } from "../../../lib/api/calendar";
import {
  academicApi,
  Exam,
  HighSchoolGPA,
  GPAScale as ApiGPAScale,
} from "../../../lib/api/academic";
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
  FaSpinner,
} from "react-icons/fa";

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
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // API Data State
  const [exams, setExams] = useState<Exam[]>([]);
  const [highSchoolGPA, setHighSchoolGPA] = useState<HighSchoolGPA | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Load initial data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load exam scores
        const examData = await academicApi.getExams();
        setExams(examData);

        // Load high school GPA
        const gpaData = await academicApi.getHighSchoolGPA();
        setHighSchoolGPA(gpaData);

        // If GPA data exists, populate the form
        if (gpaData) {
          setGpaScale(gpaData.scale);
          const updatedYears = [...gradeYears];
          if (gpaData.gpa_1) updatedYears[0].gpa = parseFloat(gpaData.gpa_1);
          if (gpaData.gpa_2) updatedYears[1].gpa = parseFloat(gpaData.gpa_2);
          if (gpaData.gpa_3) updatedYears[2].gpa = parseFloat(gpaData.gpa_3);
          if (gpaData.gpa_4) updatedYears[3].gpa = parseFloat(gpaData.gpa_4);
          setGradeYears(updatedYears);
        }

        // Load calendar events
        const events = await calendarApi.getAll();
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to load academy data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save GPA data to API
  const saveGPAData = async () => {
    try {
      setSaving(true);

      const gpaData = {
        scale: gpaScale as ApiGPAScale,
        gpa_1: gradeYears[0].gpa?.toString(),
        gpa_2: gradeYears[1].gpa?.toString(),
        gpa_3: gradeYears[2].gpa?.toString(),
        gpa_4: gradeYears[3].gpa?.toString(),
      };

      const savedGPA = await academicApi.saveHighSchoolGPA(gpaData);
      setHighSchoolGPA(savedGPA);
      setIsEditingGPA(false);
    } catch (error) {
      console.error("Failed to save GPA data:", error);
    } finally {
      setSaving(false);
    }
  };

  const cumulativeGPA = calculateCumulativeGPA();
  const gpaLevel = getGPALevel(cumulativeGPA);

  const handleAddTerm = () => {
    setShowAddTermModal(true);
  };

  const handleAddExamScore = () => {
    setEditingExam(null); // Clear any editing state
    setShowAddExamScoreModal(true);
  };

  const getExamProgress = (exam: Exam) => {
    return (parseFloat(exam.score) / parseFloat(exam.max_score)) * 100;
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setShowAddExamScoreModal(true);
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm("Are you sure you want to delete this exam score?")) {
      return;
    }

    try {
      await academicApi.deleteExam(examId);
      setExams((prev) => prev.filter((exam) => exam.id !== examId));
    } catch (error) {
      console.error("Failed to delete exam:", error);
    }
  };

  // Memoize exam dates to avoid multiple function calls
  const satExamDate = getSATExamDate();
  const apExamDates = getAPExamDates(); // Changed to plural for multiple APs
  const ibExamDate = getIBExamDate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-white/70 hover:text-white transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Academic Dashboard
            </h1>
            <p className="text-white/70 mt-2 text-sm sm:text-base">
              Track your academic progress and achievements
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* High School GPA Tracker */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <FaChartLine className="text-blue-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    High School GPA
                  </h2>
                  <p className="text-white/70 text-sm">
                    Track your academic journey through high school
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => {
                  if (isEditingGPA) {
                    saveGPAData();
                  } else {
                    setIsEditingGPA(true);
                  }
                }}
                disabled={saving || loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isEditingGPA
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-neutral-700/50 text-white hover:bg-neutral-700"
                } ${saving || loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {saving ? (
                  <FaSpinner className="animate-spin" size={12} />
                ) : (
                  <FaEdit size={12} />
                )}
                {saving ? "Saving..." : isEditingGPA ? "Save" : "Edit"}
              </button>
            </div>

            {/* GPA Scale Selector - Only show when editing */}
            {isEditingGPA && (
              <div className="mb-6">
                <label className="block text-white/70 text-sm mb-3">
                  GPA Scale
                </label>
                <div className="inline-flex bg-neutral-800/50 rounded-xl p-1 border border-neutral-700/50">
                  {(["4.0", "5.0", "100"] as const).map((scale, index) => (
                    <button
                      key={scale}
                      onClick={() => setGpaScale(scale)}
                      className={`relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out min-w-[60px] ${
                        gpaScale === scale
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20 transform scale-105"
                          : "text-white/60 hover:text-white hover:bg-neutral-700/40 hover:scale-102"
                      } ${index === 0 ? "ml-0" : "ml-1"}`}
                    >
                      <span className="relative z-10">
                        {scale === "100" ? "100%" : scale}
                      </span>
                      {gpaScale === scale && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg opacity-10" />
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

                  <div className="text-3xl font-bold text-white mb-2">
                    {cumulativeGPA > 0
                      ? convertGPA(cumulativeGPA, "4.0", gpaScale)
                      : "--"}
                  </div>

                  <div className="text-white/70 text-sm mb-3">
                    Cumulative GPA (
                    {gpaScale === "100" ? "Percentage" : `${gpaScale} Scale`})
                  </div>

                  {/* Scale Conversions */}
                  {cumulativeGPA > 0 && (
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center p-3 rounded-lg bg-neutral-700/30">
                        <div className="font-semibold text-white text-sm">
                          {convertGPA(cumulativeGPA, "4.0", "4.0")}
                        </div>
                        <div className="text-white/60 mt-1">4.0</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-neutral-700/30">
                        <div className="font-semibold text-white text-sm">
                          {convertGPA(cumulativeGPA, "4.0", "5.0")}
                        </div>
                        <div className="text-white/60 mt-1">5.0</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-neutral-700/30">
                        <div className="font-semibold text-white text-sm">
                          {convertGPA(cumulativeGPA, "4.0", "100")}%
                        </div>
                        <div className="text-white/60 mt-1">%</div>
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
                  <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/30 hover:border-blue-500/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Grade {year.grade}
                        </h3>
                        <p className="text-xs text-white/60 mt-1">
                          {year.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
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
                          className="w-full bg-neutral-700/50 border border-neutral-700 rounded-lg px-3 py-2 text-white text-center text-sm font-medium placeholder-[#FEEBD8]/40 focus:outline-none focus:border-blue-500 focus:bg-neutral-700 transition-all duration-200"
                        />

                        {year.gpa !== null && (
                          <div className="text-xs text-center">
                            <div className="flex justify-between text-white/60 space-x-2">
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
                          <div className="text-xs text-white/60">
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
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <FaTrophy className="text-yellow-400" size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        Exam Scores
                      </h3>
                      <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-white/80">
                        {loading
                          ? "..."
                          : `${exams.length} ${
                              exams.length === 1 ? "exam" : "exams"
                            }`}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">
                      Track your standardized test performance
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAddExamScore}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
                >
                  <FaPlus size={12} />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <FaSpinner className="animate-spin text-white text-xl mx-auto mb-2" />
                    <p className="text-white/60">Loading exam scores...</p>
                  </div>
                ) : exams.length === 0 ? (
                  <div className="text-center py-8">
                    <FaTrophy className="text-white/40 text-3xl mx-auto mb-3" />
                    <p className="text-white/60">No exam scores yet</p>
                    <p className="text-white/40 text-sm">
                      Add your first exam score to get started
                    </p>
                  </div>
                ) : (
                  exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/30 hover:border-blue-500/30 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white text-sm">
                              {exam.name}
                            </h4>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => handleEditExam(exam)}
                                className="p-1.5 rounded-lg bg-blue-600/50 hover:bg-blue-600 text-white transition-colors"
                                title="Edit exam"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteExam(exam.id)}
                                className="p-1.5 rounded-lg bg-red-600/50 hover:bg-red-600 text-white transition-colors"
                                title="Delete exam"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                          <p className="text-white/60 text-xs mt-1">
                            {exam.exam_date
                              ? new Date(
                                  exam.exam_date + "-01"
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                })
                              : "Date not specified"}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-lg font-semibold text-white">
                            {exam.score}/{exam.max_score}
                          </div>
                          <div className="text-xs text-white/60">
                            {getExamProgress(exam).toFixed(0)}%
                          </div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Progress</span>
                          <span>{getExamProgress(exam).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getExamProgress(exam)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/60">Type: {exam.type}</span>
                        {exam.notes && (
                          <span className="text-gray-400 truncate ml-2">
                            {exam.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Academic Events */}
            <div className="bg-[#141414] border border-neutral-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-neutral-800">
                  <FaGraduationCap className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Upcoming Events
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
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
                        <p className="text-white/60 text-sm">
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
                          <p className="text-white/60 text-sm">
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
                          <p className="text-white/60 text-sm">
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
            setShowAddTermModal(false);
          }}
        />
      )}
      {showAddExamScoreModal && (
        <AddExamScoreModal
          isOpen={showAddExamScoreModal}
          examToEdit={editingExam}
          onClose={() => {
            setShowAddExamScoreModal(false);
            setEditingExam(null);
          }}
          onSave={async (examData) => {
            try {
              // Convert the modal data to API format
              const apiExamData = {
                type: examData.testType as any, // Map testType to API type
                name: examData.subject || examData.testType, // Use subject if available, otherwise testType
                score: examData.score.toString(),
                max_score: examData.maxScore.toString(),
                exam_date: examData.testDate, // Already in YYYY-MM format from month input
                notes: examData.notes || undefined,
              };

              if (editingExam) {
                // Update existing exam
                const updatedExam = await academicApi.updateExam(
                  editingExam.id,
                  apiExamData
                );
                setExams((prev) =>
                  prev.map((exam) =>
                    exam.id === editingExam.id ? updatedExam : exam
                  )
                );
              } else {
                // Create new exam
                const newExam = await academicApi.createExam(apiExamData);
                setExams((prev) => [...prev, newExam]);
              }

              setShowAddExamScoreModal(false);
              setEditingExam(null);
            } catch (error) {
              console.error("Failed to save exam:", error);
            }
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
