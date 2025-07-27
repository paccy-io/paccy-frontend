"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddCollegeModal from "../../../components/Modals/AddCollegeModal";
import EditCollegeModal from "../../../components/Modals/EditCollegeModal";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";

// Mock data for colleges
const mockColleges = [
  {
    id: 1,
    name: "Harvard University",
    status: "In Progress",
    deadline: "2026-01-01",
    type: "RD", // Regular Decision
    location: "Cambridge, MA",
    notes: "Need to finish personal statement",
    tags: ["Ivy League", "Reach"],
    progress: 65,
    requirements: {
      essay: "In Progress",
      transcript: "Complete",
      recommendations: "Pending",
      testScores: "Complete",
    },
  },
  {
    id: 2,
    name: "Stanford University",
    status: "Ready to Submit",
    deadline: "2025-12-15",
    type: "EA", // Early Action
    location: "Stanford, CA",
    notes: "All materials ready for submission",
    tags: ["Reach", "Tech"],
    progress: 95,
    requirements: {
      essay: "Complete",
      transcript: "Complete",
      recommendations: "Complete",
      testScores: "Complete",
    },
  },
  {
    id: 3,
    name: "University of Michigan",
    status: "Submitted",
    deadline: "2026-02-01",
    type: "RD",
    location: "Ann Arbor, MI",
    notes: "Application submitted successfully",
    tags: ["Match", "Public"],
    progress: 100,
    requirements: {
      essay: "Complete",
      transcript: "Complete",
      recommendations: "Complete",
      testScores: "Complete",
    },
  },
  {
    id: 4,
    name: "New York University",
    status: "Researching",
    deadline: "2026-01-15",
    type: "ED", // Early Decision
    location: "New York, NY",
    notes: "Still researching programs and requirements",
    tags: ["Match", "Urban"],
    progress: 25,
    requirements: {
      essay: "Not Started",
      transcript: "Complete",
      recommendations: "Not Started",
      testScores: "Complete",
    },
  },
];

const statusColors: Record<string, string> = {
  Researching: "bg-gray-500",
  "In Progress": "bg-yellow-500",
  "Ready to Submit": "bg-blue-500",
  Submitted: "bg-green-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-red-500",
  Waitlisted: "bg-orange-500",
};

const typeColors: Record<string, string> = {
  ED: "bg-purple-500", // Early Decision
  EA: "bg-blue-500", // Early Action
  RD: "bg-gray-500", // Regular Decision
};

export default function CollegeTracker() {
  const router = useRouter();
  const [colleges, setColleges] = useState(mockColleges);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [isAddCollegeModalOpen, setIsAddCollegeModalOpen] = useState(false);
  const [isEditCollegeModalOpen, setIsEditCollegeModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  useEffect(() => {
    document.title = "College Tracker | Paccy";
  }, []);

  const filteredColleges = colleges.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || college.status === filterStatus;
    const matchesType = filterType === "All" || college.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
      case "Accepted":
        return <FaCheckCircle />;
      case "Rejected":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddCollege = (newCollege: any) => {
    const collegeWithId = {
      ...newCollege,
      id: colleges.length + 1,
      progress: 10, // Default progress
      requirements: {
        essay: "Not Started",
        transcript: "Not Started",
        recommendations: "Not Started",
        testScores: "Not Started",
      },
    };
    setColleges((prev) => [...prev, collegeWithId]);
  };

  const handleEditCollege = (updatedCollege: any) => {
    setColleges((prev) =>
      prev.map((college) =>
        college.id === updatedCollege.id ? updatedCollege : college
      )
    );
    setSelectedCollege(null);
  };

  const handleEditClick = (college: any) => {
    setSelectedCollege(college);
    setIsEditCollegeModalOpen(true);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
                College Tracker
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2">
                Manage your university applications
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddCollegeModalOpen(true)}
            className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add College</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {colleges.length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Total Colleges</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {colleges.filter((c) => c.status === "Submitted").length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Submitted</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {colleges.filter((c) => c.status === "In Progress").length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">In Progress</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {
                colleges.filter((c) => {
                  const days = getDaysUntilDeadline(c.deadline);
                  return days <= 30 && days > 0;
                }).length
              }
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Due Soon</div>
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
                placeholder="Search colleges by name or location..."
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
              <option value="Researching">Researching</option>
              <option value="In Progress">In Progress</option>
              <option value="Ready to Submit">Ready to Submit</option>
              <option value="Submitted">Submitted</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Waitlisted">Waitlisted</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="All">All Types</option>
              <option value="ED">Early Decision</option>
              <option value="EA">Early Action</option>
              <option value="RD">Regular Decision</option>
            </select>
          </div>
        </div>

        {/* Colleges Grid */}
        <div className="grid gap-6">
          {filteredColleges.map((college) => {
            const daysUntil = getDaysUntilDeadline(college.deadline);
            const isUrgent = daysUntil <= 7 && daysUntil > 0;

            return (
              <div
                key={college.id}
                className={`bg-[#141414] border rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors ${
                  isUrgent ? "border-red-500/50" : "border-neutral-700/50"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[#FEEBD8]">
                        {college.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${
                          statusColors[college.status]
                        }`}
                      >
                        {college.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${
                          typeColors[college.type]
                        }`}
                      >
                        {college.type}
                      </span>
                    </div>

                    <p className="text-[#FEEBD8]/70 text-sm mb-2">
                      {college.location}
                    </p>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-[#FEEBD8]/70">
                        <FaCalendar />
                        <span>Due: {formatDeadline(college.deadline)}</span>
                        {daysUntil > 0 && (
                          <span
                            className={`${
                              isUrgent ? "text-red-400" : "text-yellow-400"
                            }`}
                          >
                            ({daysUntil} days)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-[#FEEBD8]/70 mb-1">
                        <span>Progress</span>
                        <span>{college.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${college.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {college.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-neutral-800 text-[#FEEBD8]/70 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {college.notes && (
                      <p className="text-[#FEEBD8]/60 text-sm italic">
                        {college.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => handleEditClick(college)}
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
            );
          })}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#FEEBD8]/50 text-lg">
              No colleges found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <AddCollegeModal
        isOpen={isAddCollegeModalOpen}
        onClose={() => setIsAddCollegeModalOpen(false)}
        onSave={handleAddCollege}
      />

      <EditCollegeModal
        isOpen={isEditCollegeModalOpen}
        onClose={() => setIsEditCollegeModalOpen(false)}
        onSave={handleEditCollege}
        college={selectedCollege}
      />
    </div>
  );
}
