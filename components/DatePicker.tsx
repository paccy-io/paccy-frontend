import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

const months = [
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

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  label,
  error,
  disabled = false,
  minDate,
  maxDate,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [inputValue, setInputValue] = useState("");
  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Update input value when value prop changes
  useEffect(() => {
    if (value) {
      const date = parseDate(value);
      setInputValue(date.toLocaleDateString());
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    } else {
      setInputValue("");
    }
  }, [value]);

  // Calculate calendar position when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const calendarHeight = 320; // Reduced calendar height

      let top = rect.bottom + 8; // 8px gap below input

      // If calendar would go below viewport, position it above the input
      if (top + calendarHeight > viewportHeight) {
        top = rect.top - calendarHeight - 8;
      }

      setCalendarPosition({
        top,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if clicking on the input, container, or calendar
      if (
        containerRef.current?.contains(target) ||
        calendarRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
      setShowMonthSelector(false);
      setShowYearSelector(false);
    };

    const handleScroll = (event: Event) => {
      if (isOpen) {
        const target = event.target as Node;

        // Don't close if scrolling within the calendar or its dropdowns
        if (
          calendarRef.current?.contains(target) ||
          containerRef.current?.contains(target)
        ) {
          return;
        }

        // Only close if scrolling outside the calendar component
        setIsOpen(false);
        setShowMonthSelector(false);
        setShowYearSelector(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
        setShowMonthSelector(false);
        setShowYearSelector(false);
      }
    };

    if (isOpen) {
      // Use a small delay to prevent immediate closing when opening
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
      document.addEventListener("scroll", handleScroll, true);
      document.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const formatDate = (date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string) => {
    // Parse as local date to avoid timezone shifting
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const isDateInRange = (date: Date) => {
    const dateStr = formatDate(date);
    if (minDate && dateStr < minDate) return false;
    if (maxDate && dateStr > maxDate) return false;
    return true;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    return formatDate(date) === value;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Previous month's trailing days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevYear, prevMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isInRange: isDateInRange(date),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isInRange: isDateInRange(date),
      });
    }

    // Next month's leading days
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(nextYear, nextMonth, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isInRange: isDateInRange(date),
      });
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDate(date);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setInputValue("");
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getYearRange = () => {
    const currentYearValue = new Date().getFullYear();
    const startYear = 1950; // Start from 1950 for birth dates and historical academic records
    const endYear = currentYearValue + 10; // Future years for planning
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      // Reverse order for easier recent year access
      years.push(year);
    }
    return years;
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setShowMonthSelector(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setShowYearSelector(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const calendarDays = generateCalendarDays();

  const renderCalendar = () => (
    <div
      ref={calendarRef}
      className="fixed bg-[#141414] border border-neutral-700 rounded-lg shadow-2xl z-[9999] w-[280px]"
      style={{
        top: calendarPosition.top,
        left: calendarPosition.left,
      }}
    >
      {/* Calendar Header */}
      <div className="p-3 border-b border-neutral-700">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-[white]/60 hover:text-[white] transition-colors"
          >
            <FaChevronLeft size={10} />
          </button>

          <div className="flex items-center gap-1">
            {/* Month Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMonthSelector(!showMonthSelector);
                  setShowYearSelector(false);
                }}
                className="text-[white] font-medium text-sm hover:bg-neutral-800 px-2 py-1 rounded-md transition-colors"
              >
                {months[currentMonth]}
              </button>

              {showMonthSelector && (
                <div
                  className="absolute top-full left-0 mt-1 bg-[#141414] border border-neutral-700 rounded-md shadow-xl z-10 max-h-48 overflow-y-auto scrollbar-hide"
                  style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-700 transition-colors ${
                        index === currentMonth
                          ? "bg-[white] text-[#141414] font-medium"
                          : "text-[white]"
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Year Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowYearSelector(!showYearSelector);
                  setShowMonthSelector(false);
                }}
                className="text-[white] font-medium text-sm hover:bg-neutral-800 px-2 py-1 rounded-md transition-colors"
              >
                {currentYear}
              </button>

              {showYearSelector && (
                <div
                  className="absolute top-full right-0 mt-1 bg-[#141414] border border-neutral-700 rounded-md shadow-xl z-10 max-h-48 overflow-y-auto scrollbar-hide"
                  style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {getYearRange().map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-700 transition-colors ${
                        year === currentYear
                          ? "bg-[white] text-[#141414] font-medium"
                          : "text-[white]"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigateMonth("next")}
            className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-[white]/60 hover:text-[white] transition-colors"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="h-6 flex items-center justify-center text-xs font-medium text-[white]/50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => {
            const { date, day, isCurrentMonth, isInRange } = dayData;
            const selected = isSelected(date);
            const today = isToday(date);

            return (
              <button
                key={index}
                onClick={() => isInRange && handleDateSelect(date)}
                disabled={!isInRange}
                className={`
                  h-6 w-6 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center
                  ${
                    !isCurrentMonth
                      ? "text-[white]/20"
                      : isInRange
                      ? "text-[white] hover:bg-neutral-700"
                      : "text-[white]/30 cursor-not-allowed"
                  }
                  ${
                    selected
                      ? "bg-[white] text-[#141414] font-bold shadow-lg"
                      : ""
                  }
                  ${
                    today && !selected
                      ? "ring-1 ring-[white]/50 bg-neutral-800"
                      : ""
                  }
                  ${
                    !selected && isInRange && isCurrentMonth
                      ? "hover:bg-neutral-700 hover:scale-105"
                      : ""
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-neutral-700">
        <div className="flex gap-2">
          <button
            onClick={() => handleDateSelect(new Date())}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-[white] px-2 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-[white] hover:bg-[#E5D5B7] text-[#141414] px-2 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[white]/70 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onClick={handleInputClick}
          readOnly
          disabled={disabled}
          className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 pr-10 text-[white] cursor-pointer focus:outline-none transition-colors ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-neutral-700 focus:border-[white] hover:border-[white]/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && !disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-[white]/40 hover:text-[white]/70 transition-colors"
            >
              <FaTimes size={12} />
            </button>
          )}
          <FaCalendarAlt
            className={`text-[white]/60 ${
              !disabled && "group-hover:text-[white]/80"
            }`}
            size={14}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      {isOpen &&
        !disabled &&
        typeof document !== "undefined" &&
        createPortal(renderCalendar(), document.body)}
    </div>
  );
}
