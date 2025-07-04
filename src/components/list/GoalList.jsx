import React from "react";
import GoalCard from "../cards/GoalCard";

const GoalList = ({ colors, goals, handleGoalEditClick, handleDeleteGoal }) => {
  return (
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
  );
};

export default GoalList;
