import React from "react";
import AIAssistantModal from "./modals/AIAssistantModal";
import BudgetForm from "./forms/BudgetForm";
import ExpenseForm from "./forms/ExpenseForm";
import GoalForm from "./forms/GoalForm";

const Forms = ({
  showAIAssistant,
  showBudgetForm,
  showExpenseForm,
  showGoalForm,
  editingBudget,
  editingGoal,
  handleAddBudget,
  handleEditBudget,
  handleAddExpense,
  handleAddGoal,
  handleEditGoal,
  closeMobileActions,
  budgetFormRef,
  expenseFormRef,
  colors,
  budgets,
  expenses,
  totalSpent,
  totalBudget,
  setShowAIAssistant,
  setEditingBudget,
  setEditingGoal,
}) => {
  return (
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
  );
};

export default Forms;
