import React from "react";

const SummaryCards = ({ totalBudget, totalSpent, colors }) => {
  return (
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
  );
};

export default SummaryCards;
