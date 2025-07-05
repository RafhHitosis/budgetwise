// components/SkeletonLoaders.js
import React from "react";
import { useTheme } from "../../contexts/ThemeProvider";

// Base Skeleton Component with shimmer animation
const Skeleton = ({ className = "", style = {} }) => {
  const { colors } = useTheme(); // 👈 Get theme colors

  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        backgroundColor: colors.cardHover,
        borderRadius: "8px",
        ...style,
      }}
    />
  );
};

// Summary Cards Skeleton - Updated to horizontal scroll
export const SummaryCardsSkeleton = () => {
  const { colors } = useTheme();

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6 sm:p-8 shadow-lg flex-shrink-0 min-w-[280px] sm:min-w-[320px]"
            style={{ backgroundColor: colors.cardBg }}
          >
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Budget Card Skeleton
export const BudgetCardSkeleton = () => {
  const { colors } = useTheme();
  return (
    <div
      className="rounded-2xl shadow-lg p-6"
      style={{ backgroundColor: colors.cardBg }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      <div className="flex justify-between">
        <div>
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
};

// Budgets Section Skeleton
export const BudgetsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-32" />
    <div className="space-y-4 sm:space-y-6">
      {[1, 2, 3].map((i) => (
        <BudgetCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Expense Item Skeleton
export const ExpenseItemSkeleton = () => {
  const { colors } = useTheme();

  return (
    <div
      className="flex items-center justify-between p-3 border-b last:border-b-0"
      style={{ borderColor: colors.borderExpense }}
    >
      <div className="flex-1">
        <Skeleton className="h-5 w-24 mb-1" />
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <Skeleton className="h-5 w-16 mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};

// Expenses Section Skeleton
export const ExpensesSkeleton = () => (
  <div>
    <div className="flex items-center justify-between mb-4 p-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="max-h-96 overflow-y-auto">
      {[1, 2, 3, 4, 5].map((i) => (
        <ExpenseItemSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Goal Card Skeleton
export const GoalCardSkeleton = () => {
  const { colors } = useTheme();
  return (
    <div
      className="rounded-2xl shadow-lg p-6"
      style={{ backgroundColor: colors.cardBg }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-28 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div>
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};

// Goals Section Skeleton
export const GoalsSkeleton = () => (
  <div className="space-y-6 xl:col-span-2">
    <Skeleton className="h-8 w-28" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {[1, 2].map((i) => (
        <GoalCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Main Dashboard Skeleton (Full Page Loading)
export const DashboardSkeleton = () => {
  const { colors } = useTheme();
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header Skeleton */}
      <header
        className="shadow-lg border-b sticky top-0 z-40"
        style={{
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Skeleton className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl" />
              <div>
                <Skeleton className="h-6 w-32 mb-1" />
                <div className="lg:hidden">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <Skeleton className="h-10 w-48 rounded-xl" />
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>

            <div className="lg:hidden">
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10">
        <SummaryCardsSkeleton />

        {/* Desktop Action Buttons Skeleton */}
        <div className="hidden lg:flex flex-row gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-48 rounded-2xl" />
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
          <BudgetsSkeleton />
          <div
            className="rounded-2xl shadow-lg p-1 sm:p-6 md:p-8"
            style={{ backgroundColor: colors.cardBg }}
          >
            <ExpensesSkeleton />
          </div>
          <GoalsSkeleton />
        </div>
      </div>
    </div>
  );
};

// Shimmer Animation CSS
export const SkeletonStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }

    .skeleton-shimmer {
      background: linear-gradient(90deg, #e8dcc0 0%, #d4c4a8 50%, #e8dcc0 100%);
      background-size: 200px 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    .skeleton-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes wave {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .skeleton-wave::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: wave 2s ease-in-out infinite;
    }

    .skeleton-wave {
      position: relative;
      overflow: hidden;
    }

    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `}</style>
);
