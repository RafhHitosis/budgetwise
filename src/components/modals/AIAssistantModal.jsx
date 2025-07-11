// components/AIAssistantModal.js
import React, { useState } from "react";
import { X, Bot, Loader, Lightbulb, TrendingUp, Tag } from "lucide-react";
import geminiService from "../../services/geminiService";

const AIAssistantModal = ({
  isOpen,
  onClose,
  budgets,
  expenses,
  totalSpent,
  totalBudget,
  colors,
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [activeTab, setActiveTab] = useState("insights");

  const handleGetInsights = async () => {
    setLoading(true);
    try {
      const insights = await geminiService.getSmartInsights(budgets, expenses);
      setResponse(insights);
    } catch {
      setResponse(
        "Sorry, I couldn't generate insights right now. Please try again."
      );
    }
    setLoading(false);
  };

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const advice = await geminiService.getBudgetingAdvice(
        expenses,
        budgets,
        totalSpent,
        totalBudget
      );
      setResponse(advice);
    } catch {
      setResponse(
        "Sorry, I couldn't generate advice right now. Please try again."
      );
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: colors.overlay }} // dark/light overlay from your colors
    >
      <div
        className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col"
        style={{ backgroundColor: colors.cardBg }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sm:p-6 border-b"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.accent }}
            >
              <Bot className="w-5 h-5" style={{ color: "#F8F4E1" }} />
            </div>
            <div>
              <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: colors.text }}
              >
                AI Assistant
              </h2>
              <p className="text-sm opacity-80" style={{ color: colors.text }}>
                Smart financial insights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-opacity-20 hover:bg-amber-800 transition-colors group cursor-pointer"
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >
          {["insights", "advice"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setResponse("");
              }}
              className={`flex-1 p-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                activeTab === tab ? "border-b-2" : ""
              }`}
              style={{
                color: colors.text,
                borderColor: activeTab === tab ? colors.accent : "transparent",
              }}
            >
              {tab === "insights" ? (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>Smart Insights</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4" />
                  <span>Budgeting Tips</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === "insights" && (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: colors.text }}>
                Get personalized insights about your spending patterns and
                budget performance.
              </p>
              <button
                onClick={handleGetInsights}
                disabled={loading || Object.keys(budgets).length === 0}
                className="w-full p-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: colors.accent, color: "#F8F4E1" }}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                <span>{loading ? "Analyzing..." : "Get Smart Insights"}</span>
              </button>
            </div>
          )}

          {activeTab === "advice" && (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: colors.text }}>
                Receive personalized budgeting advice based on your spending
                habits.
              </p>
              <button
                onClick={handleGetAdvice}
                disabled={loading || Object.keys(expenses).length === 0}
                className="w-full p-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: colors.accent, color: "#F8F4E1" }}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Lightbulb className="w-4 h-4" />
                )}
                <span>{loading ? "Thinking..." : "Get Budgeting Advice"}</span>
              </button>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div
              className="mt-6 p-4 rounded-xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-start space-x-3">
                <Bot
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  style={{ color: colors.text }}
                />
                <div
                  className="text-sm whitespace-pre-line"
                  style={{ color: colors.text }}
                >
                  {response}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
