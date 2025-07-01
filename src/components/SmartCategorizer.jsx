// components/SmartCategorizer.js
import React, { useState } from "react";
import { Sparkles, Loader } from "lucide-react";
import geminiService from "../services/geminiService";

const SmartCategorizer = ({ description, amount, onCategorySelect }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const handleCategorize = async () => {
    if (!description.trim()) return;

    setLoading(true);
    try {
      const result = await geminiService.categorizeExpense(description, amount);
      setSuggestion(result);

      // Extract category from response
      const categoryMatch = result.match(/Category:\s*([^-]+)/i);
      if (categoryMatch && onCategorySelect) {
        const category = categoryMatch[1].trim();
        onCategorySelect(category);
      }
    } catch {
      setSuggestion("Could not categorize. Please select manually.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleCategorize}
        disabled={loading || !description.trim()}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
        style={{ backgroundColor: "#E8DCC0", color: "#543310" }}
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span>{loading ? "Categorizing..." : "Smart Categorize"}</span>
      </button>

      {suggestion && (
        <div
          className="p-3 rounded-xl text-xs"
          style={{
            backgroundColor: "#F8F4E1",
            border: "1px solid #E8DCC0",
            color: "#543310",
          }}
        >
          <strong>AI Suggestion:</strong> {suggestion}
        </div>
      )}
    </div>
  );
};

export default SmartCategorizer;
