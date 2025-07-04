import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  SummaryCardsSkeleton,
  BudgetsSkeleton,
  ExpensesSkeleton,
  GoalsSkeleton,
  DashboardSkeleton,
  SkeletonStyles,
} from "./loaders/SkeletonLoaders";
import Header from "./Header";
import MobileSummaryCards from "./cards/MobileSummaryCards";
import SummaryCards from "./cards/SummaryCards";
import DesktopActionButton from "./buttons/DesktopActionButtons";
import Forms from "./Forms";
import BudgetList from "./list/BudgetList";
import ExpenseList from "./list/ExpenseList";
import ExportReport from "./Reports/ExportReport";
import { database } from "../firebase";
import { ref, onValue, push, set, remove, get } from "firebase/database";
import GoalList from "./list/GoalList";
import MobileFab from "./MobileFab";
import Modal from "./modals/Modal";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [budgetsPerPage] = useState(3);

  const { isDarkMode, colors } = useTheme();

  // Refs for auto-scroll
  const budgetFormRef = useRef(null);
  const expenseFormRef = useRef(null);

  // Filter budgets based on search term
  const filteredBudgets = useMemo(() => {
    return Object.entries(budgets).filter(([, budget]) =>
      budget.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [budgets, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBudgets.length / budgetsPerPage);
  const startIndex = (currentPage - 1) * budgetsPerPage;
  const endIndex = startIndex + budgetsPerPage;
  const currentBudgets = filteredBudgets.slice(startIndex, endIndex);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      <Header
        user={user}
        handleSignOut={handleSignOut}
        currentDateTime={currentDateTime}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setShowExportReport={setShowExportReport}
        budgets={budgets}
      />

      {/* Main Content with Enhanced Mobile Padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10 pb-24 lg:pb-10">
        {/* Summary Cards - Enhanced with Brown Theme and Horizontal Scroll for Mobile */}
        {isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <>
            {/* Mobile Horizontal Scroll Cards */}
            <MobileSummaryCards
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              colors={colors}
            />

            {/* Desktop Grid Layout (unchanged) */}
            <SummaryCards
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              colors={colors}
            />
          </>
        )}

        {/* Desktop Action Buttons - Only show on desktop */}
        <DesktopActionButton
          handleBudgetFormToggle={handleBudgetFormToggle}
          showBudgetForm={showBudgetForm}
          handleExpenseFormToggle={handleExpenseFormToggle}
          showExpenseForm={showExpenseForm}
          handleGoalFormToggle={handleGoalFormToggle}
          showGoalForm={showGoalForm}
          setShowAIAssistant={setShowAIAssistant}
          colors={colors}
          budgets={budgets}
          expenses={expenses}
        />

        {/* Forms Section - Enhanced with Smooth Animations */}
        <Forms
          showAIAssistant={showAIAssistant}
          showBudgetForm={showBudgetForm}
          showExpenseForm={showExpenseForm}
          showGoalForm={showGoalForm}
          editingBudget={editingBudget}
          editingGoal={editingGoal}
          handleAddBudget={handleAddBudget}
          handleEditBudget={handleEditBudget}
          handleAddExpense={handleAddExpense}
          handleAddGoal={handleAddGoal}
          handleEditGoal={handleEditGoal}
          closeMobileActions={closeMobileActions}
          budgetFormRef={budgetFormRef}
          expenseFormRef={expenseFormRef}
          colors={colors}
          budgets={budgets}
          expenses={expenses}
          totalSpent={totalSpent}
          totalBudget={totalBudget}
          setShowAIAssistant={setShowAIAssistant}
          setEditingBudget={setEditingBudget}
          setEditingGoal={setEditingGoal}
        />

        {/* Main Content Grid - Enhanced Mobile Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
          {/* Budgets Section */}
          {budgetsLoading ? (
            <BudgetsSkeleton />
          ) : (
            <>
              <BudgetList
                colors={colors}
                budgets={budgets}
                filteredBudgets={filteredBudgets}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                handleEditClick={handleEditClick}
                handleDeleteBudget={handleDeleteBudget}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentBudgets={currentBudgets}
                totalPages={totalPages}
              />

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
            </>
          )}

          {/* Goals Section */}
          {goalsLoading ? (
            <GoalsSkeleton />
          ) : (
            <GoalList
              colors={colors}
              goals={goals}
              handleGoalEditClick={handleGoalEditClick}
              handleDeleteGoal={handleDeleteGoal}
            />
          )}
        </div>
      </div>

      {/* Mobile FAB (Floating Action Button) - Only show on mobile */}
      <MobileFab
        colors={colors}
        budgets={budgets}
        expenses={expenses}
        showFABMenu={showFABMenu}
        setShowFABMenu={setShowFABMenu}
        handleBudgetFormToggle={handleBudgetFormToggle}
        handleExpenseFormToggle={handleExpenseFormToggle}
        handleGoalFormToggle={handleGoalFormToggle}
        showAIAssistant={showAIAssistant}
        setShowAIAssistant={setShowAIAssistant}
        showExportReport={showExportReport}
        setShowExportReport={setShowExportReport}
        isDarkMode={isDarkMode}
      />

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
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        confirmAction={confirmAction}
        modalTitle={modalTitle}
        modalMessage={modalMessage}
        colors={colors}
      />

      <SkeletonStyles />
    </div>
  );
};

export default Dashboard;
