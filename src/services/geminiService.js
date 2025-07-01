// services/geminiService.js
import axios from "axios";

// For Vite projects, use import.meta.env; for Create React App, use process.env (ensure .env is set up correctly)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

class GeminiService {
  async generateContent(prompt) {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get AI response");
    }
  }

  async categorizeExpense(description, amount) {
    const prompt = `Categorize this expense into one of these categories: Food, Transportation, Entertainment, Shopping, Bills, Health, Education, Travel, Other. 
    
    Expense: "${description}" - ₱${amount}
    
    Respond with only the category name and a brief 1-sentence explanation.
    Format: "Category: [category] - [explanation]"`;

    return await this.generateContent(prompt);
  }

  async getBudgetingAdvice(expenses, budgets, totalSpent, totalBudget) {
    const expenseList = Object.values(expenses)
      .map((exp) => `${exp.name}: ₱${exp.amount}`)
      .join(", ");

    const prompt = `As a financial advisor, analyze this spending pattern and provide 3 concise budgeting tips:
    
    Total Budget: ₱${totalBudget}
    Total Spent: ₱${totalSpent}
    Recent Expenses: ${expenseList}
    
    Give practical, actionable advice in 3 bullet points. Keep each tip under 30 words.`;

    return await this.generateContent(prompt);
  }

  async getSmartInsights(budgets) {
    const budgetCategories = Object.values(budgets)
      .map((b) => `${b.category}: ₱${b.spent}/₱${b.amount}`)
      .join(", ");

    const prompt = `Analyze this budget vs spending data and provide 2 key insights:
    
    Budget Status: ${budgetCategories}
    
    Focus on overspending alerts and savings opportunities. Keep response under 100 words.`;

    return await this.generateContent(prompt);
  }
}

export default new GeminiService();
