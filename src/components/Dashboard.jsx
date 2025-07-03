// components/Dashboard.js
import React, { useEffect, useState, useRef } from "react";
import AIAssistantModal from "./AIAssistantModal";
import { Bot } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import {
  Plus,
  Minus,
  Calendar,
  Menu,
  X,
  Download,
  Clock,
  FileText,
  Target,
  LogOut,
} from "lucide-react";
import {
  SummaryCardsSkeleton,
  BudgetsSkeleton,
  ExpensesSkeleton,
  GoalsSkeleton,
  DashboardSkeleton,
  SkeletonStyles,
} from "./SkeletonLoaders";
import BudgetCard from "./BudgetCard";
import BudgetForm from "./BudgetForm";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExportReport from "./ExportReport";
import GoalCard from "./GoalCard";
import GoalForm from "./GoalForm";
import { database } from "../firebase";
import { ref, onValue, push, set, remove, get } from "firebase/database";

const Dashboard = ({ user, onLogout }) => {
  const [budgets, setBudgets] = useState({});
  const [expenses, setExpenses] = useState({});
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [modalTitle, setModalTitle] = useState("Are you sure?");
  const [modalMessage, setModalMessage] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [goals, setGoals] = useState({});
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(true);

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const { isDarkMode, toggleTheme, colors } = useTheme();

  // Refs for auto-scroll
  const budgetFormRef = useRef(null);
  const expenseFormRef = useRef(null);

  // Auto-scroll function
  const scrollToElement = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  // Update current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const budgetsRef = ref(database, `budgets/${user.uid}`);
    const expensesRef = ref(database, `expenses/${user.uid}`);

    setBudgetsLoading(true);
    setExpensesLoading(true);

    const unsubscribeBudgets = onValue(budgetsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setBudgets(data);
      setBudgetsLoading(false);
    });

    const unsubscribeExpenses = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setExpenses(data);
      setExpensesLoading(false);
    });

    return () => {
      unsubscribeBudgets();
      unsubscribeExpenses();
    };
  }, [user.uid]);

  useEffect(() => {
    const goalsRef = ref(database, `goals/${user.uid}`);

    setGoalsLoading(true);

    const unsubscribeGoals = onValue(goalsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setGoals(data);
      setGoalsLoading(false);
    });

    return () => {
      unsubscribeGoals();
    };
  }, [user.uid]);

  useEffect(() => {
    if (!budgetsLoading && !expensesLoading && !goalsLoading) {
      setIsLoading(false);
    }
  }, [budgetsLoading, expensesLoading, goalsLoading]);

  const openConfirmModal = (action, title = "Are you sure?", message = "") => {
    setConfirmAction(() => action);
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleSignOut = () => {
    openConfirmModal(
      () => onLogout(),
      "Sign Out",
      "Are you sure you want to sign out?"
    );
  };

  const handleAddBudget = async (budgetData) => {
    const newRef = push(ref(database, `budgets/${user.uid}`));
    await set(newRef, { ...budgetData, id: newRef.key });
    setShowBudgetForm(false);
    setShowFABMenu(false);
  };

  const handleEditBudget = async (budgetData) => {
    await set(ref(database, `budgets/${user.uid}/${editingBudget.id}`), {
      ...budgetData,
      id: editingBudget.id,
    });
    setEditingBudget(null);
  };

  const handleDeleteBudget = (budgetId) => {
    openConfirmModal(
      async () => {
        await remove(ref(database, `budgets/${user.uid}/${budgetId}`));
      },
      "Delete Budget",
      "This action cannot be undone."
    );
  };

  const handleAddExpense = async (expenseData) => {
    const newRef = push(ref(database, `expenses/${user.uid}`));
    await set(newRef, { ...expenseData, id: newRef.key });

    const budgetRef = ref(
      database,
      `budgets/${user.uid}/${expenseData.budgetId}`
    );
    const snapshot = await get(budgetRef);
    const currentBudget = snapshot.val();
    if (currentBudget) {
      await set(budgetRef, {
        ...currentBudget,
        spent: currentBudget.spent + expenseData.amount,
      });
    }

    setShowExpenseForm(false);
    setShowFABMenu(false);
  };

  const handleDeleteExpense = (expenseId) => {
    const expense = expenses[expenseId];
    if (!expense) return;
    openConfirmModal(
      async () => {
        const budgetRef = ref(
          database,
          `budgets/${user.uid}/${expense.budgetId}`
        );
        const snapshot = await get(budgetRef);
        const currentBudget = snapshot.val();
        if (currentBudget) {
          await set(budgetRef, {
            ...currentBudget,
            spent: currentBudget.spent - expense.amount,
          });
        }
        await remove(ref(database, `expenses/${user.uid}/${expenseId}`));
      },
      "Delete Expense",
      "This action cannot be undone."
    );
  };

  const totalBudget = Object.values(budgets).reduce(
    (sum, b) => sum + b.amount,
    0
  );
  const totalSpent = Object.values(budgets).reduce(
    (sum, b) => sum + b.spent,
    0
  );

  const handleAddGoal = async (goalData) => {
    const newRef = push(ref(database, `goals/${user.uid}`));
    await set(newRef, { ...goalData, id: newRef.key });
    setShowGoalForm(false);
    setShowFABMenu(false);
  };

  const handleEditGoal = async (goalData) => {
    await set(ref(database, `goals/${user.uid}/${editingGoal.id}`), {
      ...goalData,
      id: editingGoal.id,
    });
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId) => {
    openConfirmModal(
      async () => {
        await remove(ref(database, `goals/${user.uid}/${goalId}`));
      },
      "Delete Goal",
      "This action cannot be undone."
    );
  };

  const handleGoalEditClick = (goal) => {
    setShowGoalForm(false);
    setShowBudgetForm(false);
    setShowExpenseForm(false);
    setEditingGoal(goal);
    setShowFABMenu(false);
    setTimeout(() => scrollToElement(budgetFormRef), 100);
  };

  const handleGoalFormToggle = () => {
    setShowGoalForm((prev) => !prev);
    setShowBudgetForm(false);
    setShowExpenseForm(false);
    setEditingGoal(null);
    setShowFABMenu(false);
    if (!showGoalForm) {
      setTimeout(() => scrollToElement(budgetFormRef), 100);
    }
  };

  const handleEditClick = (budget) => {
    setShowBudgetForm(false);
    setShowExpenseForm(false);
    setEditingBudget(budget);
    setShowFABMenu(false);
    // Auto-scroll to budget form after a small delay
    setTimeout(() => scrollToElement(budgetFormRef), 100);
  };

  const handleBudgetFormToggle = () => {
    setShowBudgetForm((prev) => !prev);
    setShowExpenseForm(false);
    setEditingBudget(null);
    setShowFABMenu(false);
    // Auto-scroll to budget form after a small delay
    if (!showBudgetForm) {
      setTimeout(() => scrollToElement(budgetFormRef), 100);
    }
  };

  const handleExpenseFormToggle = () => {
    setShowExpenseForm((prev) => !prev);
    setShowBudgetForm(false);
    setEditingBudget(null);
    setShowFABMenu(false);
    // Auto-scroll to expense form after a small delay
    if (!showExpenseForm) {
      setTimeout(() => scrollToElement(expenseFormRef), 100);
    }
  };

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

  const closeMobileActions = () => {
    setShowBudgetForm(false);
    setShowExpenseForm(false);
    setShowGoalForm(false);
    setEditingGoal(null);
    setMobileMenuOpen(false);
    setShowFABMenu(false);
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: colors.background }}
    >
      {/* Enhanced Header with Mobile Optimization and Brown Theme */}
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

      {/* Main Content with Enhanced Mobile Padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10 pb-24 lg:pb-10">
        {/* Summary Cards - Enhanced with Brown Theme and Horizontal Scroll for Mobile */}
        {isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <>
            {/* Mobile Horizontal Scroll Cards */}
            <div className="lg:hidden mb-8">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-1 py-2">
                {/* Total Budget Card */}
                <div className="flex-shrink-0 w-64 sm:w-72">
                  <div
                    className="rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                    style={{
                      backgroundColor: colors.summaryCard1,
                      color: colors.text,
                    }}
                  >
                    {/* Background Icon */}
                    <div className="absolute top-4 right-4 opacity-20">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-medium opacity-80 mb-2">
                        Total Budget
                      </p>
                      <p className="text-2xl font-bold">
                        ₱{totalBudget.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Spent Card */}
                <div className="flex-shrink-0 w-64 sm:w-72">
                  <div
                    className="rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                    style={{
                      backgroundColor: colors.summaryCard2,
                      color: colors.text,
                    }}
                  >
                    {/* Background Icon */}
                    <div className="absolute top-4 right-4 opacity-20">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-medium opacity-80 mb-2">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold">
                        ₱{totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remaining Card */}
                <div className="flex-shrink-0 w-64 sm:w-72">
                  <div
                    className="rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                    style={{
                      backgroundColor: colors.summaryCard3,
                      color: colors.text,
                    }}
                  >
                    {/* Background Icon */}
                    <div className="absolute top-4 right-4 opacity-20">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-medium opacity-90 mb-2">
                        Remaining
                      </p>
                      <p className="text-2xl font-bold">
                        ₱{(totalBudget - totalSpent).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Grid Layout (unchanged) */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
              <div
                className="rounded-2xl p-6 sm:p-8 shadow-lg transform hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: colors.summaryCard1,
                  color: colors.text,
                }}
              >
                <p className="text-sm sm:text-base font-medium opacity-80 mb-2">
                  Total Budget
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₱{totalBudget.toFixed(2)}
                </p>
              </div>
              <div
                className="rounded-2xl p-6 sm:p-8 shadow-lg transform hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: colors.summaryCard2,
                  color: colors.text,
                }}
              >
                <p className="text-sm sm:text-base font-medium opacity-80 mb-2">
                  Total Spent
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₱{totalSpent.toFixed(2)}
                </p>
              </div>
              <div
                className="rounded-2xl p-6 sm:p-8 shadow-lg transform hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1"
                style={{
                  backgroundColor: colors.summaryCard3,
                  color: colors.text,
                }}
              >
                <p className="text-sm sm:text-base font-medium opacity-90 mb-2">
                  Remaining
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₱{(totalBudget - totalSpent).toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Desktop Action Buttons - Only show on desktop */}
        <div className="hidden lg:flex flex-row gap-6 mb-8">
          <button
            onClick={handleBudgetFormToggle}
            className={`px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
              showBudgetForm ? "scale-105 shadow-xl" : ""
            }`}
            style={{
              backgroundColor: showBudgetForm
                ? "#74512D"
                : colors.buttonPrimary,
              color: showBudgetForm ? "#F8F4E1" : colors.text,
            }}
          >
            <Plus className="w-6 h-6 mr-3" />
            {showBudgetForm ? "Close Budget Form" : "Add New Budget"}
          </button>
          <button
            onClick={handleExpenseFormToggle}
            disabled={Object.keys(budgets).length === 0}
            className={`px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              showExpenseForm ? "scale-105 shadow-xl" : ""
            }`}
            style={{
              backgroundColor: showExpenseForm
                ? "#74512D"
                : colors.buttonPrimary,
              color: showExpenseForm ? "#F8F4E1" : colors.text,
            }}
          >
            <Minus className="w-6 h-6 mr-3" />
            {showExpenseForm ? "Close Expense Form" : "Add New Expense"}
          </button>
          <button
            onClick={handleGoalFormToggle}
            className={`px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
              showGoalForm ? "scale-105 shadow-xl" : ""
            }`}
            style={{
              backgroundColor: showGoalForm ? "#74512D" : "#D4C4A8",
              color: showGoalForm ? "#F8F4E1" : "#543310",
            }}
          >
            <Target className="w-6 h-6 mr-3" />
            {showGoalForm ? "Close Goal Form" : "Add New Goal"}
          </button>
          <button
            onClick={() => setShowAIAssistant(true)}
            disabled={
              Object.keys(budgets).length === 0 &&
              Object.keys(expenses).length === 0
            }
            className="px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 cursor-pointer"
            style={{
              backgroundColor: "#74512D",
              color: "#F8F4E1",
            }}
          >
            <Bot className="w-6 h-6 mr-3" />
            AI Assistant
          </button>
        </div>

        {/* Forms Section - Enhanced with Smooth Animations */}
        <div className="space-y-6 mb-8 sm:mb-10">
          {/* AI Assistant Modal */}
          {showAIAssistant && (
            <AIAssistantModal
              colors={colors}
              isOpen={showAIAssistant}
              onClose={() => setShowAIAssistant(false)}
              budgets={budgets}
              expenses={expenses}
              totalSpent={totalSpent}
              totalBudget={totalBudget}
            />
          )}
          {showBudgetForm && (
            <div
              ref={budgetFormRef}
              className="p-6 sm:p-8 rounded-2xl shadow-xl border-2 animate-slide-down"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <BudgetForm
                colors={colors}
                onSubmit={handleAddBudget}
                onCancel={closeMobileActions}
              />
            </div>
          )}
          {editingBudget && (
            <div
              ref={budgetFormRef}
              className="p-6 sm:p-8 rounded-2xl shadow-xl border-2 animate-slide-down"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <BudgetForm
                colors={colors}
                initialData={editingBudget}
                onSubmit={handleEditBudget}
                onCancel={() => setEditingBudget(null)}
              />
            </div>
          )}
          {showExpenseForm && (
            <div
              ref={expenseFormRef}
              className="p-6 sm:p-8 rounded-2xl shadow-xl border-2 animate-slide-down"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <ExpenseForm
                colors={colors}
                budgets={budgets}
                onSubmit={handleAddExpense}
                onCancel={closeMobileActions}
              />
            </div>
          )}
          {showGoalForm && (
            <div
              ref={budgetFormRef}
              className="p-6 sm:p-8 rounded-2xl shadow-xl border-2 animate-slide-down"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <GoalForm
                colors={colors}
                onSubmit={handleAddGoal}
                onCancel={closeMobileActions}
              />
            </div>
          )}
          {editingGoal && (
            <div
              ref={budgetFormRef}
              className="p-6 sm:p-8 rounded-2xl shadow-xl border-2 animate-slide-down"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <GoalForm
                colors={colors}
                initialData={editingGoal}
                onSubmit={handleEditGoal}
                onCancel={() => setEditingGoal(null)}
              />
            </div>
          )}
        </div>

        {/* Main Content Grid - Enhanced Mobile Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
          {/* Budgets Section */}
          {budgetsLoading ? (
            <BudgetsSkeleton />
          ) : (
            <div className="space-y-6">
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: colors.text }}
              >
                Your Budgets
              </h2>
              {Object.keys(budgets).length === 0 ? (
                <div
                  className="p-8 sm:p-12 rounded-2xl shadow-lg text-center"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  }}
                >
                  <p
                    className="text-base sm:text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    No budgets yet. Create your first one!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {Object.entries(budgets).map(([id, budget], index) => (
                    <div
                      key={id}
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in"
                      style={{
                        backgroundColor: "#F8F4E1",
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <BudgetCard
                        colors={colors}
                        budget={budget}
                        onEdit={() => handleEditClick(budget)}
                        onDelete={() => handleDeleteBudget(id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Expenses Section - Reduced padding for mobile */}
          <div
            className="rounded-2xl shadow-lg p-1 sm:p-6 md:p-8"
            style={{ backgroundColor: colors.cardBg }}
          >
            {expensesLoading ? (
              <ExpensesSkeleton />
            ) : (
              <ExpenseList
                colors={colors}
                expenses={expenses}
                budgets={budgets}
                onDelete={handleDeleteExpense}
              />
            )}
          </div>

          {/* Goals Section */}
          {goalsLoading ? (
            <GoalsSkeleton />
          ) : (
            <div className="space-y-6 xl:col-span-2">
              <h2
                className="text-xl sm:text-2xl font-bold"
                style={{ color: colors.text }}
              >
                Your Goals
              </h2>
              {Object.keys(goals).length === 0 ? (
                <div
                  className="p-8 sm:p-12 rounded-2xl shadow-lg text-center"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  }}
                >
                  <p
                    className="text-base sm:text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    No goals yet. Set your first savings target!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {Object.entries(goals).map(([id, goal], index) => (
                    <div
                      key={id}
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in"
                      style={{
                        backgroundColor: colors.cardBg,
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <GoalCard
                        colors={colors}
                        goal={goal}
                        onEdit={() => handleGoalEditClick(goal)}
                        onDelete={() => handleDeleteGoal(id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB (Floating Action Button) - Only show on mobile */}
      <div className="lg:hidden">
        {/* FAB Menu Background Overlay */}
        {showFABMenu && (
          <div
            style={{ backgroundColor: colors.overlay }}
            className="fixed inset-0 bg-opacity-30 z-40 animate-fade-in"
            onClick={() => setShowFABMenu(false)}
          />
        )}

        {/* FAB Menu Items */}
        {showFABMenu && (
          <div className="fixed bottom-24 right-4 z-50 space-y-3 animate-slide-up">
            {/* Export Report FAB */}
            <div className="flex items-center space-x-3">
              <div
                className="px-3 py-2 rounded-full shadow-lg"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  Export Report
                </span>
              </div>
              <button
                onClick={() => {
                  setShowExportReport(true);
                  setShowFABMenu(false);
                }}
                disabled={Object.keys(budgets).length === 0}
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 disabled:opacity-50"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>

            {/* // Add this before the Export Report FAB */}
            <div className="flex items-center space-x-3">
              <div
                className="px-3 py-2 rounded-full shadow-lg"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  AI Assistant
                </span>
              </div>
              <button
                onClick={() => {
                  setShowAIAssistant(true);
                  setShowFABMenu(false);
                }}
                disabled={
                  Object.keys(budgets).length === 0 &&
                  Object.keys(expenses).length === 0
                }
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 disabled:opacity-50"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <Bot className="w-5 h-5" />
              </button>
            </div>

            {/* Add Goal FAB */}
            <div className="flex items-center space-x-3">
              <div
                className="px-3 py-2 rounded-full shadow-lg"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  Add Goal
                </span>
              </div>
              <button
                onClick={handleGoalFormToggle}
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <Target className="w-5 h-5" />
              </button>
            </div>
            {/* Add Expense FAB */}
            <div className="flex items-center space-x-3">
              <div
                className="px-3 py-2 rounded-full shadow-lg"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  Add Expense
                </span>
              </div>
              <button
                onClick={handleExpenseFormToggle}
                disabled={Object.keys(budgets).length === 0}
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 disabled:opacity-50"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
            {/* Add Budget FAB */}
            <div className="flex items-center space-x-3">
              <div
                className="px-3 py-2 rounded-full shadow-lg"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <span className="text-sm font-medium whitespace-nowrap">
                  Add Budget
                </span>
              </div>
              <button
                onClick={handleBudgetFormToggle}
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                style={{
                  backgroundColor: colors.fabBg,
                  color: "white",
                }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setShowFABMenu(!showFABMenu)}
          className={`fixed bottom-6 right-4 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 transform transition-all duration-300 ${
            showFABMenu ? "rotate-45 scale-110" : "hover:scale-110"
          }`}
          style={{
            backgroundColor: colors.fabBg,
            color:
              showFABMenu && !isDarkMode
                ? "white" // red in light mode when active
                : colors.text,
          }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Export Report Modal */}
      {showExportReport && (
        <ExportReport
          colors={colors}
          budgets={budgets}
          expenses={expenses}
          user={user}
          onClose={() => setShowExportReport(false)}
        />
      )}

      {/* Enhanced Modal with Traditional Background */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{
            backgroundColor: colors.overlay, // uses your theme’s overlay
          }}
        >
          <div
            className="p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full border-2 transform scale-100 animate-scale-in transition-all"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
            }}
          >
            <h2
              className="text-lg sm:text-xl font-bold mb-3"
              style={{ color: colors.text }}
            >
              {modalTitle}
            </h2>

            {modalMessage && (
              <p
                className="text-sm mb-6 opacity-90"
                style={{ color: colors.text }}
              >
                {modalMessage}
              </p>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
              {/* Cancel Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-300 text-sm sm:text-base border cursor-pointer"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                Cancel
              </button>

              {/* Confirm / Sign Out Button */}
              <button
                onClick={() => {
                  confirmAction();
                  setModalOpen(false);
                }}
                className="px-6 py-3 rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-300 text-sm sm:text-base border cursor-pointer"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {modalTitle === "Sign Out" ? "Sign Out" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom CSS for Animations */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* FAB ripple effect */
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .fab-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s ease-out;
        }

        /* Hide scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #af8f6f;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #74512d;
        }

        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Smooth horizontal scrolling */
        .scrollbar-hide {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Card hover effects for mobile */
        @media (max-width: 1024px) {
          .summary-card:active {
            transform: scale(0.98);
            transition: transform 0.1s ease-in-out;
          }
        }
      `}</style>
      <SkeletonStyles />
    </div>
  );
};

export default Dashboard;
