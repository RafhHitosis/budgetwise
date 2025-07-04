import React from "react";
import { Plus, FileText, Bot, Target, Minus } from "lucide-react";

const MobileFab = ({
  colors,
  budgets,
  expenses,
  showFABMenu,
  setShowFABMenu,
  handleBudgetFormToggle,
  handleExpenseFormToggle,
  handleGoalFormToggle,
  setShowAIAssistant,
  setShowExportReport,
  isDarkMode,
}) => {
  return (
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
  );
};

export default MobileFab;
