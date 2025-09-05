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
      name: "AP Chemistry",
      score: 4,
      maxScore: 5,
      date: "2024-05-12",
      target: 5,
      attempts: 1,
    },
  ],
};

const gradeColors: Record<string, string> = {
  A: "text-green-400",
  "A-": "text-green-300",
  "B+": "text-yellow-400",
  B: "text-yellow-300",
  "B-": "text-orange-400",
  "C+": "text-orange-300",
  C: "text-red-400",
};

export default function AcademyPage() {
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [showAddExamScoreModal, setShowAddExamScoreModal] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);

  // Helper functions to process calendar events
  const getTestDateEvents = () => {
    return calendarEvents.filter(
      (event) => event.type === EventType.TEST_DATE && event.date
    );
  };

  const getFinalExamDate = () => {
    const testEvents = getTestDateEvents();
    if (testEvents.length === 0) return null;

    // Filter out SAT, AP, IB events - only get generic final exams
    // Also filter out past dates
    const finalExamEvents = testEvents.filter((event) => {
      const title = event.title.toLowerCase();
      const eventDate = new Date(event.date!);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates

      return (
        !title.includes("sat") &&
        !title.includes("ap") &&
        !title.includes("ib") &&
        eventDate >= today
      ); // Only future or today's events
    });

    if (finalExamEvents.length === 0) return null;

    // Find the earliest upcoming final exam
    const sortedByDate = finalExamEvents.sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
    );

    return sortedByDate[0];
  };

  const getSATExamDate = () => {
    const testEvents = getTestDateEvents();
    const satEvents = testEvents.filter((event) => {
      const title = event.title.toLowerCase();
      const eventDate = new Date(event.date!);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return title.includes("sat") && eventDate >= today; // Only future or today's events
    });

    if (satEvents.length === 0) return null;

    // Get the earliest future SAT date
    const futureSATs = satEvents.sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
    );

    return futureSATs[0];
  };

  const getAPExamDates = () => {
    const testEvents = getTestDateEvents();
    const apEvents = testEvents.filter((event) => {
      const title = event.title.toLowerCase();
      const eventDate = new Date(event.date!);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return title.includes("ap") && eventDate >= today; // Only future or today's events
    });

    if (apEvents.length === 0) return [];

    // Return all future AP exams, sorted by date (earliest first)
    return apEvents.sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
    );
  };

  const getIBExamDate = () => {
    const testEvents = getTestDateEvents();
    const ibEvents = testEvents.filter((event) => {
      const title = event.title.toLowerCase();
      const eventDate = new Date(event.date!);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return title.includes("ib") && eventDate >= today; // Only future or today's events
    });

    if (ibEvents.length === 0) return null;

    // Get the earliest future IB date
    const futureIBs = ibEvents.sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
    );

    return futureIBs[0];
  };

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatTimeLeft = (days: number) => {
    if (days < 0) return "Past due";
    if (days === 0) return "Today";
    if (days === 1) return "1 day left";
    if (days < 7) return `${days} days left`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks left`;
    return `${Math.ceil(days / 30)} months left`;
  };

  const getTimeLeftColor = (days: number) => {
    if (days < 0) return "text-gray-400";
    if (days <= 3) return "text-red-400";
    if (days <= 14) return "text-yellow-400";
    return "text-green-400";
  };

  // Load calendar events
  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        setCalendarLoading(true);
        const events = await calendarApi.getAll();
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to load calendar events:", error);
        setCalendarEvents([]);
      } finally {
        setCalendarLoading(false);
      }
    };

    loadCalendarEvents();
  }, []);

  useEffect(() => {
    document.title = "Academic Tracker | Paccy";
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
  const finalExamDate = getFinalExamDate();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-12">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 transition-colors"
          >
            <FaArrowLeft
              className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
              size={16}
            />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700">
                <FaGraduationCap className="text-[#FEEBD8]" size={20} />
              </div>
              <h1 className="text-3xl font-bold text-[#FEEBD8]">
                Academic Tracker
              </h1>
            </div>
            <p className="text-[#FEEBD8]/60 ml-12">
              Monitor your academic progress and achievements
            </p>
          </div>
        </div>

        {/* Academic Content */}
        <div className="space-y-8">
          {/* GPA Overview */}
          <div className="bg-[#141414] border border-neutral-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-800">
                  <FaChartLine className="text-[#FEEBD8]" size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#FEEBD8]">
                    GPA Tracker
                  </h3>
                  <p className="text-[#FEEBD8]/60 text-sm mt-1">
                    Track your cumulative GPA progress toward your target goals
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddTerm}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
              >
                <FaPlus size={14} />
                <span>Add Term</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
                <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
                  {academicData.gpa.current}
                </div>
                <div className="text-[#FEEBD8]/70 text-sm">Current GPA</div>
              </div>

              <div className="text-center p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {academicData.gpa.target}
                </div>
                <div className="text-[#FEEBD8]/70 text-sm">Target GPA</div>
              </div>

              <div className="text-center p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {calculateGPAProgress().toFixed(1)}%
                </div>
                <div className="text-[#FEEBD8]/70 text-sm">Progress</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-[#FEEBD8]/70 mb-2">
                <span>Progress to Target</span>
                <span>{calculateGPAProgress().toFixed(1)}%</span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(calculateGPAProgress(), 100)}%` }}
                />
              </div>
            </div>

            {/* Term History */}
            <div>
              <h4 className="text-sm font-medium text-[#FEEBD8]/70 mb-3">
                Recent Terms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {academicData.gpa.terms.map((term, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-800 rounded-lg p-3 border border-neutral-700"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#FEEBD8] font-medium">
                        {term.term}
                      </span>
                      <span className="text-green-400 font-semibold">
                        {term.gpa}
                      </span>
                    </div>
                    <div className="text-[#FEEBD8]/60 text-sm">
                      {term.courses} courses completed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exam Scores */}
          <div className="bg-[#141414] border border-neutral-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-800">
                  <FaTrophy className="text-[#FEEBD8]" size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#FEEBD8]">
                    Exam Scores
                  </h3>
                  <p className="text-[#FEEBD8]/60 text-sm mt-1">
                    Record and track standardized test scores and AP exam
                    results
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddExamScore}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
              >
                <FaPlus size={14} />
                <span>Add Score</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academicData.exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-[#FEEBD8] font-medium text-lg mb-1">
                        {exam.name}
                      </h4>
                      <p className="text-[#FEEBD8]/60 text-sm">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">
                        {exam.score}
                      </span>
                      <span className="text-[#FEEBD8]/60">
                        /{exam.maxScore}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#FEEBD8]/70">
                        Progress to Target ({exam.target})
                      </span>
                      <span className="text-[#FEEBD8]/70">
                        {getExamProgress(exam).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(getExamProgress(exam), 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <div className="text-xs text-[#FEEBD8]/60">
                        Attempt {exam.attempts} • Target: {exam.target}
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 rounded bg-neutral-700 text-[#FEEBD8]/60 hover:text-[#FEEBD8] hover:bg-neutral-600 transition-colors">
                          <FaEdit size={12} />
                        </button>
                        <button className="p-1 rounded bg-neutral-700 text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Goals */}
          <div className="bg-[#141414] border border-neutral-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-neutral-800">
                <FaStar className="text-[#FEEBD8]" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FEEBD8]">
                  Academic Goals & Motivation
                </h3>
                <p className="text-[#FEEBD8]/60 text-sm mt-1">
                  Stay motivated with upcoming deadlines and achievement
                  reminders
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <h4 className="text-[#FEEBD8] font-medium mb-3">
                  Upcoming Deadlines
                </h4>
                <div className="space-y-2">
                  {calendarLoading ? (
                    <div className="flex items-center gap-2 text-[#FEEBD8]/70 text-sm">
                      <div className="w-4 h-4 border-2 border-[#FEEBD8]/30 border-t-[#FEEBD8] rounded-full animate-spin"></div>
                      Loading deadlines...
                    </div>
                  ) : (
                    <>
                      {/* SAT Registration */}
                      {satExamDate && (
                        <div className="flex justify-between items-center p-2 rounded bg-neutral-700/50">
                          <span className="text-[#FEEBD8]/90 text-sm">
                            {satExamDate.title}
                          </span>
                          <span
                            className={`text-sm font-medium ${getTimeLeftColor(
                              getDaysUntil(satExamDate.date!)
                            )}`}
                          >
                            {formatTimeLeft(getDaysUntil(satExamDate.date!))}
                          </span>
                        </div>
                      )}

                      {/* AP Exam Registration - Multiple APs allowed */}
                      {apExamDates.map((apExam, index) => (
                        <div
                          key={`ap-${index}`}
                          className="flex justify-between items-center p-2 rounded bg-neutral-700/50"
                        >
                          <span className="text-[#FEEBD8]/90 text-sm">
                            {apExam.title}
                          </span>
                          <span
                            className={`text-sm font-medium ${getTimeLeftColor(
                              getDaysUntil(apExam.date!)
                            )}`}
                          >
                            {formatTimeLeft(getDaysUntil(apExam.date!))}
                          </span>
                        </div>
                      ))}

                      {/* IB Exam Registration */}
                      {ibExamDate && (
                        <div className="flex justify-between items-center p-2 rounded bg-neutral-700/50">
                          <span className="text-[#FEEBD8]/90 text-sm">
                            {ibExamDate.title}
                          </span>
                          <span
                            className={`text-sm font-medium ${getTimeLeftColor(
                              getDaysUntil(ibExamDate.date!)
                            )}`}
                          >
                            {formatTimeLeft(getDaysUntil(ibExamDate.date!))}
                          </span>
                        </div>
                      )}

                      {/* Final Exams */}
                      {finalExamDate && (
                        <div className="flex justify-between items-center p-2 rounded bg-neutral-700/50">
                          <span className="text-[#FEEBD8]/90 text-sm">
                            Final Exam: {finalExamDate.title}
                          </span>
                          <span
                            className={`text-sm font-medium ${getTimeLeftColor(
                              getDaysUntil(finalExamDate.date!)
                            )}`}
                          >
                            {formatTimeLeft(getDaysUntil(finalExamDate.date!))}
                          </span>
                        </div>
                      )}

                      {/* No deadlines message */}
                      {!calendarLoading &&
                        !satExamDate &&
                        apExamDates.length === 0 &&
                        !ibExamDate &&
                        !finalExamDate && (
                          <div className="text-center py-4">
                            <div className="text-[#FEEBD8]/50 text-sm">
                              No upcoming test dates found. Add them to your
                              calendar to track deadlines.
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <h4 className="text-[#FEEBD8] font-medium mb-3">
                  Motivational Reminders
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-2 rounded bg-neutral-700/50">
                    <div className="text-base">🎯</div>
                    <p className="text-[#FEEBD8]/90 text-sm">
                      You're only 0.1 points away from your target GPA!
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-neutral-700/50">
                    <div className="text-base">📚</div>
                    <p className="text-[#FEEBD8]/90 text-sm">
                      Your AP courses show strong academic rigor.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded bg-neutral-700/50">
                    <div className="text-base">⭐</div>
                    <p className="text-[#FEEBD8]/90 text-sm">
                      Consistent improvement across all terms!
                    </p>
                  </div>
                </div>
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
          onSave={(data) => {
            console.log("Term data:", data);
            setShowAddTermModal(false);
          }}
        />
      )}

      {showAddExamScoreModal && (
        <AddExamScoreModal
          isOpen={showAddExamScoreModal}
          onClose={() => setShowAddExamScoreModal(false)}
          onSave={(data) => {
            console.log("Exam score data:", data);
            setShowAddExamScoreModal(false);
          }}
        />
      )}
    </div>
  );
}
