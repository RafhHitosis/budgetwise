// components/AuthForm.js
import React, { useState } from "react";
import { set, ref } from "firebase/database";
import { auth, database } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!isLogin && !confirmPassword) return "Please confirm your password";
    if (!isLogin && confirmPassword !== password)
      return "Passwords do not match";
    return "";
  };

  // Real-time validation
  const handleFieldChange = (field, value) => {
    switch (field) {
      case "email":
        setEmail(value);
        if (touched.email) {
          setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        }
        break;
      case "password":
        setPassword(value);
        if (touched.password) {
          setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        }
        if (touched.confirmPassword && confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(confirmPassword, value),
          }));
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(value, password),
          }));
        }
        break;
    }
  };

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    switch (field) {
      case "email":
        setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(password),
        }));
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(confirmPassword, password),
        }));
        break;
    }
  };

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/weak-password":
        return "Password is too weak";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/invalid-credential":
        return "Invalid email or password";
      default:
        return "An error occurred. Please try again";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      confirmPassword,
      password
    );

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (emailError || passwordError || confirmPasswordError) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userCredential = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      // If user just signed up, save their email to Realtime Database
      if (!isLogin) {
        await saveEmailToDatabase(userCredential.user.uid, email);
      }

      onLogin(userCredential.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({
        general: getFirebaseErrorMessage(error.code),
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEmailToDatabase = async (uid, email) => {
    try {
      await set(ref(database, `userEmails/${uid}`), email);
    } catch (error) {
      console.error("Error saving email to database:", error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    setConfirmPassword("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: "#1A1A1A" }}
    >
      <div className="w-full max-w-md transform transition-all duration-500 hover:scale-105">
        {/* Main Card */}
        <div
          className="p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-sm"
          style={{
            backgroundColor: "#2D2D2D",
            border: "1px solid #4A3426",
          }}
        >
          {/* Decorative Background Elements */}
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-20"
            style={{
              background:
                "linear-gradient(to bottom left, #6B4C35, transparent)",
            }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12 opacity-20"
            style={{
              background: "linear-gradient(to top right, #4A3426, transparent)",
            }}
          ></div>

          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg transform transition-transform duration-300 hover:rotate-12"
              style={{
                background:
                  "linear-gradient(to bottom right, #6B4C35, #4A3426)",
              }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: "#F8F4E1" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-2 transition-all duration-300"
              style={{ color: "#F8F4E1" }}
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm" style={{ color: "#D4C4A8" }}>
              {isLogin ? "Sign in to continue" : "Join us today"}
            </p>
          </div>

          {/* General Error Display */}
          {errors.general && (
            <div
              className="mb-6 p-4 rounded-xl border-l-4 relative z-10"
              style={{
                backgroundColor: "#4A3426",
                borderLeftColor: "#ef4444",
                color: "#F8F4E1",
              }}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email Input */}
            <div className="group">
              <label
                className="block text-sm font-medium mb-2 transition-colors duration-200"
                style={{ color: "#F8F4E1" }}
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  className={`w-full px-4 py-3 sm:py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#FF8F00] transition-all duration-300 text-sm sm:text-base ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:ring-opacity-50"
                  }`}
                  style={{
                    backgroundColor: "#2D2D2D",
                    borderColor: errors.email ? "#ef4444" : "#4A3426",
                    color: "#F8F4E1",
                    focusBorderColor: errors.email ? "#ef4444" : "#6B4C35",
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 transition-colors duration-200"
                    style={{ color: errors.email ? "#ef4444" : "#D4C4A8" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="group">
              <label
                className="block text-sm font-medium mb-2 transition-colors duration-200"
                style={{ color: "#F8F4E1" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("password")}
                  className={`w-full px-4 py-3 sm:py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#FF8F00] transition-all duration-300 text-sm sm:text-base ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "focus:ring-opacity-50"
                  }`}
                  style={{
                    backgroundColor: "#2D2D2D",
                    borderColor: errors.password ? "#ef4444" : "#4A3426",
                    color: "#F8F4E1",
                    focusBorderColor: errors.password ? "#ef4444" : "#6B4C35",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 focus:outline-none"
                  style={{ color: errors.password ? "#ef4444" : "#D4C4A8" }}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input (Only for Sign Up) */}
            {!isLogin && (
              <div className="group">
                <label
                  className="block text-sm font-medium mb-2 transition-colors duration-200"
                  style={{ color: "#F8F4E1" }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleFieldChange("confirmPassword", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("confirmPassword")}
                    className={`w-full px-4 py-3 sm:py-4 rounded-2xl border-2 focus:outline-none focus:ring-4 focus:ring-[#FF8F00] transition-all duration-300 text-sm sm:text-base ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "focus:ring-opacity-50"
                    }`}
                    style={{
                      backgroundColor: "#2D2D2D",
                      borderColor: errors.confirmPassword
                        ? "#ef4444"
                        : "#4A3426",
                      color: "#F8F4E1",
                      focusBorderColor: errors.confirmPassword
                        ? "#ef4444"
                        : "#6B4C35",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 focus:outline-none"
                    style={{
                      color: errors.confirmPassword ? "#ef4444" : "#D4C4A8",
                    }}
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 px-6 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base relative overflow-hidden group"
              style={{
                background: "linear-gradient(to right, #6B4C35, #4A3426)",
                color: "#F8F4E1",
                focusRingColor: "#6B4C35",
              }}
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className="w-4 h-4 border-2 border-opacity-30 border-t-current rounded-full animate-spin"
                      style={{ borderColor: "#F8F4E1" }}
                    ></div>
                    <span>Please wait...</span>
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(to right, #4A3426, #2D1810)",
                }}
              ></div>
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-8 text-center relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: "#4A3426" }}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-4 rounded-full"
                  style={{
                    backgroundColor: "#6B4C35",
                    color: "#F8F4E1",
                  }}
                >
                  or
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleMode}
              className="mt-4 font-medium transition-all duration-300 hover:underline decoration-2 underline-offset-4 text-sm sm:text-base transform hover:scale-105"
              style={{ color: "#D4C4A8" }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
