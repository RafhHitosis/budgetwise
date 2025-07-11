import React, { useState } from "react";

const ExpenseForm = ({ budgets, onSubmit, onCancel, colors }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !amount || !budgetId) return;

    let imageUrl = "";

    if (imageFile) {
      try {
        setUploading(true);

        const formData = new FormData();

        // Format the image name: expense-name-timestamp (spaces removed)
        const cleanName = name.trim().toLowerCase().replace(/\s+/g, "_");
        const timestamp = Date.now();
        const publicId = `receipt_${cleanName}_${timestamp}`;

        formData.append("file", imageFile);
        formData.append("upload_preset", "receipt_upload"); // your unsigned preset
        formData.append("public_id", publicId); // custom image name
        formData.append("tags", "expense,receipt"); // comma-separated tags

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dpiupmmsg/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        imageUrl = data.secure_url;
      } catch (err) {
        alert("Image upload failed");
        console.error(err);
        setUploading(false);
        return;
      }
    }

    onSubmit({
      name,
      amount: parseFloat(amount),
      budgetId,
      imageUrl,
      date: new Date().toISOString().split("T")[0],
    });

    setName("");
    setAmount("");
    setBudgetId("");
    setImageFile(null);
    setUploading(false);
  };

  React.useEffect(() => {
    if (Object.keys(budgets).length === 1) {
      const onlyId = Object.keys(budgets)[0];
      setBudgetId(onlyId);
    }
  }, [budgets]);

  return (
    <div
      style={{ backgroundColor: colors.cardBg, color: colors.text }}
      className="bg-[#F3E5D8] rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Expense Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-[#B8906B] rounded-lg"
            placeholder="e.g., Grocery, Gas"
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
            className="w-full px-4 py-3 border border-[#B8906B] rounded-lg"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Budget Category
          </label>
          <div className="relative">
            <select
              value={budgetId}
              style={{ color: colors.text }}
              onChange={(e) => setBudgetId(e.target.value)}
              className="w-full px-4 py-3 border border-[#B8906B] rounded-lg appearance-none bg-transparent text-[#543310] focus:outline-none focus:ring-2 focus:ring-[#B8906B] pr-10"
              required
            >
              {Object.keys(budgets).length > 1 && (
                <option style={{ color: "#543310" }} value="">
                  Select a budget
                </option>
              )}
              {Object.entries(budgets).map(([id, budget]) => (
                <option style={{ color: "#543310" }} key={id} value={id}>
                  {budget.name} (${(budget.amount - budget.spent).toFixed(2)}{" "}
                  remaining)
                </option>
              ))}
            </select>
            <div
              style={{ color: colors.text }}
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#543310]"
            >
              {/* Chevron Down SVG */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 8l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Receipt (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#74512D] file:text-white hover:file:bg-[#a97c59] cursor-pointer"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-8 py-3 bg-[#74512D] text-[#F8F4E1] rounded-xl font-medium hover:shadow-md transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {uploading ? "Uploading..." : "Add Expense"}
            {""}
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

export default ExpenseForm;
