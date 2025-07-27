"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddEventModal from "../../../components/Modals/AddEventModal";
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
} from "react-icons/fa";

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: "Harvard Application Deadline",
    date: "2026-01-01",
    time: "23:59",
    type: "deadline",
    college: "Harvard University",
    category: "Application",
    priority: "high",
  },
  {
    id: 2,
    title: "Stanford Essay Due",
    date: "2025-12-15",
    time: "23:59",
    type: "deadline",
    college: "Stanford University",
    category: "Essay",
    priority: "high",
  },
  {
    id: 3,
    title: "MIT Interview",
    date: "2025-11-20",
    time: "14:00",
    type: "interview",
    college: "MIT",
    category: "Interview",
    priority: "medium",
  },
  {
    id: 4,
    title: "Personal Statement Review",
    date: "2025-11-15",
    time: "10:00",
    type: "reminder",
    college: "Multiple",
    category: "Essay",
    priority: "medium",
  },
  {
    id: 5,
    title: "SAT Registration Deadline",
    date: "2025-11-30",
    time: "23:59",
    type: "deadline",
    college: "General",
    category: "Testing",
    priority: "high",
  },
  {
    id: 6,
    title: "NYU Campus Visit",
    date: "2025-12-05",
    time: "09:00",
    type: "visit",
    college: "New York University",
    category: "Visit",
    priority: "low",
  },
];

const eventTypeColors: Record<string, string> = {
  deadline: "bg-red-500",
  interview: "bg-blue-500",
  reminder: "bg-yellow-500",
  visit: "bg-green-500",
  test: "bg-purple-500",
};

const priorityColors: Record<string, string> = {
  high: "border-red-500",
  medium: "border-yellow-500",
  low: "border-green-500",
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [events, setEvents] = useState(mockEvents);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Calendar & Deadlines | Paccy";
  }, []);

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
    return events.filter((event) => event.date === date);
  };

  const getDaysUntilEvent = (eventDate: string) => {
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUpcomingEvents = () => {
    return events
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const handleAddEvent = (newEvent: any) => {
    const eventWithId = {
      ...newEvent,
      id: events.length + 1,
    };
    setEvents((prev) => [...prev, eventWithId]);
  };

  const renderCalendarDays = () => {
    const days: React.ReactElement[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-neutral-700/30"
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
          className={`h-24 border border-neutral-700/30 p-1 ${
            isToday
              ? "bg-[#FEEBD8]/10 border-[#FEEBD8]/50"
              : "hover:bg-neutral-800/30"
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-[#FEEBD8]" : "text-[#FEEBD8]/70"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                  eventTypeColors[event.type]
                }`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-[#FEEBD8]/50">
                +{dayEvents.length - 2} more
              </div>
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
                Calendar & Deadlines
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2">
                Never miss an important date
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Event</span>
          </button>
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
                    getDaysUntilEvent(e.date) <= 7 &&
                    getDaysUntilEvent(e.date) > 0
                ).length
              }
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">This Week</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {events.filter((e) => e.type === "deadline").length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Deadlines</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {events.filter((e) => e.type === "interview").length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Interviews</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#FEEBD8]">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth("prev")}
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
                  (day) => (
                    <div
                      key={day}
                      className="bg-neutral-800 p-3 text-center text-sm font-medium text-[#FEEBD8]/70 border-b border-neutral-700/30"
                    >
                      {day}
                    </div>
                  )
                )}

                {/* Calendar days */}
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#FEEBD8] mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {getUpcomingEvents().map((event) => {
                  const daysUntil = getDaysUntilEvent(event.date);
                  const isUrgent = daysUntil <= 3 && daysUntil >= 0;

                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        priorityColors[event.priority]
                      } bg-neutral-800/30 ${
                        isUrgent ? "ring-1 ring-red-500/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {event.type === "deadline" && (
                              <FaClock className="text-red-400 text-sm" />
                            )}
                            {event.type === "interview" && (
                              <FaUniversity className="text-blue-400 text-sm" />
                            )}
                            {event.type === "reminder" && (
                              <FaPen className="text-yellow-400 text-sm" />
                            )}
                            <h4 className="font-medium text-[#FEEBD8] text-sm">
                              {event.title}
                            </h4>
                          </div>
                          <p className="text-[#FEEBD8]/60 text-xs">
                            {event.college}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#FEEBD8]/70 text-xs">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            {event.time && (
                              <span className="text-[#FEEBD8]/70 text-xs">
                                at {event.time}
                              </span>
                            )}
                          </div>
                        </div>
                        {isUrgent && (
                          <FaExclamationTriangle className="text-red-400 text-sm" />
                        )}
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
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSave={handleAddEvent}
      />
    </div>
  );
}
