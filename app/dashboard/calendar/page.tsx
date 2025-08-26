"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddEventModal from "../../../components/Modals/AddEventModal";
import EditEventModal from "../../../components/Modals/EditEventModal";
import EventDetailsModal from "../../../components/Modals/EventDetailsModal";
import {
  CalendarEvent,
  EventType,
  EventPriority,
  CreateEventDTO,
  UpdateEventDTO,
  CollegeApplication,
} from "../../../lib/types";
import { calendarApi } from "../../../lib/api/calendar";
import { collegeApplicationsApi } from "../../../lib/api/college-applications";
import { useToast } from "../../../lib/hooks/useToast";
import {
  FaPlus,
  FaCalendar,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaExclamationTriangle,
  FaUniversity,
  FaPen,
  FaEdit,
  FaInbox,
  FaGripVertical,
  FaList,
  FaTh,
  FaColumns,
} from "react-icons/fa";

const eventTypeColors: Record<EventType, string> = {
  [EventType.APPLICATION_DEADLINE]: "bg-red-500",
  [EventType.INTERVIEW]: "bg-blue-500",
  [EventType.REMINDER]: "bg-yellow-500",
  [EventType.CAMPUS_VISIT]: "bg-green-500",
  [EventType.TEST_DATE]: "bg-purple-500",
  [EventType.OTHER]: "bg-gray-500",
};

const priorityColors: Record<EventPriority, string> = {
  [EventPriority.HIGH]: "border-red-500",
  [EventPriority.MEDIUM]: "border-yellow-500",
  [EventPriority.LOW]: "border-green-500",
};

// Helper function to extract time from ISO 8601 date string
const getTimeFromDate = (isoDate?: string): string | null => {
  if (!isoDate) return null;
  try {
    const date = new Date(isoDate);
    return date.toTimeString().slice(0, 5); // Returns HH:MM format
  } catch {
    return null;
  }
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [colleges, setColleges] = useState<CollegeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [expandedDateEvents, setExpandedDateEvents] = useState<string | null>(
    null
  );
  const [showDateEventsModal, setShowDateEventsModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toast = useToast();

  // Helper function to get formatted college name with major if needed
  const getFormattedCollegeName = (event: CalendarEvent): string => {
    if (!event.college) return "";

    // Find college application by college_id if available
    const collegeApp = event.college_id
      ? colleges.find((c) => c.id === event.college_id)
      : null;

    // Check if there are multiple applications with the same college name
    const sameName = colleges.filter((c) => c.name === event.college);

    if (sameName.length > 1 && collegeApp?.major) {
      return `${event.college} [${collegeApp.major}]`;
    }

    return event.college;
  };

  // Load events and colleges from API on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check initially
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventsData, collegesData] = await Promise.all([
        calendarApi.getAll(),
        collegeApplicationsApi.getAll(),
      ]);
      setEvents(eventsData);
      setColleges(collegesData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load calendar data");
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Calendar & Deadlines | Paccy";
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDateEventsModal) {
        handleCloseDateEventsModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showDateEventsModal]);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(
      new Date(currentYear, currentMonth + (direction === "next" ? 1 : -1), 1)
    );
  };

  const getEventsForDate = (date: string) => {
    return events.filter((event) => {
      if (!event.date) return false;
      // Extract date part from ISO string (YYYY-MM-DD) and compare
      const eventDatePart = event.date.split("T")[0];
      return eventDatePart === date;
    });
  };

  const getDaysUntilEvent = (eventDate: string) => {
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUpcomingEvents = () => {
    return events
      .filter((event) => event.date && new Date(event.date) >= today)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 5);
  };

  // Week view helpers
  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  const getWeekEnd = (date: Date) => {
    const end = new Date(date);
    end.setDate(date.getDate() - date.getDay() + 6);
    return end;
  };

  const getWeekDays = () => {
    const start = getWeekStart(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getAllEventsSorted = () => {
    return [...events].sort((a, b) => {
      // Sort by date first, then by time
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;

      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;

      // If same date, sort by time
      const aTime = getTimeFromDate(a.date);
      const bTime = getTimeFromDate(b.date);
      if (!aTime && !bTime) return 0;
      if (!aTime) return 1;
      if (!bTime) return -1;

      return aTime.localeCompare(bTime);
    });
  };

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to get today's date string
  const getTodayString = () => {
    return formatDateString(new Date());
  };

  const getUndatedEvents = () => {
    return events.filter((event) => !event.date);
  };

  const handleAddEvent = async (newEvent: CreateEventDTO) => {
    try {
      const eventToCreate = { ...newEvent };

      // If no date is provided but we have a selected date, use it with default time
      if (!eventToCreate.date && selectedDate) {
        eventToCreate.date = `${selectedDate}T12:00:00Z`;
      }

      const createdEvent = await calendarApi.create(eventToCreate);

      setEvents((prev) => [...prev, createdEvent]);
      toast.success("Event created successfully");

      // Clear selected date after adding
      setSelectedDate(null);

      // Reload data to get updated college information if needed
      loadData();
    } catch (err) {
      console.error("Failed to create event:", err);
      toast.error("Failed to create event");
    }
  };

  const handleEditEvent = async (
    eventId: string,
    updatedEvent: UpdateEventDTO
  ) => {
    try {
      const updated = await calendarApi.update(eventId, updatedEvent);

      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? updated : event))
      );
      toast.success("Event updated successfully");
    } catch (err) {
      console.error("Failed to update event:", err);
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await calendarApi.delete(eventId);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast.error("Failed to delete event");
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  const handleEditFromDetails = () => {
    setIsEventDetailsModalOpen(false);
    setIsEditEventModalOpen(true);
  };

  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString);
    setCurrentDate(new Date(dateString));
  };

  const handleShowAllEvents = (dateString: string) => {
    setExpandedDateEvents(dateString);
    setShowDateEventsModal(true);
  };

  const handleCloseDateEventsModal = () => {
    setShowDateEventsModal(false);
    setExpandedDateEvents(null);
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", event.id);

    // Create a custom drag image
    const dragElement = e.currentTarget.cloneNode(true) as HTMLElement;
    dragElement.style.transform = "rotate(5deg)";
    dragElement.style.opacity = "0.8";
    document.body.appendChild(dragElement);
    e.dataTransfer.setDragImage(dragElement, 50, 20);

    // Clean up the temporary element after a short delay
    setTimeout(() => {
      document.body.removeChild(dragElement);
    }, 0);

    // Add visual feedback to original element
    e.currentTarget.classList.add("opacity-50", "scale-95");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedEvent(null);
    setDragOverTarget(null);
    e.currentTarget.classList.remove("opacity-50", "scale-95");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDateDragOver = (e: React.DragEvent, dateString: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget(dateString);
  };

  const handleDateDrop = (
    e: React.DragEvent,
    targetDate: string,
    targetHour?: number
  ) => {
    e.preventDefault();
    setDragOverTarget(null);

    if (!draggedEvent) return;

    // Update the event with new date, preserving time if it exists
    let newDate: string;
    if (typeof targetHour === "number") {
      // Use the target hour for the new time
      newDate = `${targetDate}T${targetHour
        .toString()
        .padStart(2, "0")}:00:00Z`;
    } else if (draggedEvent.date) {
      try {
        // Parse the existing date to extract time
        const existingDate = new Date(draggedEvent.date);
        const hours = existingDate.getHours().toString().padStart(2, "0");
        const minutes = existingDate.getMinutes().toString().padStart(2, "0");
        const seconds = existingDate.getSeconds().toString().padStart(2, "0");
        newDate = `${targetDate}T${hours}:${minutes}:${seconds}Z`;
      } catch {
        // If parsing fails, use noon as default
        newDate = `${targetDate}T12:00:00Z`;
      }
    } else {
      // If no existing date, use noon as default
      newDate = `${targetDate}T12:00:00Z`;
    }

    handleEditEvent(draggedEvent.id, {
      ...draggedEvent,
      date: newDate,
    });

    // Show a brief visual confirmation
    const targetElement = e.currentTarget;
    targetElement.classList.add("ring-2", "ring-green-500");
    setTimeout(() => {
      targetElement.classList.remove("ring-2", "ring-green-500");
    }, 1000);

    setDraggedEvent(null);
  };

  const handleInboxDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget("inbox");
  };

  const handleInboxDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTarget(null);

    if (!draggedEvent) return;

    // Remove date to move to inbox
    handleEditEvent(draggedEvent.id, {
      ...draggedEvent,
      date: null,
    });

    // Show a brief visual confirmation
    const targetElement = e.currentTarget;
    targetElement.classList.add("ring-2", "ring-blue-500");
    setTimeout(() => {
      targetElement.classList.remove("ring-2", "ring-blue-500");
    }, 1000);

    setDraggedEvent(null);
  };

  const renderCalendarDays = () => {
    const days: React.ReactElement[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-16 sm:h-20 md:h-24 border border-neutral-700/30"
        ></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const dayEvents = getEventsForDate(dateString);
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;

      days.push(
        <div
          key={day}
          className={`h-16 sm:h-20 md:h-24 border border-neutral-700/30 p-1 cursor-pointer transition-colors ${
            isToday
              ? "bg-[#FEEBD8]/10 border-[#FEEBD8]/50"
              : "hover:bg-neutral-800/30"
          } ${
            dragOverTarget === dateString
              ? "bg-blue-500/20 border-blue-500/50"
              : ""
          }`}
          onClick={() => handleDateClick(dateString)}
          onDragOver={(e) => handleDateDragOver(e, dateString)}
          onDrop={(e) => handleDateDrop(e, dateString)}
          onDragLeave={() => setDragOverTarget(null)}
        >
          <div
            className={`text-xs sm:text-sm font-medium mb-1 ${
              isToday ? "text-[#FEEBD8]" : "text-[#FEEBD8]/70"
            }`}
          >
            {day}
          </div>
          <div className="space-y-0.5 sm:space-y-1 overflow-hidden">
            {/* Show fewer events on mobile, more on larger screens */}
            {dayEvents.slice(0, isMobile ? 1 : 2).map((event) => (
              <div
                key={event.id}
                draggable
                onDragStart={(e) => handleDragStart(e, event)}
                onDragEnd={handleDragEnd}
                className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-move hover:opacity-80 transition-opacity ${
                  eventTypeColors[event.type]
                } relative group`}
                title={`${event.title} - ${getFormattedCollegeName(event)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
              >
                <FaGripVertical className="absolute left-0 top-0.5 text-white/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="ml-2 block truncate">
                  {/* Show shorter titles on mobile */}
                  {isMobile && event.title.length > 8
                    ? `${event.title.substring(0, 8)}...`
                    : event.title}
                </span>
              </div>
            ))}
            {dayEvents.length > (isMobile ? 1 : 2) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowAllEvents(dateString);
                }}
                className="text-xs text-[#FEEBD8]/50 hover:text-[#FEEBD8] hover:bg-neutral-700/30 transition-all duration-200 cursor-pointer underline rounded px-1 py-0.5 w-full text-left"
                title={`View all ${dayEvents.length} events`}
              >
                +{dayEvents.length - (isMobile ? 1 : 2)} more
              </button>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FEEBD8]">
                Calendar & Deadlines
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2 text-sm sm:text-base">
                Never miss an important date
                {draggedEvent && (
                  <span className="ml-2 text-blue-400 text-sm">
                    • Drag to calendar date or inbox to reschedule
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center lg:items-center gap-3 sm:gap-4">
            {/* View Mode Selector */}
            <div className="flex items-center bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("month")}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-colors flex-1 sm:flex-initial ${
                  viewMode === "month"
                    ? "bg-[#FEEBD8] text-[#141414]"
                    : "text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:bg-neutral-700"
                }`}
              >
                <FaTh size={14} />
                <span className="text-sm">Month</span>
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-colors flex-1 sm:flex-initial ${
                  viewMode === "week"
                    ? "bg-[#FEEBD8] text-[#141414]"
                    : "text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:bg-neutral-700"
                }`}
              >
                <FaColumns size={14} />
                <span className="text-sm">Week</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-colors flex-1 sm:flex-initial ${
                  viewMode === "list"
                    ? "bg-[#FEEBD8] text-[#141414]"
                    : "text-[#FEEBD8]/70 hover:text-[#FEEBD8] hover:bg-neutral-700"
                }`}
              >
                <FaList size={14} />
                <span className="text-sm">List</span>
              </button>
            </div>

            <button
              onClick={() => setIsAddEventModalOpen(true)}
              className="bg-[#FEEBD8] text-[#141414] px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <FaPlus />
              <span>Add Event</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {events.length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Total Events</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {
                events.filter(
                  (e) =>
                    e.date &&
                    getDaysUntilEvent(e.date) <= 7 &&
                    getDaysUntilEvent(e.date) > 0
                ).length
              }
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">This Week</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {
                events.filter((e) => e.type === EventType.APPLICATION_DEADLINE)
                  .length
              }
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Deadlines</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {events.filter((e) => e.type === EventType.INTERVIEW).length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Interviews</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Calendar Views */}
          <div className="lg:col-span-2">
            {viewMode === "month" && (
              <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-4 sm:p-6">
                {/* Calendar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#FEEBD8] text-center sm:text-left">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => navigateMonth("prev")}
                      className="p-2 hover:bg-neutral-700/30 rounded-lg transition-colors"
                    >
                      <FaChevronLeft className="text-[#FEEBD8]" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-3 sm:px-4 py-2 text-sm bg-neutral-700/30 hover:bg-neutral-700/50 rounded-lg transition-colors text-[#FEEBD8]"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => navigateMonth("next")}
                      className="p-2 hover:bg-neutral-700/30 rounded-lg transition-colors"
                    >
                      <FaChevronRight className="text-[#FEEBD8]" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0 border border-neutral-700/50 rounded-lg overflow-hidden">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <div
                        key={day}
                        className="bg-neutral-800 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-[#FEEBD8]/70 border-b border-neutral-700/30"
                      >
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.charAt(0)}</span>
                      </div>
                    )
                  )}

                  {/* Calendar days */}
                  {renderCalendarDays()}
                </div>
              </div>
            )}

            {viewMode === "week" && (
              <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
                {/* Week Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#FEEBD8]">
                    {getWeekStart(currentDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {getWeekEnd(currentDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateWeek("prev")}
                      className="p-2 hover:bg-neutral-700/30 rounded-lg transition-colors"
                    >
                      <FaChevronLeft className="text-[#FEEBD8]" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-4 py-2 text-sm bg-neutral-700/30 hover:bg-neutral-700/50 rounded-lg transition-colors text-[#FEEBD8]"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => navigateWeek("next")}
                      className="p-2 hover:bg-neutral-700/30 rounded-lg transition-colors"
                    >
                      <FaChevronRight className="text-[#FEEBD8]" />
                    </button>
                  </div>
                </div>

                {/* Week View Container */}
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Day Headers */}
                    <div className="grid grid-cols-8 gap-0 mb-4">
                      <div className="p-3"></div>{" "}
                      {/* Empty space for time column */}
                      {getWeekDays().map((day, index) => {
                        const dateString = formatDateString(day);
                        const isToday = dateString === getTodayString();
                        const dayEvents = getEventsForDate(dateString);

                        return (
                          <div
                            key={index}
                            className={`p-3 text-center border-b-2 ${
                              isToday
                                ? "border-blue-500"
                                : "border-neutral-700/30"
                            }`}
                          >
                            <div
                              className={`text-sm font-medium ${
                                isToday ? "text-blue-400" : "text-[#FEEBD8]/70"
                              }`}
                            >
                              {day.toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </div>
                            <div
                              className={`text-xl font-bold mt-1 ${
                                isToday ? "text-blue-400" : "text-[#FEEBD8]"
                              }`}
                            >
                              {day.getDate()}
                            </div>
                            <div className="text-xs text-[#FEEBD8]/50 mt-1">
                              {dayEvents.length} event
                              {dayEvents.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-8 gap-0 border border-neutral-700/30 rounded-lg overflow-hidden">
                      {/* All-day events row */}
                      <div className="bg-neutral-800/50 p-3 border-r border-neutral-700/30 flex items-center">
                        <span className="text-xs font-medium text-[#FEEBD8]/70">
                          All Day
                        </span>
                      </div>
                      {getWeekDays().map((day, dayIndex) => {
                        const dateString = formatDateString(day);
                        const dayEvents = getEventsForDate(dateString);
                        const allDayEvents = dayEvents.filter(
                          (event) => !getTimeFromDate(event.date)
                        );
                        const isToday = dateString === getTodayString();

                        return (
                          <div
                            key={dayIndex}
                            className={`p-2 min-h-[60px] border-r border-neutral-700/30 ${
                              isToday ? "bg-blue-500/10" : "bg-neutral-900/30"
                            } ${
                              dragOverTarget === dateString
                                ? "bg-blue-500/20 border-blue-500"
                                : ""
                            }`}
                            onDragOver={(e) =>
                              handleDateDragOver(e, dateString)
                            }
                            onDragLeave={() => setDragOverTarget(null)}
                            onDrop={(e) => handleDateDrop(e, dateString)}
                          >
                            <div className="space-y-1">
                              {allDayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, event)}
                                  onDragEnd={handleDragEnd}
                                  onClick={() => handleEventClick(event)}
                                  className={`p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                                    eventTypeColors[event.type]
                                  } text-white`}
                                >
                                  <div className="font-medium truncate">
                                    {event.title}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Time slots - 2-hour intervals */}
                      {Array.from({ length: 12 }, (_, timeSlot) => {
                        const startHour = timeSlot * 2;
                        const endHour = startHour + 2;
                        const timeSlots = [];

                        // Hour row
                        timeSlots.push(
                          <div
                            key={`hour-${startHour}`}
                            className="bg-neutral-800/50 p-3 border-r border-t border-neutral-700/30 flex items-start"
                          >
                            <div className="text-xs font-medium text-[#FEEBD8]/70">
                              <div>
                                {startHour === 0
                                  ? "12 AM"
                                  : startHour < 12
                                  ? `${startHour} AM`
                                  : startHour === 12
                                  ? "12 PM"
                                  : `${startHour - 12} PM`}
                              </div>
                              <div className="text-[#FEEBD8]/50 text-xs">
                                {endHour === 0
                                  ? "12 AM"
                                  : endHour < 12
                                  ? `${endHour} AM`
                                  : endHour === 12
                                  ? "12 PM"
                                  : `${endHour - 12} PM`}
                              </div>
                            </div>
                          </div>
                        );

                        // Day columns for this time slot
                        getWeekDays().forEach((day, dayIndex) => {
                          const dateString = formatDateString(day);
                          const dayEvents = getEventsForDate(dateString);
                          // Get events within this 2-hour window
                          const timeSlotEvents = dayEvents.filter((event) => {
                            const eventTime = getTimeFromDate(event.date);
                            if (!eventTime) return false;
                            const eventHour = parseInt(eventTime.split(":")[0]);
                            return (
                              eventHour >= startHour && eventHour < endHour
                            );
                          });
                          const isToday = dateString === getTodayString();

                          timeSlots.push(
                            <div
                              key={`${startHour}-${dayIndex}`}
                              className={`p-2 min-h-[80px] border-r border-t border-neutral-700/30 relative ${
                                isToday
                                  ? "bg-blue-500/5"
                                  : "hover:bg-neutral-800/30"
                              } ${
                                dragOverTarget === dateString
                                  ? "bg-blue-500/20"
                                  : ""
                              }`}
                              onDragOver={(e) =>
                                handleDateDragOver(e, dateString)
                              }
                              onDragLeave={() => setDragOverTarget(null)}
                              onDrop={(e) =>
                                handleDateDrop(e, dateString, startHour)
                              }
                              onClick={() => {
                                setSelectedDate(dateString);
                                setSelectedTime(
                                  `${startHour.toString().padStart(2, "0")}:00`
                                );
                                setIsAddEventModalOpen(true);
                              }}
                            >
                              <div className="space-y-1">
                                {timeSlotEvents.map((event) => (
                                  <div
                                    key={event.id}
                                    draggable
                                    onDragStart={(e) =>
                                      handleDragStart(e, event)
                                    }
                                    onDragEnd={handleDragEnd}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEventClick(event);
                                    }}
                                    className={`p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity relative z-10 ${
                                      eventTypeColors[event.type]
                                    } text-white`}
                                  >
                                    <div className="font-medium truncate">
                                      {event.title}
                                    </div>
                                    <div className="text-xs opacity-90">
                                      {getTimeFromDate(event.date)}
                                    </div>
                                    {event.college && (
                                      <div className="text-xs opacity-75 truncate">
                                        {getFormattedCollegeName(event)}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Hover indicator for adding events */}
                              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FaPlus className="text-[#FEEBD8]/30 text-xs" />
                              </div>
                            </div>
                          );
                        });

                        return timeSlots;
                      }).flat()}
                    </div>
                  </div>
                </div>

                {/* Week Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-800/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      This Week
                    </h4>
                    <div className="text-2xl font-bold text-[#FEEBD8]">
                      {getWeekDays().reduce((total, day) => {
                        const dateString = formatDateString(day);
                        return total + getEventsForDate(dateString).length;
                      }, 0)}
                    </div>
                    <div className="text-xs text-[#FEEBD8]/60">
                      Total Events
                    </div>
                  </div>

                  <div className="bg-neutral-800/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      Deadlines
                    </h4>
                    <div className="text-2xl font-bold text-red-400">
                      {getWeekDays().reduce((total, day) => {
                        const dateString = formatDateString(day);
                        return (
                          total +
                          getEventsForDate(dateString).filter(
                            (e) => e.type === EventType.APPLICATION_DEADLINE
                          ).length
                        );
                      }, 0)}
                    </div>
                    <div className="text-xs text-[#FEEBD8]/60">This Week</div>
                  </div>

                  <div className="bg-neutral-800/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      Interviews
                    </h4>
                    <div className="text-2xl font-bold text-blue-400">
                      {getWeekDays().reduce((total, day) => {
                        const dateString = formatDateString(day);
                        return (
                          total +
                          getEventsForDate(dateString).filter(
                            (e) => e.type === EventType.INTERVIEW
                          ).length
                        );
                      }, 0)}
                    </div>
                    <div className="text-xs text-[#FEEBD8]/60">This Week</div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "list" && (
              <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
                {/* List Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#FEEBD8]">
                    All Events
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-4 py-2 text-sm bg-neutral-700/30 hover:bg-neutral-700/50 rounded-lg transition-colors text-[#FEEBD8]"
                    >
                      Today
                    </button>
                  </div>
                </div>

                {/* Events List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {getAllEventsSorted().map((event) => {
                    const daysUntil = event.date
                      ? getDaysUntilEvent(event.date)
                      : -1;
                    const isUrgent = daysUntil <= 3 && daysUntil >= 0;
                    const isPast = daysUntil < 0;

                    return (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleEventClick(event)}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-neutral-800/50 transition-colors ${
                          isUrgent
                            ? "border-red-500/50 bg-red-500/10"
                            : isPast
                            ? "border-neutral-700/30 opacity-60"
                            : "border-neutral-700/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  eventTypeColors[event.type]
                                }`}
                              ></div>
                              <h3 className="font-semibold text-[#FEEBD8]">
                                {event.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  event.priority === EventPriority.HIGH
                                    ? "bg-red-500/20 text-red-400"
                                    : event.priority === EventPriority.MEDIUM
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {event.priority}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-[#FEEBD8]/70 mb-2">
                              {event.date ? (
                                <div className="flex items-center gap-1">
                                  <FaCalendar size={12} />
                                  {new Date(event.date).toLocaleDateString()}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <FaInbox size={12} />
                                  No date set
                                </div>
                              )}

                              {getTimeFromDate(event.date) && (
                                <div className="flex items-center gap-1">
                                  <FaClock size={12} />
                                  {getTimeFromDate(event.date)}
                                </div>
                              )}

                              {event.college && (
                                <div className="flex items-center gap-1">
                                  <FaUniversity size={12} />
                                  {getFormattedCollegeName(event)}
                                </div>
                              )}
                            </div>

                            {event.description && (
                              <p className="text-sm text-[#FEEBD8]/60 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {isUrgent && (
                              <div className="flex items-center gap-1 text-red-400 text-xs">
                                <FaExclamationTriangle size={12} />
                                {daysUntil === 0
                                  ? "Today"
                                  : `${daysUntil} days`}
                              </div>
                            )}
                            <FaGripVertical
                              className="text-[#FEEBD8]/30"
                              size={12}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {events.length === 0 && (
                    <div className="text-center py-12">
                      <FaCalendar className="mx-auto text-4xl text-[#FEEBD8]/30 mb-4" />
                      <h3 className="text-lg font-medium text-[#FEEBD8]/70 mb-2">
                        No events yet
                      </h3>
                      <p className="text-[#FEEBD8]/50">
                        Create your first event to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#FEEBD8] mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {getUpcomingEvents().map((event) => {
                  const daysUntil = event.date
                    ? getDaysUntilEvent(event.date)
                    : -1;
                  const isUrgent = daysUntil <= 3 && daysUntil >= 0;

                  return (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 rounded-lg border-l-4 ${
                        priorityColors[event.priority]
                      } bg-neutral-800/30 ${
                        isUrgent ? "ring-1 ring-red-500/30" : ""
                      } cursor-move hover:bg-neutral-800/50 transition-colors group`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <FaGripVertical className="text-[#FEEBD8]/30 group-hover:text-[#FEEBD8]/60 transition-colors" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {event.type ===
                                EventType.APPLICATION_DEADLINE && (
                                <FaClock className="text-red-400 text-sm" />
                              )}
                              {event.type === EventType.INTERVIEW && (
                                <FaUniversity className="text-blue-400 text-sm" />
                              )}
                              {event.type === EventType.REMINDER && (
                                <FaPen className="text-yellow-400 text-sm" />
                              )}
                              <h4 className="font-medium text-[#FEEBD8] text-sm">
                                {event.title}
                              </h4>
                            </div>
                            <p className="text-[#FEEBD8]/60 text-xs">
                              {getFormattedCollegeName(event)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[#FEEBD8]/70 text-xs">
                                {event.date
                                  ? new Date(event.date).toLocaleDateString()
                                  : "No date"}
                              </span>
                              {getTimeFromDate(event.date) && (
                                <span className="text-[#FEEBD8]/70 text-xs">
                                  at {getTimeFromDate(event.date)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isUrgent && (
                            <FaExclamationTriangle className="text-red-400 text-sm" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setIsEditEventModalOpen(true);
                            }}
                            className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
                          >
                            <FaEdit size={12} />
                          </button>
                        </div>
                      </div>
                      {daysUntil >= 0 && (
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              daysUntil === 0
                                ? "bg-red-500/20 text-red-400"
                                : daysUntil <= 3
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {daysUntil === 0
                              ? "Today"
                              : daysUntil === 1
                              ? "Tomorrow"
                              : `${daysUntil} days`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inbox Section */}
            <div
              className={`bg-[#141414] border border-neutral-700/50 rounded-lg p-6 transition-colors ${
                dragOverTarget === "inbox"
                  ? "bg-green-500/10 border-green-500/50"
                  : ""
              }`}
              onDragOver={handleInboxDragOver}
              onDrop={handleInboxDrop}
              onDragLeave={() => setDragOverTarget(null)}
            >
              <div className="flex items-center gap-2 mb-4">
                <FaInbox className="text-[#FEEBD8]" />
                <h3 className="text-xl font-semibold text-[#FEEBD8]">Inbox</h3>
                <span className="text-sm text-[#FEEBD8]/50">
                  ({getUndatedEvents().length} undated)
                </span>
                {dragOverTarget === "inbox" && (
                  <span className="text-xs text-green-400 ml-2">
                    Drop here to remove date
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {getUndatedEvents().length === 0 ? (
                  <p className="text-[#FEEBD8]/50 text-sm italic">
                    {draggedEvent
                      ? "Drop events here to remove their dates"
                      : "No undated events"}
                  </p>
                ) : (
                  getUndatedEvents().map((event) => (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 rounded-lg border-l-4 ${
                        priorityColors[event.priority]
                      } bg-neutral-800/30 cursor-move hover:bg-neutral-800/50 transition-colors group`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <FaGripVertical className="text-[#FEEBD8]/30 group-hover:text-[#FEEBD8]/60 transition-colors" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {event.type ===
                                EventType.APPLICATION_DEADLINE && (
                                <FaClock className="text-red-400 text-sm" />
                              )}
                              {event.type === EventType.INTERVIEW && (
                                <FaUniversity className="text-blue-400 text-sm" />
                              )}
                              {event.type === EventType.REMINDER && (
                                <FaPen className="text-yellow-400 text-sm" />
                              )}
                              <h4 className="font-medium text-[#FEEBD8] text-sm">
                                {event.title}
                              </h4>
                            </div>
                            {event.college && (
                              <p className="text-[#FEEBD8]/60 text-xs">
                                {getFormattedCollegeName(event)}
                              </p>
                            )}
                            <p className="text-[#FEEBD8]/50 text-xs mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setIsEditEventModalOpen(true);
                          }}
                          className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors"
                        >
                          <FaEdit size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#FEEBD8] mb-4">
                Event Types
              </h3>
              <div className="space-y-2">
                {Object.entries(eventTypeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${color}`}></div>
                    <span className="text-[#FEEBD8]/70 text-sm capitalize">
                      {type.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Date Events Modal */}
      {showDateEventsModal && expandedDateEvents && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={handleCloseDateEventsModal}
        >
          <div
            className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-[#FEEBD8]">
                  Events for{" "}
                  {new Date(expandedDateEvents).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-sm text-[#FEEBD8]/60 mt-1">
                  {getEventsForDate(expandedDateEvents).length} event
                  {getEventsForDate(expandedDateEvents).length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={handleCloseDateEventsModal}
                className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {getEventsForDate(expandedDateEvents)
                .sort((a, b) => {
                  // Sort by time if both have time, otherwise by priority
                  const aTime = getTimeFromDate(a.date);
                  const bTime = getTimeFromDate(b.date);
                  if (aTime && bTime) {
                    return aTime.localeCompare(bTime);
                  }
                  if (aTime && !bTime) return -1;
                  if (!aTime && bTime) return 1;

                  // Sort by priority: HIGH -> MEDIUM -> LOW
                  const priorityOrder = {
                    [EventPriority.HIGH]: 0,
                    [EventPriority.MEDIUM]: 1,
                    [EventPriority.LOW]: 2,
                  };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map((event) => {
                  const isToday =
                    expandedDateEvents ===
                    new Date().toISOString().split("T")[0];
                  const eventDateTime = event.date
                    ? new Date(event.date)
                    : null;
                  const isUpcoming =
                    eventDateTime && eventDateTime > new Date();
                  const isPast = eventDateTime && eventDateTime < new Date();

                  return (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onDragEnd={handleDragEnd}
                      className={`p-3 rounded-lg border-l-4 ${
                        priorityColors[event.priority]
                      } bg-neutral-800/30 cursor-move hover:bg-neutral-800/50 transition-colors group ${
                        isPast && isToday ? "opacity-60" : ""
                      }`}
                      onClick={() => {
                        handleEventClick(event);
                        handleCloseDateEventsModal();
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <FaGripVertical className="text-[#FEEBD8]/30 group-hover:text-[#FEEBD8]/60 transition-colors" />
                          <div
                            className={`w-3 h-3 rounded ${
                              eventTypeColors[event.type]
                            } flex-shrink-0`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {event.type ===
                                EventType.APPLICATION_DEADLINE && (
                                <FaClock className="text-red-400 text-sm" />
                              )}
                              {event.type === EventType.INTERVIEW && (
                                <FaUniversity className="text-blue-400 text-sm" />
                              )}
                              {event.type === EventType.REMINDER && (
                                <FaPen className="text-yellow-400 text-sm" />
                              )}
                              {event.type === EventType.CAMPUS_VISIT && (
                                <FaUniversity className="text-green-400 text-sm" />
                              )}
                              <h4 className="font-medium text-[#FEEBD8] text-sm truncate">
                                {event.title}
                              </h4>
                            </div>
                            {event.college && (
                              <p className="text-[#FEEBD8]/60 text-xs truncate">
                                {getFormattedCollegeName(event)}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {getTimeFromDate(event.date) && (
                                <span className="text-[#FEEBD8]/70 text-xs">
                                  {getTimeFromDate(event.date)}
                                  {isPast && isToday && (
                                    <span className="text-red-400 ml-1">
                                      (past)
                                    </span>
                                  )}
                                  {isUpcoming && isToday && (
                                    <span className="text-green-400 ml-1">
                                      (upcoming)
                                    </span>
                                  )}
                                </span>
                              )}
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  event.priority === EventPriority.HIGH
                                    ? "bg-red-500/20 text-red-400"
                                    : event.priority === EventPriority.MEDIUM
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {event.priority.toLowerCase()}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-[#FEEBD8]/50 text-xs mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setIsEditEventModalOpen(true);
                            handleCloseDateEventsModal();
                          }}
                          className="text-[#FEEBD8]/50 hover:text-[#FEEBD8] transition-colors ml-2"
                        >
                          <FaEdit size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>{" "}
            <div className="mt-4 pt-4 border-t border-neutral-700/50">
              <button
                onClick={() => {
                  setSelectedDate(expandedDateEvents);
                  setIsAddEventModalOpen(true);
                  handleCloseDateEventsModal();
                }}
                className="w-full bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus size={12} />
                Add Event for This Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => {
          setIsAddEventModalOpen(false);
          setSelectedDate(null);
        }}
        onSave={handleAddEvent}
        selectedDate={selectedDate || undefined}
        selectedTime={selectedTime || undefined}
      />

      <EditEventModal
        isOpen={isEditEventModalOpen}
        onClose={() => {
          setIsEditEventModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => {
          setIsEventDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
