import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BudgetForm = ({ colors, onSubmit, onCancel, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  const handleSubmit = () => {
    if (!name.trim() || !amount) return;
    onSubmit({
      name,
      amount: parseFloat(amount),
      spent: initialData?.spent || 0,
      date: date.toISOString().split("T")[0],
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
        {/* Name input */}
        <div>
          <label className="block text-sm font-medium mb-2">Budget Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-[#B8906B] rounded-lg"
            placeholder="e.g., Food"
            required
          />
        </div>

        {/* Amount input */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-[#B8906B] rounded-lg"
            placeholder="0.00"
            required
          />
        </div>

        {/* Date picker */}
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="w-full px-4 py-3 border border-[#B8906B] rounded-lg"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#74512D] text-[#F8F4E1] rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {initialData ? "Update" : "Add"} Budget
          </button>
          <button
            onClick={onCancel}
            className="px-8 py-3 bg-[#E8DCC0] text-[#543310] rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
