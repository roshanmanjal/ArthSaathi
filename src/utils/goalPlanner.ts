/**
 * ArthSaathi - Local Goal Planner
 * Generates custom financial plans for various goals (Emergency Funds, Travel, Electronics, Property, etc.)
 */

export function generateGoalPlan(goal: { name: string; target: number; saved: number; deadline?: string; monthlyNeeded: number }): string {
  const nameLower = goal.name.toLowerCase();
  const monthlyStr = goal.monthlyNeeded.toLocaleString('en-IN');
  const targetStr = goal.target.toLocaleString('en-IN');
  const progressPct = Math.round((goal.saved / goal.target) * 100);

  if (nameLower.includes('emergency') || nameLower.includes('safety') || nameLower.includes('buffer')) {
    return `**Plan for ${goal.name} (Target: ₹${targetStr})** 🛡️
• **Save ₹${monthlyStr} per month** to hit your goal on schedule.
• **Cut back on wants**: Reduce entertainment/dining out by 15% and direct the difference to this fund.
• **Automate transfers**: Set up an auto-debit on salary day to a separate sweeps-in account or liquid mutual fund.
• **Use a separate bank account**: Don't keep this in your primary spending account or you will spend it.
• **Current progress**: You have funded ${progressPct}% of your emergency buffer. Keep pushing!`;
  }

  if (nameLower.includes('laptop') || nameLower.includes('phone') || nameLower.includes('mobile') || nameLower.includes('tech') || nameLower.includes('gadget')) {
    return `**Plan for ${goal.name} (Target: ₹${targetStr})** 💻
• **Save ₹${monthlyStr} per month** to purchase without loans.
• **Avoid No-Cost EMIs**: Retailers build interest charges into the product price. Buy with cash for potential cash discounts!
• **Compare deals**: Look for discounts during Dussehra/Diwali or Amazon Great Indian Festival sales.
• **Sell old device**: Recoup ₹5,000–₹15,000 by trading in your existing device to lower the target.
• **Investment option**: Park monthly savings in a simple Bank Recurring Deposit (RD) matching the deadline.`;
  }

  if (nameLower.includes('vacation') || nameLower.includes('travel') || nameLower.includes('goa') || nameLower.includes('trip') || nameLower.includes('holiday')) {
    return `**Plan for ${goal.name} (Target: ₹${targetStr})** 🏖️
• **Save ₹${monthlyStr} per month** to travel stress-free without credit card debt.
• **Book in advance**: Book flights and hotels 3-4 months early to save up to 30% of total travel costs.
• **Off-season travel**: Consider travelling during shoulder season (e.g. Goa in September) for massive discounts.
• **Track extra income**: Send bonuses, cash gifts, or freelance income straight to this travel jar.
• **Investment option**: Save in a low-risk liquid mutual fund or a sweep account for immediate accessibility.`;
  }

  if (nameLower.includes('house') || nameLower.includes('home') || nameLower.includes('property') || nameLower.includes('downpayment') || nameLower.includes('down payment')) {
    return `**Plan for ${goal.name} (Target: ₹${targetStr})** 🏠
• **Save ₹${monthlyStr} per month** to build your down payment corpus.
• **Look for 20% down**: Aiming to pay 20% down instead of 10% reduces your future home loan interest load by lakhs.
• **Arbitrage / Debt Funds**: Since this is a medium-to-long term goal, park monthly savings in Arbitrage Mutual Funds (taxed as equity, low volatility) or Short Term Debt Funds.
• **Increase savings annually**: Step up your monthly savings by 10% every time you get a salary increment.
• **Action step**: Check your CIBIL score regularly. A 750+ score gets you the lowest loan interest rates.`;
  }

  // Default fallback goal plan
  return `**Plan for ${goal.name} (Target: ₹${targetStr})** 🎯
• **Save ₹${monthlyStr} per month** to achieve your goal by the deadline.
• **Automate**: Establish a Recurring Deposit (RD) or mutual fund SIP that executes on the 1st of every month.
• **Audit monthly costs**: Review bank statements for minor leaky expenses (unused subscriptions, excessive app orders).
• **Keep it separate**: Maintain a designated account/investing portfolio for this goal so it doesn't get spent on other categories.
• **Current status**: You are ${progressPct}% of the way there. Keep up the disciplined saving!`;
}
