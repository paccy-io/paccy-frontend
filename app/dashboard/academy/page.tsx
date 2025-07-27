"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddCourseModal from "../../../components/Modals/AddCourseModal";
import AddTermModal from "../../../components/Modals/AddTermModal";
import AddExamScoreModal from "../../../components/Modals/AddExamScoreModal";
import {
  FaArrowLeft,
  FaGraduationCap,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBookOpen,
  FaChartLine,
  FaTrophy,
  FaCalendarAlt,
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
  courses: [
    {
      id: 1,
      name: "AP Calculus BC",
      grade: "A",
      credits: 4,
      term: "Fall 2024",
      type: "AP",
    },
    {
      id: 2,
      name: "AP Chemistry",
      grade: "A-",
      credits: 4,
      term: "Fall 2024",
      type: "AP",
    },
    {
      id: 3,
      name: "AP English Literature",
      grade: "A",
      credits: 3,
      term: "Fall 2024",
      type: "AP",
    },
    {
      id: 4,
      name: "AP World History",
      grade: "B+",
      credits: 3,
      term: "Spring 2024",
      type: "AP",
    },
    {
      id: 5,
      name: "Physics Honors",
      grade: "A",
      credits: 4,
      term: "Spring 2024",
      type: "Honors",
    },
    {
      id: 6,
      name: "Spanish IV",
      grade: "A-",
      credits: 3,
      term: "Fall 2023",
      type: "Regular",
    },
  ],
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

const courseTypeColors: Record<string, string> = {
  AP: "bg-purple-500/20 text-purple-400",
  IB: "bg-blue-500/20 text-blue-400",
  Honors: "bg-green-500/20 text-green-400",
  Regular: "bg-gray-500/20 text-gray-400",
};

export default function AcademyPage() {
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddTermModal, setShowAddTermModal] = useState(false);
  const [showAddExamScoreModal, setShowAddExamScoreModal] = useState(false);

  useEffect(() => {
    document.title = "Academic Tracker | Paccy";
  }, []);

  const handleAddCourse = () => {
    setShowAddCourseModal(true);
  };

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

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/dashboard"
            className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#FEEBD8]">
              Academic Tracker
            </h1>
            <p className="text-[#FEEBD8]/70 mt-2">
              Monitor your academic progress and achievements
            </p>
          </div>
        </div>

        {/* Academic Content */}
        <div className="space-y-6">
          {/* GPA Overview */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#FEEBD8] flex items-center gap-2">
                <FaChartLine className="text-blue-400" />
                GPA Tracker
              </h3>
              <button
                onClick={handleAddTerm}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
              >
                <FaPlus />
                <span>Add Term</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FEEBD8] mb-1">
                  {academicData.gpa.current}
                </div>
                <div className="text-[#FEEBD8]/70 text-sm">Current GPA</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {academicData.gpa.target}
                </div>
                <div className="text-[#FEEBD8]/70 text-sm">Target GPA</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {calculateGPAProgress().toFixed(1)}%
                </div>
                <div className="text-[#FEEBD8]/70 text-sm">Progress</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-[#FEEBD8]/70 mb-2">
                <span>Progress to Target</span>
                <span>{calculateGPAProgress().toFixed(1)}%</span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(calculateGPAProgress(), 100)}%` }}
                />
              </div>
            </div>

            {/* Term History */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-[#FEEBD8]/70 mb-3">
                Recent Terms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {academicData.gpa.terms.map((term, idx) => (
                  <div key={idx} className="bg-neutral-800 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#FEEBD8] font-medium">
                        {term.term}
                      </span>
                      <span className="text-green-400 font-semibold">
                        {term.gpa}
                      </span>
                    </div>
                    <div className="text-[#FEEBD8]/60 text-sm">
                      {term.courses} courses
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#FEEBD8] flex items-center gap-2">
                <FaBookOpen className="text-purple-400" />
                Course List
              </h3>
              <button
                onClick={handleAddCourse}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
              >
                <FaPlus />
                <span>Add Course</span>
              </button>
            </div>

            <div className="space-y-3">
              {academicData.courses.map((course) => (
                <div key={course.id} className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-[#FEEBD8] font-medium">
                          {course.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            courseTypeColors[course.type]
                          }`}
                        >
                          {course.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#FEEBD8]/70">
                        <span>{course.term}</span>
                        <span>{course.credits} credits</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-lg font-semibold ${
                          gradeColors[course.grade]
                        }`}
                      >
                        {course.grade}
                      </span>
                      <div className="flex gap-2">
                        <button className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors">
                          <FaEdit />
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Scores */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#FEEBD8] flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                Exam Scores
              </h3>
              <button
                onClick={handleAddExamScore}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
              >
                <FaPlus />
                <span>Add Score</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {academicData.exams.map((exam) => (
                <div key={exam.id} className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-[#FEEBD8] font-medium">
                        {exam.name}
                      </h4>
                      <p className="text-[#FEEBD8]/60 text-sm">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-green-400">
                      {exam.score}/{exam.maxScore}
                    </span>
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
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(getExamProgress(exam), 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-[#FEEBD8]/60">
                      Attempt {exam.attempts} • Target: {exam.target}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Goals */}
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#FEEBD8] flex items-center gap-2 mb-4">
              <FaStar className="text-yellow-400" />
              Academic Goals & Motivation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-800 rounded-lg p-4">
                <h4 className="text-[#FEEBD8] font-medium mb-3">
                  Upcoming Deadlines
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FEEBD8]/70 text-sm">
                      SAT Registration
                    </span>
                    <span className="text-red-400 text-sm">3 days left</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#FEEBD8]/70 text-sm">
                      AP Exam Registration
                    </span>
                    <span className="text-yellow-400 text-sm">
                      2 weeks left
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#FEEBD8]/70 text-sm">
                      Final Exams
                    </span>
                    <span className="text-green-400 text-sm">1 month left</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4">
                <h4 className="text-[#FEEBD8] font-medium mb-3">
                  Motivational Reminders
                </h4>
                <div className="space-y-2">
                  <p className="text-[#FEEBD8]/70 text-sm">
                    🎯 You're only 0.1 points away from your target GPA!
                  </p>
                  <p className="text-[#FEEBD8]/70 text-sm">
                    📚 Your AP courses show strong academic rigor.
                  </p>
                  <p className="text-[#FEEBD8]/70 text-sm">
                    ⭐ Consistent improvement across all terms!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {showAddCourseModal && (
        <AddCourseModal
          isOpen={showAddCourseModal}
          onClose={() => setShowAddCourseModal(false)}
          onSave={(data) => {
            console.log("Course data:", data);
            setShowAddCourseModal(false);
          }}
        />
      )}

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
