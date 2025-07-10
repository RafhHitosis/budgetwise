import React from "react";

const SummaryCards = ({ totalBudget, totalSpent, colors }) => {
  const remaining = totalBudget - totalSpent;
  const spentPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Improved status logic
  const getBudgetStatus = () => {
    if (remaining < 0) {
      return {
        status: "HIGH",
        color: "bg-red-400/20 text-red-400",
        message: "Exceeded limit",
      };
    } else if (spentPercentage >= 90) {
      return {
        status: "WARN",
        color: "bg-yellow-400/20 text-yellow-400",
        message: "Nearly exhausted",
      };
    } else if (spentPercentage >= 75) {
      return {
        status: "CAUTION",
        color: "bg-orange-400/20 text-orange-400",
        message: "Getting low",
      };
    } else {
      return {
        status: "SAFE",
        color: "bg-green-400/20 text-green-400",
        message: "Within budget",
      };
    }
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
      {/* Total Budget Card */}
      <div
        className="group relative rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden"
        style={{
          backgroundColor: colors.summaryCard1,
          color: colors.text,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-current transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-current transform -translate-x-12 translate-y-12"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              BUDGET
            </div>
          </div>

          <p className="text-sm sm:text-base font-medium opacity-80 mb-2">
            Total Budget
          </p>
          <p className="text-3xl sm:text-4xl font-bold mb-2">
            ₱
            {totalBudget.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center text-xs opacity-70">
            <div className="px-2 py-1 rounded-full text-xs font-medium mr-2 bg-current/20 text-current">
              TOTAL
            </div>
            Available funds
          </div>
        </div>
      </div>

      {/* Total Spent Card */}
      <div
        className="group relative rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden"
        style={{
          backgroundColor: colors.summaryCard2,
          color: colors.text,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-current transform -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-28 h-28 rounded-full bg-current transform translate-x-14 translate-y-14"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              SPENT
            </div>
          </div>

          <p className="text-sm sm:text-base font-medium opacity-80 mb-2">
            Total Spent
          </p>
          <p className="text-3xl sm:text-4xl font-bold mb-2">
            ₱
            {totalSpent.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-white/60 to-white/80 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center text-xs opacity-70">
            <div className="px-2 py-1 rounded-full text-xs font-medium mr-2 bg-current/20 text-current">
              USED
            </div>
            {spentPercentage.toFixed(1)}% of budget
          </div>
        </div>
      </div>

      {/* Remaining Card */}
      <div
        className="group relative rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden sm:col-span-2 lg:col-span-1"
        style={{
          backgroundColor: colors.summaryCard3,
          color: colors.text,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full bg-current transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-current transform translate-x-10 -translate-y-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              {remaining >= 0 ? "LEFT" : "OVER"}
            </div>
          </div>

          <p className="text-sm sm:text-base font-medium opacity-80 mb-2">
            {remaining >= 0 ? "Remaining" : "Over Budget"}
          </p>
          <p
            className={`text-3xl sm:text-4xl font-bold mb-2 ${
              remaining < 0 ? "text-red-400" : ""
            }`}
          >
            ₱
            {Math.abs(remaining).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          {/* Status Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs opacity-70">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${budgetStatus.color}`}
              >
                {budgetStatus.status}
              </div>
              {budgetStatus.message}
            </div>

            {remaining >= 0 && totalBudget > 0 && (
              <div className="text-xs opacity-70">
                {((remaining / totalBudget) * 100).toFixed(1)}% left
              </div>
            )}

            {remaining >= 0 && totalBudget === 0 && (
              <div className="text-xs opacity-70">0% left</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
