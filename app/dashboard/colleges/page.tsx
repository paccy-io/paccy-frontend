"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
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
  FaUniversity,
  FaGraduationCap,
  FaChevronRight,
  FaTasks,
  FaBell,
  FaChartLine,
} from "react-icons/fa";

// Types
interface University {
  name: string;
  domains: string[];
  web_pages: string[];
  country: string;
  alpha_two_code: string;
  "state-province": string | null;
}

interface College {
  id: string;
  universityName: string;
  universityCountry: string;
  universityState: string | null;
  universityWebsite: string;
  status: string;
  deadline: string;
  type: string;
  notes: string;
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data for colleges
const mockColleges: College[] = [
  {
    id: "1",
    universityName: "Harvard University",
    universityCountry: "United States",
    universityState: "Massachusetts",
    universityWebsite: "https://harvard.edu",
    status: "In Progress",
    deadline: "2026-01-01",
    type: "RD",
    notes: "Need to finish personal statement",
    tags: ["Ivy League", "Reach"],
    progress: 65,
    createdAt: "2024-09-15",
    updatedAt: "2024-12-01",
  },
  {
    id: "2",
    universityName: "Stanford University",
    universityCountry: "United States",
    universityState: "California",
    universityWebsite: "https://stanford.edu",
    status: "Ready to Submit",
    deadline: "2025-12-15",
    type: "EA",
    notes: "All materials ready for submission",
    tags: ["Reach", "Tech"],
    progress: 95,
    createdAt: "2024-08-20",
    updatedAt: "2024-11-28",
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
  ED: "bg-purple-500",
  EA: "bg-blue-500",
  RD: "bg-gray-500",
};

export default function CollegeTracker() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>(mockColleges);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [showAddCollegeForm, setShowAddCollegeForm] = useState(false);

  // University search states
  const [universitySearch, setUniversitySearch] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<
    University[]
  >([]);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [customUniversityName, setCustomUniversityName] = useState("");
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);

  useEffect(() => {
    document.title = "College Applications | Paccy";
  }, []);

  // Fetch universities data
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setIsLoadingUniversities(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json"
        );
        const data: University[] = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      } finally {
        setIsLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, []);

  // Filter universities based on search
  useEffect(() => {
    if (universitySearch && universities.length > 0 && !selectedUniversity) {
      const filtered = universities
        .filter((uni) =>
          uni.name.toLowerCase().includes(universitySearch.toLowerCase())
        )
        .slice(0, 10); // Limit to 10 results for performance
      setFilteredUniversities(filtered);
      setShowUniversityDropdown(true);
    } else {
      setFilteredUniversities([]);
      setShowUniversityDropdown(false);
    }
  }, [universitySearch, universities, selectedUniversity]);

  const filteredCollegesMain = colleges.filter((college) => {
    const matchesSearch =
      college.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (college.universityState &&
        college.universityState
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      college.universityCountry
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || college.status === filterStatus;
    const matchesType = filterType === "All" || college.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setUniversitySearch(university.name);
    setShowUniversityDropdown(false);
    setCustomUniversityName("");
  };

  const handleCustomUniversityToggle = () => {
    setSelectedUniversity(null);
    setUniversitySearch("");
    setShowUniversityDropdown(false);
  };

  const handleCreateApplication = () => {
    if (!selectedUniversity && !customUniversityName.trim()) {
      alert("Please select a university or enter a custom university name.");
      return;
    }

    const newCollege: College = {
      id: Date.now().toString(),
      universityName: selectedUniversity
        ? selectedUniversity.name
        : customUniversityName,
      universityCountry: selectedUniversity
        ? selectedUniversity.country
        : "Unknown",
      universityState: selectedUniversity
        ? selectedUniversity["state-province"]
        : null,
      universityWebsite: selectedUniversity
        ? selectedUniversity.web_pages[0] || ""
        : "",
      status: "Researching",
      deadline: "",
      type: "RD",
      notes: "",
      tags: [],
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setColleges((prev) => [...prev, newCollege]);
    setShowAddCollegeForm(false);

    // Navigate to the college detail page with university data
    if (selectedUniversity) {
      const universityParam = encodeURIComponent(
        JSON.stringify(selectedUniversity)
      );
      router.push(
        `/dashboard/colleges/${newCollege.id}?university=${universityParam}`
      );
    } else {
      router.push(`/dashboard/colleges/${newCollege.id}`);
    }
  };

  const getDaysUntilDeadlineMain = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadlineMain = (deadline: string) => {
    if (!deadline) return "No deadline set";
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCollegeClick = (collegeId: string) => {
    router.push(`/dashboard/colleges/${collegeId}`);
  };

  if (showAddCollegeForm) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />

        <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-8 pt-28">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => setShowAddCollegeForm(false)}
              className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[#FEEBD8]">
                Add College Application
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2">
                Search for your university or add a custom one
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-8">
              <div className="space-y-6">
                {/* University Search */}
                <div>
                  <label className="block text-lg font-medium text-[#FEEBD8] mb-4">
                    Find Your University
                  </label>

                  <div className="relative">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FEEBD8]/50" />
                      <input
                        type="text"
                        placeholder="Search for universities worldwide..."
                        value={universitySearch}
                        onChange={(e) => setUniversitySearch(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-12 pr-4 py-4 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] text-lg"
                        disabled={isLoadingUniversities}
                      />
                      {isLoadingUniversities && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FEEBD8]"></div>
                        </div>
                      )}
                    </div>

                    {/* University Dropdown */}
                    {showUniversityDropdown &&
                      filteredUniversities.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                          {filteredUniversities.map((university, index) => (
                            <button
                              key={index}
                              onClick={() => handleUniversitySelect(university)}
                              className="w-full text-left px-4 py-3 hover:bg-neutral-700 transition-colors border-b border-neutral-700 last:border-b-0"
                            >
                              <div className="text-[#FEEBD8] font-medium">
                                {university.name}
                              </div>
                              <div className="text-[#FEEBD8]/60 text-sm">
                                {university["state-province"] &&
                                  `${university["state-province"]}, `}
                                {university.country}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {selectedUniversity && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FaUniversity className="text-green-400" />
                        <div>
                          <div className="text-[#FEEBD8] font-medium">
                            {selectedUniversity.name}
                          </div>
                          <div className="text-[#FEEBD8]/70 text-sm">
                            {selectedUniversity["state-province"] &&
                              `${selectedUniversity["state-province"]}, `}
                            {selectedUniversity.country}
                          </div>
                          {selectedUniversity.web_pages[0] && (
                            <a
                              href={selectedUniversity.web_pages[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 text-sm hover:underline"
                            >
                              {selectedUniversity.web_pages[0]}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom University Option */}
                <div className="text-center">
                  <div className="text-[#FEEBD8]/50 text-sm mb-4">or</div>

                  <button
                    onClick={handleCustomUniversityToggle}
                    className="text-[#FEEBD8] hover:text-[#E5D5B7] transition-colors text-sm underline"
                  >
                    Can't find your university? Add it manually
                  </button>
                </div>

                {!selectedUniversity && (
                  <div>
                    <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      Custom University Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter university name..."
                      value={customUniversityName}
                      onChange={(e) => setCustomUniversityName(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setShowAddCollegeForm(false)}
                    className="flex-1 bg-neutral-700 text-[#FEEBD8] px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateApplication}
                    disabled={
                      !selectedUniversity && !customUniversityName.trim()
                    }
                    className="flex-1 bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

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
                College Applications
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2">
                Manage your university applications with comprehensive tracking
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCollegeForm(true)}
            className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Application</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {colleges.length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Total Applications</div>
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
                  const days = getDaysUntilDeadlineMain(c.deadline);
                  return days !== null && days <= 30 && days > 0;
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
                placeholder="Search applications by university name, location..."
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

        {/* Applications Grid */}
        <div className="grid gap-6">
          {filteredCollegesMain.map((college) => {
            const daysUntil = getDaysUntilDeadlineMain(college.deadline);
            const isUrgent =
              daysUntil !== null && daysUntil <= 7 && daysUntil > 0;

            return (
              <div
                key={college.id}
                onClick={() => handleCollegeClick(college.id)}
                className={`bg-[#141414] border rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors cursor-pointer ${
                  isUrgent ? "border-red-500/50" : "border-neutral-700/50"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-[#FEEBD8]">
                          {college.universityName}
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
                      <FaChevronRight className="text-[#FEEBD8]/30" />
                    </div>

                    <p className="text-[#FEEBD8]/70 text-sm mb-2">
                      {college.universityState &&
                        `${college.universityState}, `}
                      {college.universityCountry}
                    </p>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-[#FEEBD8]/70">
                        <FaCalendar />
                        <span>Due: {formatDeadlineMain(college.deadline)}</span>
                        {daysUntil !== null && daysUntil > 0 && (
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

                  <div className="flex items-center gap-4 text-[#FEEBD8]/50">
                    <div className="flex items-center gap-2">
                      <FaTasks size={16} />
                      <span className="text-sm">Checklists</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBell size={16} />
                      <span className="text-sm">Reminders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaChartLine size={16} />
                      <span className="text-sm">Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCollegesMain.length === 0 && (
          <div className="text-center py-12">
            {colleges.length === 0 ? (
              <div className="max-w-md mx-auto">
                <FaUniversity className="mx-auto text-[#FEEBD8]/30 text-6xl mb-6" />
                <h3 className="text-xl font-semibold text-[#FEEBD8] mb-3">
                  No College Applications Yet
                </h3>
                <p className="text-[#FEEBD8]/70 mb-6">
                  Start your college application journey by adding your first
                  university.
                </p>
                <button
                  onClick={() => setShowAddCollegeForm(true)}
                  className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
                >
                  Add Your First Application
                </button>
              </div>
            ) : (
              <p className="text-[#FEEBD8]/50 text-lg">
                No applications found matching your criteria.
              </p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
