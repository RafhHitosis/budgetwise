import React, { useRef, useEffect } from "react";

const MobileSummaryCards = ({ totalBudget, totalSpent, colors }) => {
  const scrollRef = useRef();

  useEffect(() => {
    // Center the middle card (e.g. index 1 of 3 cards)
    if (scrollRef.current && scrollRef.current.children[1]) {
      scrollRef.current.children[1].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

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

  const summaryCards = [
    {
      title: "Total Spent",
      value: totalSpent,
      backgroundColor: colors.summaryCard1,
      badge: "SPENT",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      ),
      subtitle: "Amount used",
      statusTag: "USED",
      statusColor: "bg-current/20 text-current",
    },
    {
      title: "Total Budget",
      value: totalBudget,
      backgroundColor: colors.summaryCard2,
      badge: "BUDGET",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      subtitle: `${spentPercentage.toFixed(1)}% used`,
      showProgress: true,
      statusTag: "TOTAL",
      statusColor: "bg-current/20 text-current",
    },
    {
      title: remaining >= 0 ? "Remaining" : "Over Budget",
      value: Math.abs(remaining),
      backgroundColor: colors.summaryCard3,
      badge: remaining >= 0 ? "LEFT" : "OVER",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      ),
      subtitle: budgetStatus.message,
      isOverBudget: remaining < 0,
      statusTag: budgetStatus.status,
      statusColor: budgetStatus.color,
    },
  ];

  return (
    <div className="lg:hidden mb-8">
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 py-2 snap-x snap-mandatory"
      >
        {summaryCards.map((card, index) => (
          <div
            key={card.title}
            className="flex-shrink-0 w-64 sm:w-72 snap-center"
          >
            <div
              className="group relative rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden"
              style={{
                backgroundColor: card.backgroundColor,
                color: colors.text,
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                {index === 0 && (
                  <>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-current transform translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-current transform -translate-x-8 translate-y-8"></div>
                  </>
                )}
                {index === 1 && (
                  <>
                    <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-current transform -translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-current transform translate-x-8 translate-y-8"></div>
                  </>
                )}
                {index === 2 && (
                  <>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-current transform translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-current transform -translate-x-8 translate-y-8"></div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    {card.badge}
                  </div>
                </div>

                <p className="text-sm font-medium opacity-80 mb-2">
                  {card.title}
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-bold mb-3 ${
                    card.isOverBudget ? "text-red-400" : ""
                  }`}
                >
                  ₱
                  {card.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                {/* Progress Bar for Budget Card */}
                {card.showProgress && (
                  <div className="mb-2">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-white/60 to-white/80 h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs opacity-70">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${card.statusColor}`}
                    >
                      {card.statusTag}
                    </div>
                    {card.subtitle}
                  </div>

                  {card.title === "Remaining" && remaining >= 0 && (
                    <div className="text-xs opacity-70">
                      {totalBudget > 0
                        ? `${((remaining / totalBudget) * 100).toFixed(
                            1
                          )}% left`
                        : "0% left"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileSummaryCards;
