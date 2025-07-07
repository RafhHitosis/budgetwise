import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTheme } from "../contexts/ThemeProvider";
import {
  SummaryCardsSkeleton,
  BudgetsSkeleton,
  ExpensesSkeleton,
  GoalsSkeleton,
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
import {
  ref,
  onValue,
  push,
  set,
  remove,
  get,
  runTransaction,
} from "firebase/database";
import GoalList from "./list/GoalList";
import MobileFab from "./MobileFab";
import Modal from "./modals/Modal";

const Dashboard = ({ user, onLogout }) => {
  // Data states
  const [budgets, setBudgets] = useState({});
  const [expenses, setExpenses] = useState({});
  const [goals, setGoals] = useState({});

  // Form states
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [modalTitle, setModalTitle] = useState("Are you sure?");
  const [modalMessage, setModalMessage] = useState("");

  // UI states
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [budgetsPerPage] = useState(2);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(true);

  const { isDarkMode, colors } = useTheme();
  const budgetFormRef = useRef(null);
  const expenseFormRef = useRef(null);

  // Filtered budgets with pagination
  const filteredBudgets = useMemo(() => {
    return Object.entries(budgets).filter(([, budget]) =>
      budget.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [budgets, searchTerm]);

  const totalPages = Math.ceil(filteredBudgets.length / budgetsPerPage);
  const startIndex = (currentPage - 1) * budgetsPerPage;
  const currentBudgets = filteredBudgets.slice(
    startIndex,
    startIndex + budgetsPerPage
  );

  useEffect(() => {
    // If current page has no data but there are items in other pages
    if (currentPage > 1 && currentBudgets.length === 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [filteredBudgets, currentBudgets.length, currentPage]);

  // Calculated values
  const totalBudget = Object.values(budgets).reduce(
    (sum, b) => sum + b.amount,
    0
  );
  const totalSpent = Object.values(budgets).reduce(
    (sum, b) => sum + b.spent,
    0
  );

  // Utility functions
  const scrollToElement = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openConfirmModal = (action, title = "Are you sure?", message = "") => {
    setConfirmAction(() => action);
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  const closeAllForms = () => {
    setShowBudgetForm(false);
    setShowExpenseForm(false);
    setShowGoalForm(false);
    setEditingBudget(null);
    setEditingGoal(null);
    setMobileMenuOpen(false);
    setShowFABMenu(false);
  };

  // Form toggle handlers
  const createFormToggle = (formSetter, formRef) => () => {
    closeAllForms();
    formSetter(true);
    if (formRef) setTimeout(() => scrollToElement(formRef), 100);
  };

  const handleBudgetFormToggle = createFormToggle(
    setShowBudgetForm,
    budgetFormRef
  );
  const handleExpenseFormToggle = createFormToggle(
    setShowExpenseForm,
    expenseFormRef
  );
  const handleGoalFormToggle = createFormToggle(setShowGoalForm, budgetFormRef);

  // Edit handlers
  const handleEditClick = (budget) => {
    closeAllForms();
    setEditingBudget(budget);
    setTimeout(() => scrollToElement(budgetFormRef), 100);
  };

  const handleGoalEditClick = (goal) => {
    closeAllForms();
    setEditingGoal(goal);
    setTimeout(() => scrollToElement(budgetFormRef), 100);
  };

  // Reset page when search changes
  useEffect(() => setCurrentPage(1), [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update current date and time
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Firebase data subscriptions
  useEffect(() => {
    setBudgetsLoading(true);

    const budgetsRef = ref(database, "budgets");
    const unsubscribe = onValue(budgetsRef, (snapshot) => {
      const allBudgets = snapshot.val() || {};
      const visibleBudgets = {};

      // Loop through all users' budgets
      Object.entries(allBudgets).forEach(([ownerId, userBudgets]) => {
        Object.entries(userBudgets).forEach(([budgetId, budget]) => {
          const isOwner = budget.owner === user.uid;
          const isCollaborator =
            budget.collaborators && budget.collaborators[user.uid];

          if (isOwner || isCollaborator) {
            visibleBudgets[budgetId] = {
              ...budget,
              owner: ownerId,
            };
          }
        });
      });

      setBudgets(visibleBudgets);
      setBudgetsLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    const createSubscription = (path, setter, loadingSetter) => {
      loadingSetter(true);
      return onValue(ref(database, `${path}/${user.uid}`), (snapshot) => {
        setter(snapshot.val() || {});
        loadingSetter(false);
      });
    };

    const unsubscribes = [
      createSubscription("expenses", setExpenses, setExpensesLoading),
      createSubscription("goals", setGoals, setGoalsLoading),
    ];

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [user.uid]);

  // Set overall loading state
  useEffect(() => {
    setIsLoading(budgetsLoading || expensesLoading || goalsLoading);
  }, [budgetsLoading, expensesLoading, goalsLoading]);

  // CRUD operations
  const handleSignOut = () => {
    openConfirmModal(
      () => onLogout(),
      "Sign Out",
      "Are you sure you want to sign out?"
    );
  };

  const handleAddBudget = async (budgetData) => {
    const existingBudget = Object.values(budgets).find(
      (b) =>
        b.name.toLowerCase() === budgetData.name.toLowerCase() &&
        b.owner === user.uid
    );

    if (existingBudget) {
      openConfirmModal(
        async () => {
          // Option to increase amount
          const budgetRef = ref(
            database,
            `budgets/${user.uid}/${existingBudget.id}`
          );
          await runTransaction(budgetRef, (currentBudget) => {
            if (currentBudget) {
              return {
                ...currentBudget,
                amount: currentBudget.amount + budgetData.amount,
              };
            }
            return currentBudget;
          });
        },
        "Duplicate Budget Found",
        `A budget named "${budgetData.name}" already exists. Do you want to add the amount to the existing budget?`
      );
    } else {
      const newRef = push(ref(database, `budgets/${user.uid}`));
      await set(newRef, {
        ...budgetData,
        id: newRef.key,
        owner: user.uid,
        collaborators: {},
      });
    }

    setShowBudgetForm(false);
    setShowFABMenu(false);
  };

  const handleEditBudget = async (budgetData) => {
    try {
      // Find the budget owner - could be current user or someone else if this is a collaborative budget
      const budgetOwner = editingBudget.owner || user.uid;

      // Update the budget under the correct owner's path
      await set(ref(database, `budgets/${budgetOwner}/${editingBudget.id}`), {
        ...budgetData,
        id: editingBudget.id,
        owner: budgetOwner, // Preserve the original owner
        collaborators: editingBudget.collaborators || {}, // Preserve collaborators
      });

      setEditingBudget(null);
    } catch (error) {
      console.error("Error editing budget:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteBudget = (budgetId) => {
    // Find the budget to get the owner
    const budget = budgets[budgetId];
    if (!budget) return;

    const budgetOwner = budget.owner || user.uid;

    openConfirmModal(
      async () => {
        try {
          // Delete from the correct owner's path
          await remove(ref(database, `budgets/${budgetOwner}/${budgetId}`));
        } catch (error) {
          console.error("Error deleting budget:", error);
          // You might want to show an error message to the user here
        }
      },
      "Delete Budget",
      "This action cannot be undone."
    );
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const newRef = push(ref(database, `expenses/${user.uid}`));
      const expenseId = newRef.key;

      // Create the expense object
      const expenseObject = {
        ...expenseData,
        id: expenseId,
        createdBy: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
        },
      };

      // Add expense to current user's expenses
      await set(newRef, expenseObject);

      const targetBudget = Object.values(budgets).find(
        (b) => b.id === expenseData.budgetId
      );

      if (targetBudget) {
        const budgetRef = ref(
          database,
          `budgets/${targetBudget.owner}/${expenseData.budgetId}`
        );

        // Use atomic transaction to update budget spent amount
        await runTransaction(budgetRef, (currentBudget) => {
          if (currentBudget) {
            return {
              ...currentBudget,
              spent: (currentBudget.spent || 0) + expenseData.amount,
            };
          }
          return currentBudget;
        });

        // If this is a collaborative budget, also add expense to budget owner's expenses
        if (targetBudget.owner !== user.uid) {
          const ownerExpenseRef = push(
            ref(database, `expenses/${targetBudget.owner}`)
          );
          await set(ownerExpenseRef, {
            ...expenseObject,
            id: ownerExpenseRef.key,
            isCollaboratorExpense: true, // Flag to identify collaborator expenses
          });
        }
      }

      setShowExpenseForm(false);
      setShowFABMenu(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDeleteExpense = (expenseId) => {
    const expense = expenses[expenseId];
    if (!expense) return;

    const budget = Object.values(budgets).find(
      (b) => b.id === expense.budgetId
    );
    const budgetOwner = budget?.owner;

    openConfirmModal(
      async () => {
        try {
          if (budget && budgetOwner) {
            const budgetRef = ref(
              database,
              `budgets/${budgetOwner}/${expense.budgetId}`
            );

            // Use atomic transaction to update budget spent amount
            await runTransaction(budgetRef, (currentBudget) => {
              if (currentBudget) {
                return {
                  ...currentBudget,
                  spent: Math.max(
                    0,
                    (currentBudget.spent || 0) - expense.amount
                  ),
                };
              }
              return currentBudget;
            });
          }

          // Always delete from current user's expenses first
          await remove(ref(database, `expenses/${user.uid}/${expenseId}`));

          // Handle collaborative expense deletion
          if (budgetOwner && budgetOwner !== user.uid) {
            // If current user is a collaborator, find and delete from budget owner's expenses
            const ownerExpensesRef = ref(database, `expenses/${budgetOwner}`);
            const ownerSnapshot = await get(ownerExpensesRef);
            const ownerExpenses = ownerSnapshot.val() || {};

            const matchingExpenseId = Object.keys(ownerExpenses).find((id) => {
              const ownerExpense = ownerExpenses[id];
              return (
                ownerExpense.budgetId === expense.budgetId &&
                ownerExpense.amount === expense.amount &&
                ownerExpense.date === expense.date &&
                ownerExpense.createdBy?.uid === expense.createdBy?.uid
              );
            });

            if (matchingExpenseId) {
              await remove(
                ref(database, `expenses/${budgetOwner}/${matchingExpenseId}`)
              );
            }
          } else if (budgetOwner === user.uid) {
            // If current user is the budget owner, delete from all collaborators' expenses
            const collaborators = budget.collaborators || {};

            for (const collaboratorId of Object.keys(collaborators)) {
              const collaboratorExpensesRef = ref(
                database,
                `expenses/${collaboratorId}`
              );
              const collaboratorSnapshot = await get(collaboratorExpensesRef);
              const collaboratorExpenses = collaboratorSnapshot.val() || {};

              const matchingCollaboratorExpenseId = Object.keys(
                collaboratorExpenses
              ).find((id) => {
                const collaboratorExpense = collaboratorExpenses[id];
                return (
                  collaboratorExpense.budgetId === expense.budgetId &&
                  collaboratorExpense.amount === expense.amount &&
                  collaboratorExpense.date === expense.date &&
                  collaboratorExpense.createdBy?.uid === expense.createdBy?.uid
                );
              });

              if (matchingCollaboratorExpenseId) {
                await remove(
                  ref(
                    database,
                    `expenses/${collaboratorId}/${matchingCollaboratorExpenseId}`
                  )
                );
              }
            }
          }
        } catch (error) {
          console.error("Error deleting expense:", error);
          // You might want to show an error message to the user here
        }
      },
      "Delete Expense",
      "This action cannot be undone."
    );
  };

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
      async () => await remove(ref(database, `goals/${user.uid}/${goalId}`)),
      "Delete Goal",
      "This action cannot be undone."
    );
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: colors.background }}
    >
      <Header
        user={user}
        handleSignOut={handleSignOut}
        currentDateTime={currentDateTime}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setShowExportReport={setShowExportReport}
        budgets={budgets}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10 pb-24 lg:pb-10">
        {/* Summary Cards */}
        {isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <>
            <MobileSummaryCards
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              colors={colors}
            />
            <SummaryCards
              totalBudget={totalBudget}
              totalSpent={totalSpent}
              colors={colors}
            />
          </>
        )}

        {/* Desktop Action Buttons */}
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

        {/* Forms Section */}
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
          closeMobileActions={closeAllForms}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
          {/* Budgets Section */}
          {budgetsLoading ? (
            <BudgetsSkeleton />
          ) : (
            <>
              <BudgetList
                user={user}
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

              {/* Expenses Section */}
              <div
                className="rounded-2xl shadow-lg p-1 sm:p-6 md:p-8"
                style={{ backgroundColor: colors.cardBg }}
              >
                {expensesLoading ? (
                  <ExpensesSkeleton />
                ) : (
                  <ExpenseList
                    user={user}
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

      {/* Mobile FAB */}
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

      {/* Confirmation Modal */}
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
