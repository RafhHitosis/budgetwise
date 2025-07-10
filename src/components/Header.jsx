import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeProvider";
import {
  Moon,
  Sun,
  Download,
  Menu,
  X,
  Clock,
  LogOut,
  KeyRound,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import ChangePassword from "./ChangePassword"; // Import the new component

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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // New state
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get first letter of email for profile avatar
  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  // Consolidated date/time formatting
  const formatDateTime = (date, isMobile = false) => {
    const dateOptions = isMobile
      ? { month: "short", day: "numeric" }
      : { weekday: "short", year: "numeric", month: "short", day: "numeric" };

    const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

    const formattedDate = date.toLocaleDateString("en-PH", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-PH", timeOptions);

    return isMobile
      ? `${formattedDate} • ${formattedTime}`
      : `${formattedDate} | ${formattedTime}`;
  };

  const handleExportClick = () => {
    setShowExportReport(true);
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleSignOutClick = () => {
    setProfileDropdownOpen(false);
    handleSignOut();
  };

  // New function to handle change password
  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="shadow-lg border-b sticky top-0 z-40 transition-all duration-300 backdrop-blur-md"
        style={{
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo Section */}
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Mobile Logo (unchanged) */}
                <div className="lg:hidden">
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
                </div>

                {/* Desktop Logo (modernized) */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm"
                    style={{ backgroundColor: "#74512D" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#F8F4E1" }}
                    >
                      ₱
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h1
                      className="text-lg font-bold leading-none"
                      style={{ color: colors.text }}
                    >
                      Expense Tracker
                    </h1>
                    <span
                      className="text-xs font-medium opacity-70"
                      style={{ color: colors.textSecondary }}
                    >
                      Personal Finance Manager
                    </span>
                  </div>
                </div>

                {/* Mobile Title and Date (unchanged) */}
                <div className="lg:hidden min-w-0 flex-1">
                  <h1
                    className="text-base sm:text-2xl font-bold truncate"
                    style={{ color: colors.text }}
                  >
                    Expense Tracker
                  </h1>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3 h-3" style={{ color: colors.text }} />
                    <span
                      className="text-xs font-medium"
                      style={{ color: colors.text }}
                    >
                      {formatDateTime(currentDateTime, true)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation (modernized) */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Date and Time Display */}
              <div
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-opacity-20"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <Clock
                  className="w-4 h-4"
                  style={{ color: colors.textSecondary }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {formatDateTime(currentDateTime)}
                </span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-opacity-20 hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportClick}
                disabled={Object.keys(budgets).length === 0}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-opacity-20 hover:shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                style={{
                  backgroundColor: colors.buttonPrimary,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                title="Export Report"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-opacity-20 hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  {/* Profile Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-sm"
                    style={{
                      backgroundColor: colors.buttonPrimary,
                      color: colors.text,
                    }}
                  >
                    {getInitial(user.email)}
                  </div>
                  <span className="text-sm font-medium max-w-32 truncate">
                    {user.email.split("@")[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg border z-50 animate-slide-down backdrop-blur-sm"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <div className="py-2">
                      {/* User Info */}
                      <div
                        className="px-4 py-3 border-b"
                        style={{ borderBottomColor: colors.border }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                            style={{
                              backgroundColor: colors.buttonPrimary,
                              color: colors.text,
                            }}
                          >
                            {getInitial(user.email)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: colors.text }}
                            >
                              {user.email}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: colors.textSecondary }}
                            >
                              Active session
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Change Password Option */}
                      <button
                        onClick={handleChangePasswordClick}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-opacity-80 transition-colors duration-200 cursor-pointer"
                        style={{ color: colors.text }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.cardBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <KeyRound className="w-4 h-4" />
                        <span className="text-sm">Change Password</span>
                      </button>

                      {/* Divider */}
                      <div
                        className="my-1 h-px"
                        style={{ backgroundColor: colors.border }}
                      />

                      {/* Sign Out Option */}
                      <button
                        onClick={handleSignOutClick}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-opacity-80 transition-colors duration-200 cursor-pointer"
                        style={{ color: colors.text }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.cardBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button (unchanged) */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 sm:p-3 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 flex-shrink-0"
                style={{ backgroundColor: colors.accent, color: "white" }}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu (unchanged) */}
          {mobileMenuOpen && (
            <div
              className="lg:hidden animate-slide-down px-4 py-6 space-y-6"
              style={{
                backgroundColor: colors.surface,
                borderTop: `1px solid ${colors.border}`,
                borderRadius: "0 0 1rem 1rem",
              }}
            >
              {/* Enhanced User Profile Card */}
              <div
                className="p-4 rounded-xl shadow-sm"
                style={{ backgroundColor: colors.cardBg, color: colors.text }}
              >
                <div className="flex items-center space-x-3">
                  {/* Profile Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md"
                    style={{
                      backgroundColor: colors.buttonPrimary,
                      color: colors.text,
                    }}
                  >
                    {getInitial(user.email)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-sm font-medium">Welcome back!</span>
                    </div>
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: colors.text }}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Actions Grid */}
              <div className="space-y-4">
                {/* Quick Actions Section */}
                <div>
                  <h3
                    className="text-xs font-semibold uppercase tracking-wide mb-3 px-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="flex flex-col items-center p-4 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: colors.accent,
                        color: isDarkMode ? "#F8F4E1" : "#ffffff",
                      }}
                    >
                      {isDarkMode ? (
                        <Sun className="w-6 h-6 mb-2" />
                      ) : (
                        <Moon className="w-6 h-6 mb-2" />
                      )}
                      <span className="text-sm font-medium">
                        {isDarkMode ? "Light" : "Dark"} Mode
                      </span>
                    </button>

                    {/* Export Report */}
                    <button
                      onClick={handleExportClick}
                      disabled={Object.keys(budgets).length === 0}
                      className="flex flex-col items-center p-4 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-sm"
                      style={{
                        backgroundColor: colors.secondary,
                        color: isDarkMode ? "#F8F4E1" : "#ffffff",
                      }}
                    >
                      <Download className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Export</span>
                    </button>
                  </div>
                </div>

                {/* Account Section */}
                <div>
                  <h3
                    className="text-xs font-semibold uppercase tracking-wide mb-3 px-2"
                    style={{ color: colors.textSecondary }}
                  >
                    Account
                  </h3>
                  <div className="space-y-2">
                    {/* Change Password */}
                    <button
                      onClick={handleChangePasswordClick}
                      className="w-full flex items-center justify-between p-4 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: colors.cardBg,
                        color: colors.text,
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.accent }}
                        >
                          <KeyRound
                            className="w-5 h-5"
                            style={{ color: colors.text }}
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-medium block">
                            Change Password
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            Update your security
                          </span>
                        </div>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.surface }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-between p-4 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                      style={{
                        backgroundColor: colors.primary,
                        color: isDarkMode ? "#F8F4E1" : "#ffffff",
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                          }}
                        >
                          <LogOut className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-medium block">
                            Sign Out
                          </span>
                          <span className="text-xs opacity-80">
                            End your session
                          </span>
                        </div>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Change Password Modal */}
      <ChangePassword
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        user={user}
      />
    </>
  );
};

export default Header;
