import React from "react";
import { Edit2, Trash2, Target, Calendar, TrendingUp } from "lucide-react";

const GoalCard = ({ goal, onEdit, onDelete, colors }) => {
  const progressPercentage = Math.min((goal.saved / goal.amount) * 100, 100);
  const remainingAmount = Math.max(goal.amount - goal.saved, 0);

  // Calculate days remaining
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const daysRemaining = Math.max(
    Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)),
    0
  );

  // Calculate kinsenas remaining (bi-monthly periods)
  const kinsenasRemaining = Math.max(Math.ceil(daysRemaining / 15), 1);
  const suggestedContribution = remainingAmount / kinsenasRemaining;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = targetDate < today && goal.saved < goal.amount;
  const isCompleted = goal.saved >= goal.amount;

  return (
    <div
      className="p-6 border-2 rounded-2xl relative overflow-hidden"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.cardBg || colors.surface,
        color: colors.text,
      }}
    >
      {/* Progress Background Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(to right, ${colors.accent} ${progressPercentage}%, transparent ${progressPercentage}%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.secondary }}
            >
              <Target className="w-5 h-5" style={{ color: "white" }} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg truncate">{goal.name}</h3>
              <p className="text-sm" style={{ opacity: 0.8 }}>
                {isCompleted
                  ? "Goal Achieved!"
                  : isOverdue
                  ? "Overdue"
                  : `${daysRemaining} day${
                      daysRemaining !== 1 ? "s" : ""
                    } left`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: colors.accent, color: colors.text }}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: colors.buttonSecondary,
                color: colors.text,
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Amount & Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Target: ₱{goal.amount.toFixed(2)}
            </span>
            <span className="text-sm font-medium">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: "#E8DCC0" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: isCompleted ? "#4CAF50" : "#A7794F",
              }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Saved: ₱{goal.saved.toFixed(2)}</span>
            <span className="text-sm">
              Remaining: ₱{remainingAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar
              className="w-4 h-4"
              style={{ color: colors.textSecondary }}
            />
            <span className="text-sm font-medium">Timeline</span>
          </div>
          <p className="text-sm">
            {formatDate(goal.startDate)} → {formatDate(goal.targetDate)}
          </p>
        </div>

        {/* Suggested Contribution */}
        {!isCompleted && (
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp
                className="w-4 h-4"
                style={{ color: colors.textSecondary }}
              />
              <span className="text-sm font-medium">
                Suggested Kinsenas Contribution
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                ₱{suggestedContribution.toFixed(2)}
              </span>
              <span className="text-xs">
                for next {kinsenasRemaining} kinsenas
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
