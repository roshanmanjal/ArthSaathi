/**
 * ArthSaathi - Local Budget Advisor
 * Analyzes spending habits and returns customized, actionable budgeting recommendations.
 */

export interface BudgetAdviceInput {
  income: number;
  foodSpend: number;
  entertainmentSpend: number;
  savingsRate: number;
  emergencyFundSaved: number;
  emergencyFundTarget: number;
}

export function generateBudgetAdvice(input: BudgetAdviceInput): string[] {
  const tips: string[] = [];
  const { income, foodSpend, entertainmentSpend, savingsRate, emergencyFundSaved, emergencyFundTarget } = input;

  // Rule 1: Savings Rate under 20%
  if (savingsRate < 20) {
    const recommendedIncrease = Math.round(income * 0.05); // suggest saving 5% more
    tips.push(`• **Increase Savings**: Your savings rate is currently ${savingsRate}% (below the healthy 20% benchmark). Try to increase your monthly savings by at least ₹${recommendedIncrease.toLocaleString('en-IN')} by automating transfers on salary day.`);
  } else {
    tips.push(`• **Solid Savings Rate**: Great job! You are saving ${savingsRate}% of your income. Keep this up, and invest it systematically.`);
  }

  // Rule 2: Food Spending above 25% of income
  const foodPercent = Math.round((foodSpend / income) * 100);
  if (foodPercent > 25) {
    const excess = foodSpend - Math.round(income * 0.15);
    tips.push(`• **High Food Expenses**: Food spending accounts for ${foodPercent}% of your income. Cooking meals at home 3 extra days a week can easily save you up to ₹${Math.min(excess, 2500).toLocaleString('en-IN')} monthly.`);
  } else {
    tips.push(`• **Food Spending in Check**: Your food expenses represent ${foodPercent}% of your income, which is well within the recommended range.`);
  }

  // Rule 3: Entertainment Spending above 10% of income
  const entPercent = Math.round((entertainmentSpend / income) * 100);
  if (entPercent > 10) {
    tips.push(`• **Control Discretionary Spends**: You spend ${entPercent}% on entertainment. Audit your subscriptions (Netflix, Prime, gym memberships you don't use) and limit dining out on weekends to save an extra ₹1,500/month.`);
  }

  // Rule 4: Emergency Fund Low
  const fundPct = Math.round((emergencyFundSaved / emergencyFundTarget) * 100);
  if (emergencyFundSaved < emergencyFundTarget) {
    tips.push(`• **Build Emergency Fund**: Your emergency fund is only at ${fundPct}% of your ₹${emergencyFundTarget.toLocaleString('en-IN')} target (6 months of living expenses). Allocate ₹3,000–₹5,000 monthly to a separate high-yield savings account until it is fully funded.`);
  } else {
    tips.push(`• **Emergency Fund Secure**: Your emergency reserve is fully funded! This shields you from needing high-interest personal loans during tough times.`);
  }

  // General helpful tips if tips list is short
  if (tips.length < 3) {
    tips.push(`• **Try Envelope Method**: Split cash or UPI wallets for specific categories (groceries, leisure, transport) to prevent overspending.`);
  }

  return tips;
}
