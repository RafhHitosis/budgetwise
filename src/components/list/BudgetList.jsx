import React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import BudgetCard from "../cards/BudgetCard";

const BudgetList = ({
  colors,
  budgets,
  filteredBudgets,
  currentPage,
  handlePageChange,
  handleEditClick,
  handleDeleteBudget,
  searchTerm,
  setSearchTerm,
  currentBudgets,
  totalPages,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h2
          className="text-xl sm:text-2xl font-bold"
          style={{ color: colors.text }}
        >
          Your Budgets
        </h2>

        {/* Budget Count */}
        {Object.keys(budgets).length > 0 && (
          <div className="text-sm" style={{ color: colors.secondaryText }}>
            {filteredBudgets.length} of {Object.keys(budgets).length} budget
            {Object.keys(budgets).length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {Object.keys(budgets).length === 0 ? (
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
            No budgets yet. Create your first one!
          </p>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          {Object.keys(budgets).length > 3 && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className="h-5 w-5"
                  style={{ color: colors.secondaryText }}
                />
              </div>
              <input
                type="text"
                placeholder="Search budgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
              />
            </div>
          )}

          {/* No Results */}
          {filteredBudgets.length === 0 && searchTerm && (
            <div
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: colors.cardBg }}
            >
              <p style={{ color: colors.text }}>
                No budgets found matching "{searchTerm}"
              </p>
            </div>
          )}

          {/* Budget Cards */}
          {currentBudgets.length > 0 && (
            <>
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                <div className="space-y-3">
                  {currentBudgets.map(([id, budget], index) => (
                    <div
                      key={id}
                      className="rounded-2xl shadow-md transform hover:scale-[1.01] transition-all duration-200 animate-fade-in"
                      style={{
                        backgroundColor: "#F8F4E1",
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <BudgetCard
                        colors={colors}
                        budget={budget}
                        onEdit={() => handleEditClick(budget)}
                        onDelete={() => handleDeleteBudget(id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="space-y-4">
                  {currentBudgets.map(([id, budget], index) => (
                    <div
                      key={id}
                      className="rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in"
                      style={{
                        backgroundColor: "#F8F4E1",
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <BudgetCard
                        colors={colors}
                        budget={budget}
                        onEdit={() => handleEditClick(budget)}
                        onDelete={() => handleDeleteBudget(id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor:
                        currentPage === 1 ? colors.border : colors.cardBg,
                      color: colors.text,
                      minHeight: "44px",
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isActive = pageNum === currentPage;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                          style={{
                            backgroundColor: isActive
                              ? colors.text
                              : colors.cardBg,
                            color: isActive ? colors.cardBg : colors.text,
                            border: `2px solid ${
                              isActive ? colors.text : colors.border
                            }`,
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor:
                        currentPage === totalPages
                          ? colors.border
                          : colors.cardBg,
                      color: colors.text,
                      minHeight: "44px",
                    }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Page Info */}
              {totalPages > 1 && (
                <div
                  className="text-center text-sm mt-4"
                  style={{ color: colors.secondaryText }}
                >
                  Page {currentPage} of {totalPages} • Showing{" "}
                  {currentBudgets.length} budgets
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BudgetList;
