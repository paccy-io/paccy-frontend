import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaUniversity,
  FaCalendar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaGraduationCap,
  FaChevronDown,
} from "react-icons/fa";
import { COLLEGE_MAJORS, POPULAR_MAJORS } from "../../lib/majors";
import DatePicker from "../DatePicker";

export interface University {
  name: string;
  country: string;
  "state-province": string | null;
  web_pages: string[];
  alpha_two_code: string;
}

interface College {
  id: number;
  name: string;
  location: string;
  status: string;
  deadline: string;
  applicationFee: number;
  acceptance: number;
  ranking: number;
  major: string;
  notes: string;
  applicationType: string;
  priorityLevel: string;
}

interface AddCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collegeData: Omit<College, "id">) => void;
}

export default function AddCollegeModal({
  isOpen,
  onClose,
  onSave,
}: AddCollegeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "Researching",
    deadline: "",
    applicationFee: 0,
    acceptance: 0,
    ranking: 0,
    major: "",
    applicationType: "regular_decision",
    priorityLevel: "",
  });

  // Validation states for number inputs
  const [applicationFeeInputValue, setApplicationFeeInputValue] =
    React.useState("");
  const [applicationFeeError, setApplicationFeeError] = React.useState("");
  const [acceptanceInputValue, setAcceptanceInputValue] = React.useState("");
  const [acceptanceError, setAcceptanceError] = React.useState("");
  const [rankingInputValue, setRankingInputValue] = React.useState("");
  const [rankingError, setRankingError] = React.useState("");

  // Validation handlers
  const handleApplicationFeeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setApplicationFeeInputValue(value);

    if (value === "") {
      setApplicationFeeError("");
      setFormData((prev) => ({ ...prev, applicationFee: 0 }));
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setApplicationFeeError("Please enter a valid fee amount");
      return;
    }

    if (num < 0) {
      setApplicationFeeError("Application fee cannot be negative");
      return;
    }

    setApplicationFeeError("");
    setFormData((prev) => ({ ...prev, applicationFee: num }));
  };

  const handleAcceptanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAcceptanceInputValue(value);

    if (value === "") {
      setAcceptanceError("");
      setFormData((prev) => ({ ...prev, acceptance: 0 }));
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setAcceptanceError("Please enter a valid acceptance rate");
      return;
    }

    if (num < 0 || num > 100) {
      setAcceptanceError("Acceptance rate must be between 0 and 100");
      return;
    }

    setAcceptanceError("");
    setFormData((prev) => ({ ...prev, acceptance: num }));
  };

  const handleRankingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRankingInputValue(value);

    if (value === "") {
      setRankingError("");
      setFormData((prev) => ({ ...prev, ranking: 0 }));
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setRankingError("Please enter a valid ranking");
      return;
    }

    if (num < 0) {
      setRankingError("Ranking cannot be negative");
      return;
    }

    setRankingError("");
    setFormData((prev) => ({ ...prev, ranking: num }));
  };

  // University search functionality
  const [universitySearch, setUniversitySearch] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<
    University[]
  >([]);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [showCustomUniversity, setShowCustomUniversity] = useState(false);

  // Major search functionality
  const [majorInput, setMajorInput] = useState("");
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);
  const [filteredMajors, setFilteredMajors] = useState<string[]>([]);

  // Refs for click outside detection
  const majorDropdownRef = useRef<HTMLDivElement>(null);
  const universityDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch universities from API
  useEffect(() => {
    const fetchUniversities = async () => {
      if (universitySearch.length > 2) {
        setIsLoadingUniversities(true);
        try {
          const response = await fetch(
            `http://universities.hipolabs.com/search?name=${encodeURIComponent(
              universitySearch
            )}`
          );
          const data = await response.json();
          setUniversities(data);
          setFilteredUniversities(data.slice(0, 10)); // Limit to 10 results
        } catch (error) {
          console.error("Error fetching universities:", error);
        } finally {
          setIsLoadingUniversities(false);
        }
      } else {
        setFilteredUniversities([]);
      }
    };

    const timeoutId = setTimeout(fetchUniversities, 300);
    return () => clearTimeout(timeoutId);
  }, [universitySearch]);

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

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        majorDropdownRef.current &&
        !majorDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMajorDropdown(false);
      }
      if (
        universityDropdownRef.current &&
        !universityDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUniversityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "applicationFee" || name === "acceptance" || name === "ranking"
          ? Number(value)
          : value,
    }));
  };

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setUniversitySearch(university.name);
    setFormData((prev) => ({
      ...prev,
      name: university.name,
      location: `${university["state-province"] || ""}, ${
        university.country
      }`.replace(/^, /, ""),
    }));
    setShowUniversityDropdown(false);
  };

  const handleMajorSelect = (major: string) => {
    setMajorInput(major);
    setFormData((prev) => ({
      ...prev,
      major: major,
    }));
    setShowMajorDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a university name.");
      return;
    }

    if (!formData.major.trim()) {
      alert("Please select a major.");
      return;
    }

    // Check for validation errors before submitting
    if (applicationFeeError || acceptanceError || rankingError) {
      return;
    }

    onSave({
      ...formData,
      notes: "", // Default empty notes since we removed the field
    });

    // Reset form
    setFormData({
      name: "",
      location: "",
      status: "Researching",
      deadline: "",
      applicationFee: 0,
      acceptance: 0,
      ranking: 0,
      major: "",
      applicationType: "regular_decision",
      priorityLevel: "",
    });
    setUniversitySearch("");
    setMajorInput("");
    setSelectedUniversity(null);
    setShowCustomUniversity(false);

    // Reset validation states
    setApplicationFeeInputValue("");
    setApplicationFeeError("");
    setAcceptanceInputValue("");
    setAcceptanceError("");
    setRankingInputValue("");
    setRankingError("");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaUniversity className="text-blue-400" />
            Add College Application
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* University Search */}
          <div ref={universityDropdownRef}>
            <label className="block text-sm font-medium text-white/70 mb-2">
              University Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a university..."
                value={universitySearch}
                onChange={(e) => {
                  setUniversitySearch(e.target.value);
                  setShowUniversityDropdown(true);
                  setShowCustomUniversity(false);
                }}
                onFocus={() => setShowUniversityDropdown(true)}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />

              {showUniversityDropdown && filteredUniversities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700/50 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredUniversities.map((university, index) => (
                    <div
                      key={index}
                      onClick={() => handleUniversitySelect(university)}
                      className="px-4 py-3 text-white hover:bg-neutral-700 cursor-pointer border-b border-neutral-700/50 last:border-b-0"
                    >
                      <div className="font-medium">{university.name}</div>
                      <div className="text-sm text-white/70">
                        {university["state-province"] &&
                          `${university["state-province"]}, `}
                        {university.country}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isLoadingUniversities && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {!showCustomUniversity && (
              <button
                type="button"
                onClick={() => setShowCustomUniversity(true)}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
              >
                Can't find your university? Add custom name
              </button>
            )}
          </div>

          {/* Custom University Name */}
          {showCustomUniversity && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Custom University Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter university name..."
              />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="City, State/Country"
            />
          </div>

          {/* Major Selection */}
          <div ref={majorDropdownRef}>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <FaGraduationCap className="inline mr-2" />
              Major
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search or select a major..."
                value={majorInput}
                onChange={(e) => {
                  setMajorInput(e.target.value);
                  setFormData((prev) => ({ ...prev, major: e.target.value }));
                  setShowMajorDropdown(true);
                }}
                onFocus={() => setShowMajorDropdown(true)}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />

              {showMajorDropdown && filteredMajors.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700/50 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredMajors.slice(0, 10).map((major, index) => (
                    <div
                      key={index}
                      onClick={() => handleMajorSelect(major)}
                      className="px-4 py-2 text-white hover:bg-neutral-700 cursor-pointer"
                    >
                      {major}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Majors Quick Selection */}
            <div className="mt-3">
              <p className="text-xs text-white/50 mb-2">Popular majors:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_MAJORS.map((major) => (
                  <button
                    key={major}
                    type="button"
                    onClick={() => handleMajorSelect(major)}
                    className="px-3 py-1 text-xs bg-neutral-700 text-white/80 rounded-md hover:bg-neutral-600 transition-colors"
                  >
                    {major}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Researching">Researching</option>
                <option value="Applied">Applied</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Waitlisted">Waitlisted</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                <FaCalendar className="inline mr-2" />
                Application Deadline
              </label>
              <DatePicker
                value={formData.deadline}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, deadline: date }))
                }
                placeholder="Select application deadline"
                minDate={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Application Fee */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                <FaDollarSign className="inline mr-2" />
                Application Fee ($)
              </label>
              <input
                type="text"
                name="applicationFee"
                value={applicationFeeInputValue}
                onChange={handleApplicationFeeChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                  applicationFeeError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                }`}
                placeholder="e.g., 75"
              />
              {applicationFeeError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {applicationFeeError}
                </p>
              )}
            </div>

            {/* Acceptance Rate */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Acceptance Rate (%)
              </label>
              <input
                type="text"
                name="acceptance"
                value={acceptanceInputValue}
                onChange={handleAcceptanceChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                  acceptanceError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                }`}
                placeholder="0 - 100"
              />
              {acceptanceError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {acceptanceError}
                </p>
              )}
            </div>

            {/* Ranking */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Ranking
              </label>
              <input
                type="text"
                name="ranking"
                value={rankingInputValue}
                onChange={handleRankingChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                  rankingError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                }`}
                placeholder="e.g., 5"
              />
              {rankingError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {rankingError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Application Type */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Application Type
              </label>
              <select
                name="applicationType"
                value={formData.applicationType}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="early_decision">Early Decision</option>
                <option value="early_action">Early Action</option>
                <option value="regular_decision">Regular Decision</option>
                <option value="rolling_admission">Rolling Admission</option>
              </select>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Priority Level
              </label>
              <select
                name="priorityLevel"
                value={formData.priorityLevel}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select Priority Level</option>
                <option value="Safety">Safety</option>
                <option value="Target">Target</option>
                <option value="Reach">Reach</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !!(applicationFeeError || acceptanceError || rankingError)
              }
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add College
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
