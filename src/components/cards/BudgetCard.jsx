// components/BudgetCard.js
import React, { useEffect, useState } from "react";
import { Edit3, Trash2, ChevronDown, ChevronUp, Users } from "lucide-react";
import CollaboratorManager from "../collab/CollaboratorManager";

const BudgetCard = ({
  budget,
  onEdit,
  onDelete,
  onExpenseDeduct,
  colors,
  user,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;

  useEffect(() => {
    if (onExpenseDeduct) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget.spent]);

  const getProgressColor = () => {
    if (percentage > 90) return "bg-[#B8906B]";
    if (percentage > 70) return "bg-[#A7794F]";
    return "bg-[#8A6240]";
  };

  return (
    <div
      style={{
        backgroundColor: colors.cardBg,
        color: colors.text,
        borderColor: colors.border,
      }}
      className={`rounded-xl shadow-lg border-l-4 transition-all duration-300 ${
        isAnimating ? "scale-105 shadow-xl" : ""
      }`}
    >
      {/* Mobile View - Touchable Card */}
      <div className="block sm:hidden">
        {/* Main touchable area */}
        <div
          className="p-4 cursor-pointer select-none active:bg-opacity-80 transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            backgroundColor: isExpanded ? "rgba(0,0,0,0.02)" : "transparent",
            minHeight: "60px",
          }}
        >
          {/* Header Row */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex-1 min-w-0 pr-2">
              <h3
                className="text-base font-semibold truncate"
                style={{ color: colors.text }}
              >
                {budget.name}
              </h3>
              <p className="text-xs" style={{ color: colors.secondaryText }}>
                {new Date(budget.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-2">
              <div className="p-2 rounded-full" style={{ color: colors.text }}>
                <div
                  className={`transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Compact Info Row */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-bold" style={{ color: colors.text }}>
              ₱{remaining.toFixed(2)}
            </div>
            <div
              className={`text-sm font-medium ${
                percentage > 90 ? "text-red-600" : ""
              }`}
              style={{ color: percentage > 90 ? undefined : colors.text }}
            >
              {percentage.toFixed(1)}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#F3E5D8] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()} ${
                isAnimating ? "animate-pulse" : ""
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Collaborator section for mobile - placed between main content and details */}
        <div className="px-4 pb-2">
          <div className="flex items-center space-x-2 mb-2">
            <Users
              className="w-4 h-4"
              style={{ color: colors.secondaryText }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: colors.secondaryText }}
            >
              Collaborators
            </span>
          </div>
          <div className="bg-opacity-30 rounded-lg p-3">
            <CollaboratorManager user={user} budget={budget} colors={colors} />
          </div>
        </div>

        {/* Expandable Details with Smooth Animation */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 space-y-3">
            <div
              className="pt-3 border-t"
              style={{ borderColor: colors.border }}
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: colors.secondaryText }}>
                    Total Budget:
                  </span>
                  <span style={{ color: colors.text }}>
                    ₱{budget.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: colors.secondaryText }}>Spent:</span>
                  <span style={{ color: colors.text }}>
                    ₱{budget.spent.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: colors.secondaryText }}>
                    Remaining:
                  </span>
                  <span style={{ color: colors.text }}>
                    ₱{remaining.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons with Staggered Animation */}
              <div
                className="flex justify-center space-x-4 mt-4 pt-3 border-t"
                style={{ borderColor: colors.border }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(budget);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 transform ${
                    isExpanded
                      ? "translate-y-0 opacity-100 delay-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{
                    backgroundColor: colors.border,
                    color: colors.text,
                    minHeight: "44px",
                    minWidth: "100px",
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(budget.id);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 transform ${
                    isExpanded
                      ? "translate-y-0 opacity-100 delay-150"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    minHeight: "44px",
                    minWidth: "100px",
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Original Layout with Modern Collaborator Placement */}
      <div className="hidden sm:block p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.text }}
            >
              {budget.name}
            </h3>
            <p className="text-sm" style={{ color: colors.secondaryText }}>
              {new Date(budget.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Collaborator section in header area for desktop */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative bg-opacity-20 rounded-lg px-3 py-1">
                <CollaboratorManager
                  user={user}
                  budget={budget}
                  colors={colors}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(budget)}
                className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors cursor-pointer"
                style={{ color: colors.text }}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(budget.id)}
                className="p-2 rounded-full hover:bg-opacity-20 hover:bg-red-500 transition-colors cursor-pointer"
                style={{ color: colors.text }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span style={{ color: colors.text }} className="text-2xl font-bold">
              ₱{remaining.toFixed(2)}
            </span>
            <span style={{ color: colors.text }} className="text-sm">
              of ₱{budget.amount.toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-[#F3E5D8] rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()} ${
                isAnimating ? "animate-pulse" : ""
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span style={{ color: colors.text }}>
              Spent: ₱{budget.spent.toFixed(2)}
            </span>
            <span
              className={`font-medium ${percentage > 90 ? "text-red-600" : ""}`}
              style={{ color: percentage > 90 ? undefined : colors.text }}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
