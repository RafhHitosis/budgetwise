import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeProvider";
import {
  X,
  Eye,
  EyeOff,
  KeyRound,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

const ChangePassword = ({ isOpen, onClose, user }) => {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [checkingCurrentPassword, setCheckingCurrentPassword] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, message: "" };

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach((check) => check && strength++);

    const messages = {
      0: "Very Weak",
      1: "Weak",
      2: "Fair",
      3: "Good",
      4: "Strong",
      5: "Very Strong",
    };

    const colors = {
      0: "#ef4444",
      1: "#f97316",
      2: "#eab308",
      3: "#22c55e",
      4: "#16a34a",
      5: "#15803d",
    };

    return {
      strength,
      message: messages[strength],
      color: colors[strength],
      checks,
    };
  };

  // Function to validate current password
  const validateCurrentPassword = async (password) => {
    if (!password || password.length < 3) {
      setCurrentPasswordError("");
      return;
    }

    setCheckingCurrentPassword(true);
    setCurrentPasswordError("");

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      setCurrentPasswordError(""); // Password is correct
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setCurrentPasswordError("Current password is incorrect");
      } else if (error.code === "auth/invalid-credential") {
        setCurrentPasswordError("Current password is incorrect");
      } else {
        // Don't show error for other auth issues during validation
        setCurrentPasswordError("");
      }
    } finally {
      setCheckingCurrentPassword(false);
    }
  };

  // Debounce current password validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPassword) {
        validateCurrentPassword(currentPassword);
      } else {
        setCurrentPasswordError("");
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPassword]);

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    // Check if current password validation failed
    if (currentPasswordError) {
      setError("Please enter the correct current password");
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      setSuccess(true);

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordError("");

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Password change error:", error);

      if (error.code === "auth/wrong-password") {
        setError("Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        setError("New password is too weak");
      } else if (error.code === "auth/requires-recent-login") {
        setError("Please sign out and sign in again before changing password");
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
      setCurrentPasswordError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        backgroundColor: colors.overlay,
      }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full mx-4 sm:mx-auto sm:max-w-md transform transition-all duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Header - Optimized for mobile */}
        <div
          className="flex items-center justify-between p-4 sm:p-6 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.accent }}
            >
              <KeyRound
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: colors.text }}
              />
            </div>
            <div>
              <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: colors.text }}
              >
                Change Password
              </h2>
              <p
                className="text-xs sm:text-sm"
                style={{ color: colors.textSecondary }}
              >
                Update your account security
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-opacity-80 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: colors.cardBg }}
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Form - Mobile optimized spacing */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Password changed successfully!
                </p>
                <p className="text-xs text-green-600">Closing in a moment...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-3 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: colors.text }}
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-16 rounded-xl border focus:outline-none focus:ring-2 transition-colors duration-200 text-base ${
                  currentPasswordError
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-amber-700"
                }`}
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: currentPasswordError ? "#ef4444" : colors.border,
                  color: colors.text,
                }}
                placeholder="Enter current password"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {checkingCurrentPassword && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                )}
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="p-1 rounded-full hover:bg-opacity-80 transition-colors duration-200"
                  style={{ backgroundColor: colors.surface }}
                  disabled={loading}
                >
                  {showCurrentPassword ? (
                    <EyeOff
                      className="w-4 h-4"
                      style={{ color: colors.textSecondary }}
                    />
                  ) : (
                    <Eye
                      className="w-4 h-4"
                      style={{ color: colors.textSecondary }}
                    />
                  )}
                </button>
              </div>
            </div>
            {currentPasswordError && (
              <div className="flex items-start space-x-2 p-2 sm:p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{currentPasswordError}</p>
              </div>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: colors.text }}
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200 text-base"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-80 transition-colors duration-200"
                style={{ backgroundColor: colors.surface }}
                disabled={loading}
              >
                {showNewPassword ? (
                  <EyeOff
                    className="w-4 h-4"
                    style={{ color: colors.textSecondary }}
                  />
                ) : (
                  <Eye
                    className="w-4 h-4"
                    style={{ color: colors.textSecondary }}
                  />
                )}
              </button>
            </div>

            {/* Password Strength Indicator - Mobile optimized */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Password Strength
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.message}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                {/* Mobile optimized password requirements */}
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        passwordStrength.checks.length
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      style={{ color: colors.textSecondary }}
                      className="truncate"
                    >
                      8+ chars
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        passwordStrength.checks.uppercase
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      style={{ color: colors.textSecondary }}
                      className="truncate"
                    >
                      Uppercase
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        passwordStrength.checks.lowercase
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      style={{ color: colors.textSecondary }}
                      className="truncate"
                    >
                      Lowercase
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        passwordStrength.checks.number
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      style={{ color: colors.textSecondary }}
                      className="truncate"
                    >
                      Number
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              style={{ color: colors.text }}
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors duration-200 text-base"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-80 transition-colors duration-200"
                style={{ backgroundColor: colors.surface }}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff
                    className="w-4 h-4"
                    style={{ color: colors.textSecondary }}
                  />
                ) : (
                  <Eye
                    className="w-4 h-4"
                    style={{ color: colors.textSecondary }}
                  />
                )}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>Passwords do not match</span>
              </p>
            )}
          </div>

          {/* Security Note - Mobile optimized */}
          <div
            className="flex items-start space-x-3 p-3 sm:p-4 rounded-xl"
            style={{ backgroundColor: colors.cardBg }}
          >
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 mt-0.5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                Security Tip
              </p>
              <p
                className="text-xs mt-1 leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                Choose a strong password with a mix of letters, numbers, and
                symbols. Avoid using personal information or common words.
              </p>
            </div>
          </div>

          {/* Action Buttons - Mobile optimized */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border font-medium transition-colors duration-200 disabled:opacity-50"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                currentPasswordError
              }
              className="w-full sm:flex-1 px-4 py-3 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              style={{
                backgroundColor: colors.buttonPrimary,
                color: colors.text,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Changing...</span>
                </>
              ) : (
                <span>Change Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
