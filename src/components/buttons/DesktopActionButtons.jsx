import React from "react";
import { Plus, Minus, Target, Bot } from "lucide-react";

const desktopActionButtons = ({
  handleBudgetFormToggle,
  showBudgetForm,
  handleExpenseFormToggle,
  showExpenseForm,
  handleGoalFormToggle,
  showGoalForm,
  setShowAIAssistant,
  colors,
  budgets,
  expenses,
}) => {
  return (
    <div className="hidden lg:flex flex-row gap-6 mb-8">
      <button
        onClick={handleBudgetFormToggle}
        className={`px-8 py-4 rounded-2xl font-semibold text-base flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
          showBudgetForm ? "scale-105 shadow-xl" : ""
        }`}
        style={{
          backgroundColor: showBudgetForm ? "#74512D" : colors.buttonPrimary,
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
          backgroundColor: showExpenseForm ? "#74512D" : colors.buttonPrimary,
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
  );
};

export default desktopActionButtons;
