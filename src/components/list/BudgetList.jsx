import React, { useState, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  CalendarDays,
} from "lucide-react";
import BudgetCard from "../cards/BudgetCard";

const BudgetList = ({
  user,
  colors,
  budgets,
  filteredBudgets,
  currentPage,
  handlePageChange,
  handleEditClick,
  handleDeleteBudget,
  searchTerm,
  setSearchTerm,
  currentBudgets,
  totalPages,
}) => {
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null,
  });
  const [showDateFilter, setShowDateFilter] = useState(false);

  const dateFilterOptions = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "custom", label: "Custom" },
  ];

  const isDateInRange = useCallback(
    (budgetDate, filterType) => {
      if (!budgetDate) return filterType === "all";
      const date = new Date(budgetDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const budgetDateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      switch (filterType) {
        case "all":
          return true;
        case "today":
          return budgetDateOnly.getTime() === today.getTime();
        case "week": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return budgetDateOnly >= weekStart && budgetDateOnly <= weekEnd;
        }
        case "month":
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        case "year":
          return date.getFullYear() === now.getFullYear();
        case "custom": {
          if (!customDateRange.start || !customDateRange.end) return true;
          const start = new Date(customDateRange.start);
          const end = new Date(customDateRange.end);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return budgetDateOnly >= start && budgetDateOnly <= end;
        }
        default:
          return true;
      }
    },
    [customDateRange.start, customDateRange.end]
  );

  // Apply date filter to the filtered budgets
  const dateFilteredBudgets = useMemo(() => {
    if (dateFilter === "all") return currentBudgets;
    return currentBudgets.filter(([, budget]) =>
      isDateInRange(budget.date, dateFilter)
    );
  }, [currentBudgets, dateFilter, isDateInRange]);

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    if (value !== "custom") {
      setCustomDateRange({ start: null, end: null });
    }
  };

  const clearDateFilter = () => {
    setDateFilter("all");
    setCustomDateRange({ start: null, end: null });
  };

  const getFilterSummary = () => {
    if (
      dateFilter === "custom" &&
      customDateRange.start &&
      customDateRange.end
    ) {
      return `${customDateRange.start.toLocaleDateString()} - ${customDateRange.end.toLocaleDateString()}`;
    }
    return (
      dateFilterOptions.find((opt) => opt.value === dateFilter)?.label || "All"
    );
  };

  const isDarkMode = colors.text === "#FFFFFF" || colors.text === "white";

  return (
    <div className="space-y-4">
      {/* DatePicker Styles */}
      <style>{`
        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        @media (max-width: 768px) {
          .react-datepicker-popper {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90vw !important;
            max-width: 320px !important;
          }
        }

        .react-datepicker {
          background-color: ${colors.cardBg} !important;
          border: 1px solid ${colors.border} !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, ${
            isDarkMode ? "0.6" : "0.15"
          }) !important;
          font-family: inherit !important;
          font-size: 16px !important;
          overflow: hidden !important;
          animation: datePickerFadeIn 0.2s ease-out !important;
        }

        @keyframes datePickerFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .react-datepicker__header {
          background-color: ${colors.cardBg} !important;
          border-bottom: 1px solid ${colors.border} !important;
          border-radius: 16px 16px 0 0 !important;
          padding: 16px !important;
        }

        .react-datepicker__current-month {
          color: ${colors.text} !important;
          font-weight: 600 !important;
          font-size: 18px !important;
        }

        .react-datepicker__day-name {
          color: ${colors.text} !important;
          font-weight: 500 !important;
          font-size: 14px !important;
        }

        .react-datepicker__day {
          color: ${colors.text} !important;
          border-radius: 8px !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
          margin: 2px !important;
        }

        .react-datepicker__day:hover {
          background-color: ${colors.text}20 !important;
          transform: scale(1.05) !important;
        }

        .react-datepicker__day--selected {
          background-color: ${colors.text} !important;
          color: ${colors.cardBg} !important;
          transform: scale(1.05) !important;
        }

        .react-datepicker__day--disabled {
          color: ${colors.secondaryText} !important;
          opacity: 0.5 !important;
        }

        .react-datepicker__navigation {
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          top: 16px !important;
          transition: all 0.2s ease !important;
        }

        .react-datepicker__navigation:hover {
          transform: scale(1.1) !important;
        }

        .react-datepicker__navigation-icon::before {
          border-color: ${colors.text} !important;
        }

        .react-datepicker__input-container input {
          background-color: ${colors.cardBg} !important;
          color: ${colors.text} !important;
          border: 1px solid ${colors.border} !important;
          border-radius: 8px !important;
          padding: 12px !important;
          font-size: 14px !important;
          width: 100% !important;
          transition: all 0.2s ease !important;
        }

        .react-datepicker__input-container input:focus {
          outline: none !important;
          border-color: ${colors.text} !important;
          box-shadow: 0 0 0 2px ${colors.text}20 !important;
        }

        .react-datepicker__input-container input::placeholder {
          color: ${colors.secondaryText} !important;
        }

        .react-datepicker__triangle {
          display: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" style={{ color: colors.text }}>
          Your Budgets
        </h2>
        {Object.keys(budgets).length > 0 && (
          <div className="text-sm" style={{ color: colors.secondaryText }}>
            {filteredBudgets.length} of {Object.keys(budgets).length}
          </div>
        )}
      </div>

      {Object.keys(budgets).length === 0 ? (
        <div
          className="p-8 rounded-xl text-center"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <p className="text-lg font-medium" style={{ color: colors.text }}>
            No budgets yet. Create your first one!
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="space-y-3">
            <div className="flex gap-2 items-center flex-wrap">
              {/* Search Bar */}
              {Object.keys(budgets).length > 2 && (
                <div className="relative flex-1 min-w-0">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: colors.secondaryText }}
                  />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    name="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                  />
                </div>
              )}

              {/* Date Filter Toggle */}
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: showDateFilter ? colors.text : colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  color: showDateFilter ? colors.cardBg : colors.text,
                }}
              >
                <Calendar className="w-4 h-4" />
                Date
              </button>

              {/* Active Filter Display */}
              {dateFilter !== "all" && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: colors.text + "15",
                    border: `1px solid ${colors.text}30`,
                    color: colors.text,
                  }}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{getFilterSummary()}</span>
                  <button
                    onClick={clearDateFilter}
                    className="hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors duration-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Date Filter Panel */}
            {showDateFilter && (
              <div
                className="p-4 rounded-xl space-y-4"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  boxShadow: `0 8px 24px ${colors.text}10`,
                }}
              >
                {/* Quick Filters */}
                <div className="grid grid-cols-3 gap-2">
                  {dateFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDateFilterChange(option.value)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundColor:
                          dateFilter === option.value
                            ? colors.text
                            : "transparent",
                        color:
                          dateFilter === option.value
                            ? colors.cardBg
                            : colors.text,
                        border: `1px solid ${
                          dateFilter === option.value
                            ? colors.text
                            : colors.border
                        }`,
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range Picker */}
                {dateFilter === "custom" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: colors.text }}
                        >
                          Start Date
                        </label>
                        <DatePicker
                          selected={customDateRange.start}
                          onChange={(date) =>
                            setCustomDateRange((prev) => ({
                              ...prev,
                              start: date,
                              end:
                                prev.end && date > prev.end ? null : prev.end,
                            }))
                          }
                          selectsStart
                          startDate={customDateRange.start}
                          endDate={customDateRange.end}
                          maxDate={new Date()}
                          placeholderText="Select start date"
                          dateFormat="MMM dd, yyyy"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center mb-2 gap-1">
                          <label
                            className="text-sm font-medium"
                            style={{ color: colors.text }}
                          >
                            End Date
                          </label>
                          <p
                            className="text-xs"
                            style={{ color: colors.text, opacity: 0.5 }}
                          >
                            (Select Start Date First)
                          </p>
                        </div>
                        <DatePicker
                          selected={customDateRange.end}
                          onChange={(date) =>
                            setCustomDateRange((prev) => ({
                              ...prev,
                              end: date,
                            }))
                          }
                          selectsEnd
                          startDate={customDateRange.start}
                          endDate={customDateRange.end}
                          minDate={customDateRange.start}
                          maxDate={new Date()}
                          disabled={!customDateRange.start}
                          placeholderText="Select end date"
                          dateFormat="MMM dd, yyyy"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* No Results */}
          {dateFilteredBudgets.length === 0 && dateFilter !== "all" && (
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px dashed ${colors.border}`,
              }}
            >
              <p className="font-medium mb-3" style={{ color: colors.text }}>
                No budgets found for selected date range
              </p>
              <button
                onClick={clearDateFilter}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: colors.text,
                  color: colors.cardBg,
                }}
              >
                Clear Date Filter
              </button>
            </div>
          )}

          {/* Budget Cards */}
          {dateFilteredBudgets.length > 0 && (
            <>
              <div className="space-y-3">
                {dateFilteredBudgets.map(([id, budget]) => (
                  <div
                    key={id}
                    className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                    style={{ backgroundColor: "#F8F4E1" }}
                  >
                    <BudgetCard
                      user={user}
                      colors={colors}
                      budget={budget}
                      onEdit={() => handleEditClick(budget)}
                      onDelete={() => handleDeleteBudget(id)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 rounded text-sm font-medium transition-all duration-200 cursor-pointer"
                          style={{
                            backgroundColor: isActive
                              ? colors.text
                              : colors.cardBg,
                            color: isActive ? colors.cardBg : colors.text,
                            border: `1px solid ${
                              isActive ? colors.text : colors.border
                            }`,
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Page Info */}
              {totalPages > 1 && (
                <div
                  className="text-center text-sm mt-4"
                  style={{ color: colors.secondaryText }}
                >
                  Page {currentPage} of {totalPages} • Showing{" "}
                  {currentBudgets.length} budgets
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BudgetList;
