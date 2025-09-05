"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { COLLEGE_MAJORS, POPULAR_MAJORS } from "../../../lib/majors";
import { api, ApiError } from "../../../lib/api/college-applications";
import DatePicker from "../../../components/DatePicker";
import {
  CollegeApplication,
  Status,
  ApplicationType,
  Priority,
  Category,
} from "../../../lib/types";
import { useToast } from "../../../lib/hooks/useToast";
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
  FaChevronDown,
  FaSave,
  FaTimes,
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

// Transform backend CollegeApplication to UI display format
interface CollegeDisplay {
  id: string;
  universityName: string;
  universityCountry: string;
  universityState: string | null;
  universityWebsite: string;
  status: Status;
  deadline: string;
  type: ApplicationType;
  major: string;
  notes: string;
  tags: string[];
  progress: number;
  priority: Priority;
  location?: string;
  applicationFee?: number;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to transform backend data to UI format
const transformCollegeApplication = (
  app: CollegeApplication
): CollegeDisplay => {
  // Calculate progress from checklists/tasks
  let progress = 0;
  if (app.checklists && app.checklists.length > 0) {
    const totalTasks = app.checklists.reduce(
      (acc, checklist) => acc + checklist.tasks.length,
      0
    );
    const completedTasks = app.checklists.reduce(
      (acc, checklist) =>
        acc + checklist.tasks.filter((task) => task.completed).length,
      0
    );
    progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  return {
    id: app.id,
    universityName: app.name,
    universityCountry: "United States", // Default as not in backend schema
    universityState: null, // Parse from location if needed
    universityWebsite: app.websites?.[0] || "",
    status: app.status,
    deadline: app.deadline || "",
    type: app.application_type,
    major: app.major || "",
    notes: app.notes || "",
    tags: app.tags || [],
    progress: progress, // Use calculated progress
    priority: app.priority,
    location: app.location,
    applicationFee: app.application_fee,
    contactEmail: app.contact_email,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
  };
};

const statusColors: Record<Status, string> = {
  [Status.NOT_STARTED]: "bg-gray-500",
  [Status.IN_PROGRESS]: "bg-yellow-500",
  [Status.SUBMITTED]: "bg-green-500",
  [Status.UNDER_REVIEW]: "bg-blue-500",
  [Status.ACCEPTED]: "bg-emerald-500",
  [Status.REJECTED]: "bg-red-500",
  [Status.DEFERRED]: "bg-orange-500",
  [Status.WAITLISTED]: "bg-orange-400",
  [Status.WITHDRAWN]: "bg-gray-400",
};

const typeColors: Record<ApplicationType, string> = {
  [ApplicationType.EARLY_DECISION]: "bg-purple-500",
  [ApplicationType.EARLY_ACTION]: "bg-blue-500",
  [ApplicationType.REGULAR_DECISION]: "bg-gray-500",
  [ApplicationType.ROLLING_ADMISSION]: "bg-green-500",
};

// Helper functions for date format conversion
const formatDateForInput = (isoDate: string | undefined) => {
  if (!isoDate) return "";
  // Extract date components directly to avoid timezone conversion issues
  const dateOnly = isoDate.split("T")[0]; // Get just the YYYY-MM-DD part
  return dateOnly;
};

const formatDateForBackend = (inputDate: string) => {
  if (!inputDate) return "";
  // Parse input date as local date and format for backend
  const [year, month, day] = inputDate.split("-");
  return `${year}-${month}-${day}T23:59:59Z`;
};

export default function CollegeTracker() {
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

  // Backend integration states
  const [colleges, setColleges] = useState<CollegeDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reset form function
  const resetForm = () => {
    setSelectedUniversity(null);
    setUniversitySearch("");
    setCustomUniversityName("");
    setMajorInput("");
    setApplicationType("");
    setPriority("");
    setDeadline("");
    setShowUniversityDropdown(false);
    setShowMajorDropdown(false);
    setShowCustomUniversity(false);
  };

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
  const [showCustomUniversity, setShowCustomUniversity] = useState(false);

  // Major selection states
  const [majorInput, setMajorInput] = useState("");
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);
  const [filteredMajors, setFilteredMajors] = useState<string[]>([]);
  const majorDropdownRef = useRef<HTMLDivElement>(null);

  // New college form states
  const [applicationType, setApplicationType] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");

  // Edit states
  const [editingCollegeId, setEditingCollegeId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    status: "",
    deadline: "",
    major: "",
    notes: "",
    application_type: "",
    priority: "",
  });

  // Load colleges from backend on component mount
  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setIsLoading(true);
      const applications = await api.collegeApplications.getAll();
      const transformedColleges = applications.map(transformCollegeApplication);
      setColleges(transformedColleges);
    } catch (error) {
      console.error("Failed to load colleges:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to load colleges"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  // Filter majors based on input
  useEffect(() => {
    if (majorInput.trim()) {
      const filtered = COLLEGE_MAJORS.filter((major) =>
        major.toLowerCase().includes(majorInput.toLowerCase())
      );
      setFilteredMajors(filtered);
    } else {
      setFilteredMajors(COLLEGE_MAJORS.slice(0, 10)); // Show first 10 when empty
    }
  }, [majorInput]);

  // Handle click outside for major dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        majorDropdownRef.current &&
        !majorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMajorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Filter universities based on search
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
    setShowCustomUniversity(!showCustomUniversity);
    setSelectedUniversity(null);
    setUniversitySearch("");
    setShowUniversityDropdown(false);
    setCustomUniversityName("");
  };

  const handleCreateApplication = async () => {
    if (!selectedUniversity && !customUniversityName.trim()) {
      alert("Please select a university or enter a custom university name.");
      return;
    }

    if (!majorInput.trim()) {
      alert("Please select or enter a major.");
      return;
    }

    try {
      const createData = {
        name: selectedUniversity
          ? selectedUniversity.name
          : customUniversityName,
        websites: selectedUniversity ? selectedUniversity.web_pages : [],
        status: Status.NOT_STARTED,
        application_type: (applicationType ||
          ApplicationType.REGULAR_DECISION) as ApplicationType,
        priority: (priority || Priority.TARGET) as Priority,
        major: majorInput,
        deadline: deadline || undefined,
        location: selectedUniversity
          ? `${selectedUniversity["state-province"] || ""}, ${
              selectedUniversity.country
            }`
          : undefined,
      };

      const newApplication = await api.collegeApplications.create(createData);
      const newCollege = transformCollegeApplication(newApplication);

      setColleges((prev) => [...prev, newCollege]);
      setShowAddCollegeForm(false);
      resetForm();

      showSuccess(`Added ${newCollege.universityName} to your applications!`);

      // Navigate to the college detail page
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
    } catch (error) {
      console.error("Failed to create college application:", error);
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to create college application"
      );
    }
  };

  // Edit college application
  const handleEditCollege = (college: CollegeDisplay) => {
    setEditingCollegeId(college.id);
    setEditForm({
      name: college.universityName,
      status: college.status,
      deadline: college.deadline,
      major: college.major,
      notes: college.notes,
      application_type: college.type,
      priority: "target", // Default since not stored in UI College interface
    });
  };

  const handleCancelEdit = () => {
    setEditingCollegeId(null);
    setEditForm({
      name: "",
      status: "",
      deadline: "",
      major: "",
      notes: "",
      application_type: "",
      priority: "",
    });
  };

  const handleUpdateCollege = async (collegeId: string) => {
    try {
      const updateData = {
        name: editForm.name,
        status: editForm.status as Status,
        deadline: editForm.deadline || undefined,
        major: editForm.major,
        notes: editForm.notes || undefined,
        application_type: editForm.application_type as ApplicationType,
        priority: editForm.priority as Priority,
      };

      const updatedApplication = await api.collegeApplications.update(
        collegeId,
        updateData
      );
      const updatedCollege = transformCollegeApplication(updatedApplication);

      setColleges((prev) =>
        prev.map((c) => (c.id === collegeId ? updatedCollege : c))
      );
      setEditingCollegeId(null);
      showSuccess("College application updated successfully");
    } catch (error) {
      console.error("Failed to update college application:", error);
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to update college application"
      );
    }
  };

  // Delete college application
  const handleDeleteCollege = async (collegeId: string) => {
    if (!confirm("Are you sure you want to delete this college application?")) {
      return;
    }

    try {
      await api.collegeApplications.delete(collegeId);
      setColleges((prev) => prev.filter((c) => c.id !== collegeId));
      showSuccess("College application deleted successfully");
    } catch (error) {
      console.error("Failed to delete college application:", error);
      showError(
        error instanceof ApiError
          ? error.message
          : "Failed to delete college application"
      );
    }
  };

  // Example: Create a checklist for a college application
  const handleCreateChecklist = async (
    collegeId: string,
    checklistName: string
  ) => {
    try {
      const createData = {
        application_id: collegeId,
        name: checklistName,
        category: Category.APPLICATION,
        description: "Application checklist",
      };

      await api.checklists.create(createData);
      showSuccess(`Created checklist "${checklistName}" successfully`);

      // Refresh the colleges to show updated data
      await loadColleges();
    } catch (error) {
      console.error("Failed to create checklist:", error);
      showError(
        error instanceof ApiError ? error.message : "Failed to create checklist"
      );
    }
  };

  const getDaysUntilDeadlineMain = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day to avoid time comparison issues

    // Extract date part only to avoid timezone issues
    const dateOnly = deadline.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    const deadlineDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    deadlineDate.setHours(0, 0, 0, 0); // Set to start of day

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadlineMain = (deadline: string) => {
    if (!deadline) return "No deadline set";
    // Extract date part only to avoid timezone issues
    const dateOnly = deadline.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
                {!showCustomUniversity && (
                  <div className="text-center">
                    <div className="text-[#FEEBD8]/50 text-sm mb-4">or</div>

                    <button
                      type="button"
                      onClick={handleCustomUniversityToggle}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline"
                    >
                      Can't find your university? Add custom name
                    </button>
                  </div>
                )}

                {showCustomUniversity && (
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
                    <button
                      type="button"
                      onClick={() => setShowCustomUniversity(false)}
                      className="mt-2 text-sm text-[#FEEBD8]/70 hover:text-[#FEEBD8] underline"
                    >
                      Back to university search
                    </button>
                  </div>
                )}

                {/* Major Selection */}
                <div ref={majorDropdownRef}>
                  <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                    Major
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search or select a major..."
                      value={majorInput}
                      onChange={(e) => {
                        setMajorInput(e.target.value);
                        setShowMajorDropdown(true);
                      }}
                      onFocus={() => setShowMajorDropdown(true)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                    />

                    {showMajorDropdown && filteredMajors.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredMajors.slice(0, 10).map((major, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setMajorInput(major);
                              setShowMajorDropdown(false);
                            }}
                            className="px-4 py-2 text-[#FEEBD8] hover:bg-neutral-700 cursor-pointer"
                          >
                            {major}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Popular Majors Quick Selection */}
                  <div className="mt-3">
                    <p className="text-xs text-[#FEEBD8]/50 mb-2">
                      Popular majors:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_MAJORS.slice(0, 6).map((major) => (
                        <button
                          key={major}
                          type="button"
                          onClick={() => {
                            setMajorInput(major);
                            setShowMajorDropdown(false);
                          }}
                          className="px-3 py-1 text-xs bg-neutral-700 text-[#FEEBD8]/80 rounded-md hover:bg-neutral-600 transition-colors"
                        >
                          {major}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Application Type and Priority Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Application Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      Application Type
                    </label>
                    <select
                      value={applicationType}
                      onChange={(e) => setApplicationType(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                    >
                      <option value="">Select Application Type</option>
                      <option value={ApplicationType.EARLY_DECISION}>
                        Early Decision
                      </option>
                      <option value={ApplicationType.EARLY_ACTION}>
                        Early Action
                      </option>
                      <option value={ApplicationType.REGULAR_DECISION}>
                        Regular Decision
                      </option>
                      <option value={ApplicationType.ROLLING_ADMISSION}>
                        Rolling Admission
                      </option>
                    </select>
                  </div>

                  {/* Priority Level */}
                  <div>
                    <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                    >
                      <option value="">Select Priority</option>
                      <option value={Priority.REACH}>Reach</option>
                      <option value={Priority.TARGET}>Target</option>
                      <option value={Priority.SAFETY}>Safety</option>
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <DatePicker
                  label="Application Deadline"
                  value={formatDateForInput(deadline)}
                  onChange={(date) => setDeadline(formatDateForBackend(date))}
                  placeholder="Select application deadline"
                  minDate={new Date().toISOString().split("T")[0]}
                />

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => {
                      setShowAddCollegeForm(false);
                      resetForm();
                    }}
                    className="flex-1 bg-neutral-700 text-[#FEEBD8] px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateApplication}
                    disabled={
                      (!selectedUniversity && !customUniversityName.trim()) ||
                      !majorInput.trim()
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-lg">
              Loading college applications...
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#FEEBD8]">
                College Applications
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2">
                Manage your university applications with comprehensive tracking
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCollegeForm(true)}
            className="bg-[#FEEBD8] text-[#141414] px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
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
              {colleges.filter((c) => c.status === Status.SUBMITTED).length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Submitted</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {colleges.filter((c) => c.status === Status.IN_PROGRESS).length}
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
              <option value={Status.NOT_STARTED}>Not Started</option>
              <option value={Status.IN_PROGRESS}>In Progress</option>
              <option value={Status.SUBMITTED}>Submitted</option>
              <option value={Status.UNDER_REVIEW}>Under Review</option>
              <option value={Status.ACCEPTED}>Accepted</option>
              <option value={Status.REJECTED}>Rejected</option>
              <option value={Status.DEFERRED}>Deferred</option>
              <option value={Status.WAITLISTED}>Waitlisted</option>
              <option value={Status.WITHDRAWN}>Withdrawn</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="All">All Types</option>
              <option value={ApplicationType.EARLY_DECISION}>
                Early Decision
              </option>
              <option value={ApplicationType.EARLY_ACTION}>Early Action</option>
              <option value={ApplicationType.REGULAR_DECISION}>
                Regular Decision
              </option>
              <option value={ApplicationType.ROLLING_ADMISSION}>
                Rolling Admission
              </option>
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
                className={`bg-[#141414] border rounded-lg p-6 transition-colors ${
                  isUrgent ? "border-red-500/50" : "border-neutral-700/50"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    {/* College Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xl font-semibold text-[#FEEBD8] hover:text-[#E5D5B7] cursor-pointer transition-colors"
                          onClick={() => handleCollegeClick(college.id)}
                        >
                          {college.universityName}
                        </span>
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
                    </div>

                    {/* Location */}
                    <div className="text-[#FEEBD8]/70 text-sm mb-2">
                      {college.location || college.universityCountry}
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm text-[#FEEBD8]/70 mb-3">
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

                    {/* Major */}
                    {college.major && (
                      <div className="text-[#FEEBD8]/70 text-sm mb-3">
                        <strong>Major:</strong> {college.major}
                      </div>
                    )}

                    {/* Tags */}
                    {college.tags && college.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {college.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-neutral-800 text-[#FEEBD8]/70 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {college.notes && (
                      <div className="text-[#FEEBD8]/60 text-sm italic">
                        {college.notes}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Separate Section to Avoid Nesting */}
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    {editingCollegeId === college.id ? (
                      // Edit Mode
                      <>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="University Name"
                          className="px-3 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                        />
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                          className="px-3 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                        >
                          <option value="">Select Status</option>
                          <option value={Status.NOT_STARTED}>
                            Not Started
                          </option>
                          <option value={Status.IN_PROGRESS}>
                            In Progress
                          </option>
                          <option value={Status.SUBMITTED}>Submitted</option>
                          <option value={Status.UNDER_REVIEW}>
                            Under Review
                          </option>
                          <option value={Status.ACCEPTED}>Accepted</option>
                          <option value={Status.REJECTED}>Rejected</option>
                          <option value={Status.DEFERRED}>Deferred</option>
                          <option value={Status.WAITLISTED}>Waitlisted</option>
                          <option value={Status.WITHDRAWN}>Withdrawn</option>
                        </select>
                        <select
                          value={editForm.application_type}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              application_type: e.target.value,
                            })
                          }
                          className="px-3 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                        >
                          <option value="">Select Application Type</option>
                          <option value={ApplicationType.EARLY_DECISION}>
                            Early Decision
                          </option>
                          <option value={ApplicationType.EARLY_ACTION}>
                            Early Action
                          </option>
                          <option value={ApplicationType.REGULAR_DECISION}>
                            Regular Decision
                          </option>
                          <option value={ApplicationType.ROLLING_ADMISSION}>
                            Rolling Admission
                          </option>
                        </select>
                        <select
                          value={editForm.priority}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              priority: e.target.value,
                            })
                          }
                          className="px-3 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                        >
                          <option value="">Select Priority</option>
                          <option value={Priority.REACH}>Reach</option>
                          <option value={Priority.TARGET}>Target</option>
                          <option value={Priority.SAFETY}>Safety</option>
                        </select>
                        <div className="w-48">
                          <DatePicker
                            value={formatDateForInput(editForm.deadline)}
                            onChange={(date) =>
                              setEditForm({
                                ...editForm,
                                deadline: formatDateForBackend(date),
                              })
                            }
                            placeholder="Select deadline"
                          />
                        </div>
                        <input
                          type="text"
                          value={editForm.major}
                          onChange={(e) =>
                            setEditForm({ ...editForm, major: e.target.value })
                          }
                          placeholder="Major"
                          className="px-3 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateCollege(college.id)}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                          >
                            <FaSave size={14} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                          >
                            <FaTimes size={14} />
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      // View Mode - Clean Button Layout
                      <>
                        <button
                          onClick={() => handleCollegeClick(college.id)}
                          className="w-full px-3 py-2 bg-[#FEEBD8] text-[#141414] rounded-lg hover:bg-[#E5D5B7] flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                          <FaChevronRight size={14} />
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteCollege(college.id)}
                          className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm"
                        >
                          <FaTrash size={14} />
                          Delete
                        </button>
                      </>
                    )}
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
