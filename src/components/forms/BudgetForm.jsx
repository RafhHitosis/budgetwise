import React, { useState } from "react";

const BudgetForm = ({ colors, onSubmit, onCancel, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [amount, setAmount] = useState(initialData?.amount || "");

  const handleSubmit = () => {
    if (!name.trim() || !amount) return;
    onSubmit({
      name,
      amount: parseFloat(amount),
      spent: initialData?.spent || 0,
    });
    setName("");
    setAmount("");
  };

  return (
    <div
      style={{ backgroundColor: colors.cardBg, color: colors.text }}
      className="rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? "Edit Budget" : "Add New Budget"}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Budget Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-[#B8906B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8906B]"
            placeholder="e.g., Food, Transportation"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-[#B8906B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8906B]"
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#74512D] text-white py-3 px-4 rounded-lg whitespace-nowrap hover:shadow-md transform hover:scale-102 transition-all duration-300  cursor-pointer"
          >
            {initialData ? "Update" : "Add"} Budget
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-[#e2d2c0] text-[#543310] py-3 px-4 rounded-lg whitespace-nowrap hover:shadow-md transform hover:scale-102 transition-all duration-300  cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
