import React from "react";

const MobileSummaryCards = ({ totalBudget, totalSpent, colors }) => {
  const remaining = totalBudget - totalSpent;

  const summaryCards = [
    {
      title: "Total Budget",
      value: totalBudget,
      backgroundColor: colors.summaryCard1,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Total Spent",
      value: totalSpent,
      backgroundColor: colors.summaryCard2,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Remaining",
      value: remaining,
      backgroundColor: colors.summaryCard3,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="lg:hidden mb-8">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-1 py-2">
        {summaryCards.map((card) => (
          <div key={card.title} className="flex-shrink-0 w-64 sm:w-72">
            <div
              className="rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: card.backgroundColor,
                color: colors.text,
              }}
            >
              {/* Background Icon */}
              <div className="absolute top-4 right-4 opacity-20">
                {card.icon}
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium opacity-80 mb-2">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">₱{card.value.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileSummaryCards;
