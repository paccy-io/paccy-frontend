"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddEssayModal from "../../../components/Modals/AddEssayModal";
import EditEssayModal from "../../../components/Modals/EditEssayModal";
import PreviewEssayModal from "../../../components/Modals/PreviewEssayModal";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

// Mock data for essays
const mockEssays = [
  {
    id: 1,
    title: "Personal Statement",
    college: "Harvard University",
    prompt:
      "Harvard has long recognized the importance of enrolling a diverse student body. How will the life experiences that shape who you are today enable you to contribute to Harvard?",
    status: "In Progress",
    wordCount: 487,
    maxWords: 650,
    lastModified: "2025-07-25",
    aiScore: 7.5,
    feedback: "Strong opening, but needs more specific examples",
  },
  {
    id: 2,
    title: "Why Stanford?",
    college: "Stanford University",
    prompt:
      "The Stanford community is deeply curious and driven to learn in and out of the classroom. Reflect on an idea or experience that makes you genuinely excited about learning.",
    status: "Complete",
    wordCount: 248,
    maxWords: 250,
    lastModified: "2025-07-24",
    aiScore: 8.2,
    feedback: "Excellent structure and compelling narrative",
  },
  {
    id: 3,
    title: "Diversity Essay",
    college: "University of Michigan",
    prompt:
      "Describe the unique qualities that attract you to the specific undergraduate College or School to which you are applying at the University of Michigan.",
    status: "Not Started",
    wordCount: 0,
    maxWords: 550,
    lastModified: null,
    aiScore: null,
    feedback: null,
  },
  {
    id: 4,
    title: "Common App Essay",
    college: "Multiple Colleges",
    prompt:
      "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.",
    status: "Review Needed",
    wordCount: 642,
    maxWords: 650,
    lastModified: "2025-07-23",
    aiScore: 6.8,
    feedback: "Consider strengthening the conclusion",
  },
];

const statusColors: Record<string, string> = {
  "Not Started": "bg-gray-500",
  "In Progress": "bg-yellow-500",
  Complete: "bg-green-500",
  "Review Needed": "bg-orange-500",
  "Needs Revision": "bg-red-500",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Complete":
      return <FaCheckCircle className="text-green-400" />;
    case "Review Needed":
    case "Needs Revision":
      return <FaExclamationTriangle className="text-orange-400" />;
    case "In Progress":
      return <FaClock className="text-yellow-400" />;
    default:
      return <FaClock className="text-gray-400" />;
  }
};

export default function EssayManager() {
  const [essays, setEssays] = useState(mockEssays);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCollege, setFilterCollege] = useState("All");
  const [isAddEssayModalOpen, setIsAddEssayModalOpen] = useState(false);
  const [isEditEssayModalOpen, setIsEditEssayModalOpen] = useState(false);
  const [isPreviewEssayModalOpen, setIsPreviewEssayModalOpen] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState<any>(null);

  useEffect(() => {
    document.title = "Essay Manager | Paccy";
  }, []);

  const filteredEssays = essays.filter((essay) => {
    const matchesSearch =
      essay.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      essay.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || essay.status === filterStatus;
    const matchesCollege =
      filterCollege === "All" || essay.college === filterCollege;

    return matchesSearch && matchesStatus && matchesCollege;
  });

  const getWordCountColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 95) return "text-red-400";
    if (percentage >= 80) return "text-yellow-400";
    return "text-green-400";
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const colleges = Array.from(new Set(essays.map((essay) => essay.college)));

  const handleAddEssay = (newEssay: any) => {
    const essayWithId = {
      ...newEssay,
      id: essays.length + 1,
      lastModified: new Date().toISOString().split("T")[0],
      wordCount: 0,
      aiScore: null,
      feedback: null,
    };
    setEssays((prev) => [...prev, essayWithId]);
  };

  const handleEditEssay = (updatedEssay: any) => {
    setEssays((prev) =>
      prev.map((essay) => (essay.id === updatedEssay.id ? updatedEssay : essay))
    );
    setSelectedEssay(null);
  };

  const handleEditClick = (essay: any) => {
    setSelectedEssay(essay);
    setIsEditEssayModalOpen(true);
  };

  const handlePreviewClick = (essay: any) => {
    setSelectedEssay(essay);
    setIsPreviewEssayModalOpen(true);
  };

  const handlePreviewEdit = () => {
    setIsPreviewEssayModalOpen(false);
    setIsEditEssayModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-[#FEEBD8]">
                Essay Manager
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2">
                Write and organize your application essays
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddEssayModalOpen(true)}
            className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>New Essay</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {essays.length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Total Essays</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {essays.filter((e) => e.status === "Complete").length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Complete</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {essays.filter((e) => e.status === "In Progress").length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">In Progress</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {essays.filter((e) => e.status === "Review Needed").length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Need Review</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FEEBD8]/50" />
              <input
                type="text"
                placeholder="Search essays by title or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Review Needed">Review Needed</option>
              <option value="Needs Revision">Needs Revision</option>
            </select>

            {/* College Filter */}
            <select
              value={filterCollege}
              onChange={(e) => setFilterCollege(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="All">All Colleges</option>
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Essays Grid */}
        <div className="grid gap-6">
          {filteredEssays.map((essay) => (
            <div
              key={essay.id}
              className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[#FEEBD8]">
                      {essay.title}
                    </h3>
                    {getStatusIcon(essay.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${
                        statusColors[essay.status]
                      }`}
                    >
                      {essay.status}
                    </span>
                  </div>

                  <p className="text-[#FEEBD8]/70 text-sm mb-3">
                    {essay.college}
                  </p>

                  <div className="bg-neutral-800/50 rounded-lg p-3 mb-4">
                    <p className="text-[#FEEBD8]/80 text-sm italic">
                      "{essay.prompt.substring(0, 120)}..."
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3">
                    {/* Word Count */}
                    <div className="text-sm">
                      <span className="text-[#FEEBD8]/70">Word Count: </span>
                      <span
                        className={getWordCountColor(
                          essay.wordCount,
                          essay.maxWords
                        )}
                      >
                        {essay.wordCount}/{essay.maxWords}
                      </span>
                    </div>

                    {/* AI Score */}
                    {essay.aiScore && (
                      <div className="text-sm">
                        <span className="text-[#FEEBD8]/70">AI Score: </span>
                        <span className={getAIScoreColor(essay.aiScore)}>
                          {essay.aiScore}/10
                        </span>
                      </div>
                    )}

                    {/* Last Modified */}
                    {essay.lastModified && (
                      <div className="text-sm text-[#FEEBD8]/70">
                        Last modified:{" "}
                        {new Date(essay.lastModified).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* AI Feedback */}
                  {essay.feedback && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        <strong>AI Feedback:</strong> {essay.feedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => handleEditClick(essay)}
                    className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handlePreviewClick(essay)}
                    className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                  >
                    <FaEye />
                    <span>Preview</span>
                  </button>
                  <button className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2">
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEssays.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#FEEBD8]/50 text-lg">
              No essays found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <AddEssayModal
        isOpen={isAddEssayModalOpen}
        onClose={() => setIsAddEssayModalOpen(false)}
        onSave={handleAddEssay}
      />

      <EditEssayModal
        isOpen={isEditEssayModalOpen}
        onClose={() => setIsEditEssayModalOpen(false)}
        onSave={handleEditEssay}
        essay={selectedEssay}
      />

      <PreviewEssayModal
        isOpen={isPreviewEssayModalOpen}
        onClose={() => setIsPreviewEssayModalOpen(false)}
        onEdit={handlePreviewEdit}
        essay={selectedEssay}
      />
    </div>
  );
}
