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
    notes: "",
  });

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

    onSave(formData);

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
      notes: "",
    });
    setUniversitySearch("");
    setMajorInput("");
    setSelectedUniversity(null);
    setShowCustomUniversity(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FEEBD8] flex items-center gap-2">
            <FaUniversity className="text-blue-400" />
            Add College Application
          </h2>
          <button
            onClick={onClose}
            className="text-[#FEEBD8] hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* University Search */}
          <div ref={universityDropdownRef}>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
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
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />

              {showUniversityDropdown && filteredUniversities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredUniversities.map((university, index) => (
                    <div
                      key={index}
                      onClick={() => handleUniversitySelect(university)}
                      className="px-4 py-3 text-[#FEEBD8] hover:bg-neutral-700 cursor-pointer border-b border-neutral-700 last:border-b-0"
                    >
                      <div className="font-medium">{university.name}</div>
                      <div className="text-sm text-[#FEEBD8]/70">
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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FEEBD8]"></div>
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
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Custom University Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="Enter university name..."
              />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="City, State/Country"
            />
          </div>

          {/* Major Selection */}
          <div ref={majorDropdownRef}>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
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
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />

              {showMajorDropdown && filteredMajors.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredMajors.slice(0, 10).map((major, index) => (
                    <div
                      key={index}
                      onClick={() => handleMajorSelect(major)}
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
              <p className="text-xs text-[#FEEBD8]/50 mb-2">Popular majors:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_MAJORS.map((major) => (
                  <button
                    key={major}
                    type="button"
                    onClick={() => handleMajorSelect(major)}
                    className="px-3 py-1 text-xs bg-neutral-700 text-[#FEEBD8]/80 rounded-md hover:bg-neutral-600 transition-colors"
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
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
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
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                <FaCalendar className="inline mr-2" />
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Application Fee */}
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                <FaDollarSign className="inline mr-2" />
                Application Fee ($)
              </label>
              <input
                type="number"
                name="applicationFee"
                value={formData.applicationFee}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                min="0"
              />
            </div>

            {/* Acceptance Rate */}
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Acceptance Rate (%)
              </label>
              <input
                type="number"
                name="acceptance"
                value={formData.acceptance}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                min="0"
                max="100"
              />
            </div>

            {/* Ranking */}
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Ranking
              </label>
              <input
                type="number"
                name="ranking"
                value={formData.ranking}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                min="1"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Add any additional notes about this college..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 text-[#FEEBD8] px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
            >
              Add College
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
