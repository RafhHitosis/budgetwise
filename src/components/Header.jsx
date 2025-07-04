// components/Header.js
import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Download, Menu, X, Clock, LogOut } from "lucide-react";

const Header = ({
  user,
  handleSignOut,
  currentDateTime,
  mobileMenuOpen,
  setMobileMenuOpen,
  setShowExportReport,
  budgets,
}) => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const formatDate = (date) => {
    return date.toLocaleDateString("en-PH", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateTime = (date) => {
    return `${formatDate(date)} | ${formatTime(date)}`;
  };

  const formatMobileDate = (date) => {
    return date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });
  };

  const formatMobileTime = (date) => {
    return date.toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <header
      className="shadow-lg border-b sticky top-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: colors.surface,
        borderBottomColor: colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo Section - Enhanced with Animation */}
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div
                className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 flex-shrink-0"
                style={{ backgroundColor: "#74512D" }}
              >
                <span
                  className="text-xl sm:text-3xl font-semibold"
                  style={{ color: "#F8F4E1" }}
                >
                  ₱
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-base sm:text-2xl font-bold truncate"
                  style={{ color: colors.text }}
                >
                  Expense Tracker
                </h1>
                {/* Mobile Date and Time - Always Visible */}
                <div className="lg:hidden flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3" style={{ color: colors.text }} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: colors.text }}
                  >
                    {formatMobileDate(currentDateTime)} •{" "}
                    {formatMobileTime(currentDateTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: colors.accent,
                color: colors.text,
              }}
              title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isDarkMode ? "Light" : "Dark"}
              </span>
            </button>

            {/* Combined Date and Time Display */}
            <div
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-sm transform hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            >
              <span className="text-sm font-medium">
                {formatDateTime(currentDateTime)}
              </span>
            </div>

            {/* Export Button */}
            <button
              onClick={() => setShowExportReport(true)}
              disabled={Object.keys(budgets).length === 0}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: colors.buttonPrimary,
                color: colors.text,
              }}
              title="Export Report"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>

            <span
              className="text-sm max-w-[150px] truncate px-3 py-2 rounded-lg"
              style={{
                color: colors.text,
                backgroundColor: colors.surface,
              }}
            >
              Welcome, {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
              style={{
                backgroundColor: colors.buttonSecondary,
                color: colors.text,
              }}
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 sm:p-3 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 flex-shrink-0"
              style={{
                backgroundColor: colors.accent,
                color: "white",
              }}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Enhanced */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden animate-slide-down px-4 py-6 space-y-6"
            style={{
              backgroundColor: colors.surface,
              borderTop: `1px solid ${colors.border}`,
              borderRadius: "0 0 1rem 1rem",
            }}
          >
            {/* User Info */}
            <div
              className="text-center p-3 rounded-xl font-medium"
              style={{
                backgroundColor: colors.cardBg,
                color: colors.text,
              }}
            >
              👋 Welcome, {user.email}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: colors.accent,
                  color: isDarkMode ? "#F8F4E1" : "#ffffff",
                }}
              >
                <span className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>

              {/* Export Report */}
              <button
                onClick={() => {
                  setShowExportReport(true);
                  setMobileMenuOpen(false);
                }}
                disabled={Object.keys(budgets).length === 0}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
                style={{
                  backgroundColor: colors.secondary,
                  color: isDarkMode ? "#F8F4E1" : "#ffffff",
                }}
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </span>
              </button>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: colors.primary,
                  color: isDarkMode ? "#F8F4E1" : "#ffffff",
                }}
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
