/**
 * ArthSaathi - Local Demo AI Engine
 * Provides detailed financial responses and explanations locally without external APIs.
 */

const knowledgeBase: { keywords: string[]; response: string }[] = [
  {
    keywords: ['hi', 'hello', 'namaste', 'hey', 'start', 'greetings'],
    response: `Namaste! 👋

I'm ArthSaathi AI Coach. I can help with:
• **Budgeting**: Plan savings and emergency funds
• **Mutual Funds & SIP**: Start investing from scratch
• **Fixed Deposits (FD)**: Secure short-term goals
• **Insurance**: Term vs health insurance plans
• **Tax Saving**: Deductions under Section 80C
• **Credit Scores**: How CIBIL works and how to improve it
• **Government Schemes**: PMJDY, Mudra, APY, PMSBY, and more
• **UPI & Scam Protection**: Stay safe online

What would you like to learn today?`,
  },
  {
    keywords: ['sip', 'systematic investment', 'mutual fund', 'mutual funds'],
    response: `**Systematic Investment Plan (SIP) & Mutual Funds** 📈

A SIP allows you to invest a fixed sum of money regularly (e.g., monthly) into a mutual fund. It's the most effective wealth-building tool for salaried individuals.

**Why SIP is powerful:**
• **Rupee Cost Averaging**: You buy more units when prices are low and fewer when prices are high. No need to time the market!
• **Power of Compounding**: Starting a ₹5,000/month SIP at age 22 vs age 30 can double your final corpus at retirement.
• **Convenience**: Set up auto-debit on salary day so you save before you spend.

**Basic Portfolio for Beginners:**
• **Nifty 50 Index Fund** (60% allocation) - Safest equity fund, tracks top 50 Indian companies.
• **Large & Midcap Fund** (20% allocation) - Balance of stability and higher growth.
• **Liquid / Debt Fund** (20% allocation) - Low risk, ideal for emergency cash.

💡 **Action Tip**: You can start a SIP with as little as ₹500 on platforms like Groww, Zerodha Coin, or Paytm Money.`,
  },
  {
    keywords: ['budget', 'saving', 'savings', 'emergency fund'],
    response: `**Budgeting, Savings & Emergency Funds** 💰

Good financial health starts with a simple rule: **Income - Savings = Expenses**. Don't spend first and save what is left.

**The 50-30-20 Rule for Budgeting:**
• **50% Needs**: Rent, groceries, utility bills, insurance.
• **30% Wants**: Dining out, shopping, subscriptions, travel.
• **20% Savings**: SIPs, PF, building your emergency fund.

**Building an Emergency Fund:**
• **What**: 3 to 6 months of your non-discretionary living expenses.
• **Why**: Job loss, medical emergencies, or urgent house/car repairs. Without this, you will be forced to take high-interest loans (24-36%).
• **Where**: Keep it in a liquid mutual fund or a sweeps-in FD so it's easily accessible but earns more than standard savings account interest.

💡 **Action Tip**: If your monthly expenses are ₹30,000, aim for a ₹1.8 Lakh emergency fund. Start by saving ₹5,000/month specifically for this.`,
  },
  {
    keywords: ['fd', 'fixed deposit', 'fixed deposits'],
    response: `**Fixed Deposits (FD) in India** 🏦

Fixed Deposits are low-risk debt instruments offered by banks and corporate NBFCs. They guarantee principal and interest payouts.

**Key Features:**
• **Safety**: Under the DICGC, deposits in a bank (principal + interest) are insured up to ₹5 Lakhs.
• **Liquidity**: Premature withdrawals are allowed but usually incur a 0.5% - 1% interest penalty.
• **Taxation**: Interest earned is fully taxable under "Income from Other Sources" at your tax slab rate. If interest exceeds ₹40,000, banks deduct TDS (10%).

**When to use FDs:**
• Parking your emergency fund.
• Safe keeping for short-term goals (< 3 years) like a down payment or vacation.

💡 **Smart Tip**: Split large sums across different banks (e.g., SBI, HDFC, ICICI) to keep balances below the ₹5L insurance limit per bank.`,
  },
  {
    keywords: ['stocks', 'stock', 'share market', 'equity market'],
    response: `**Introduction to Stock Investing** 📊

Direct stock investing means buying equity shares of individual publicly listed companies on the NSE or BSE.

**Golden Rules for Beginners:**
• **Never Buy Tips**: Avoid telegram groups or WhatsApp advice. Only invest in companies whose business model you understand.
• **Diversify**: Don't put all your money in one sector. Spread across Tech, Banking, Pharma, and FMCG.
• **Long-term Horizon**: Equities can be volatile. Only invest money you don't need for the next 5+ years.
• **Start with Index Funds**: If you don't have time to read balance sheets, buy mutual funds tracking the Nifty 50 or Sensex.

💡 **Platform**: Open a demat account on Zerodha, Groww, or Angel One to buy stocks directly.`,
  },
  {
    keywords: ['term insurance', 'health insurance', 'insurance'],
    response: `**Essential Insurance Checklist for Beginners** 🛡️

Do not look at insurance as an investment. Insurance is a protection tool; keep it separate from investments (avoid ULIPs and Endowment plans!).

**1. Term Insurance (Life Cover):**
• **What**: Pure cover. Pays out only in the event of death. Extremely cheap.
• **Who needs it**: Anyone who has financial dependents.
• **How much**: 10 to 15 times your annual salary. (e.g., if you earn ₹5 Lakhs/year, buy a ₹75 Lakh cover).
• **When**: Buy before age 30 — premiums are locked in and are 40-50% cheaper.

**2. Health Insurance (Mediclaim):**
• **Why**: A single hospitalization can wipe out years of savings. Don't rely solely on corporate insurance.
• **How much**: Minimum ₹5 Lakh to ₹10 Lakh cover.
• **What to look for**: Cashless network banks, no sub-limits on room rent, low waiting periods for pre-existing diseases.

💡 **Action Tip**: Buy a standard term plan (e.g., HDFC Click2Protect, Max Life) and a standalone health plan (e.g., Care, Star Health) early.`,
  },
  {
    keywords: ['80c', 'tax saving', 'tax', 'income tax'],
    response: `**Section 80C & Smart Tax Saving** 📋

Under Section 80C of the Income Tax Act (Old Tax Regime), you can deduct up to **₹1.5 Lakhs** from your taxable income annually.

**Best 80C Tax-Saving Options:**
1. **ELSS Mutual Funds**: Highest returns (12-15% historically) + shortest lock-in period (3 years).
2. **Public Provident Fund (PPF)**: Guaranteed sovereign return (currently 7.1%) + tax-free interest + 15-year lock-in. Great for retirement.
3. **EPF / VPF**: Automatic salary deduction, excellent rates (8.15%+), sovereign backed.
4. **National Pension Scheme (NPS)**: Deductions under 80C + extra ₹50,000 under 80CCD(1B). Lock-in till age 60.

**Beyond 80C:**
• **Section 80D**: Up to ₹25,000 deduction on health insurance premium.
• **Section 24(b)**: Up to ₹2 Lakhs interest on home loans.
• **HRA**: Exemption on house rent paid.

💡 **Tip**: If you are in the 20% or 30% slab, maxing out 80C saves you ₹30,000 to ₹45,000 in taxes each year!`,
  },
  {
    keywords: ['credit score', 'cibil', 'cibil score', 'credit'],
    response: `**Demystifying Credit Scores & CIBIL** 💳

Your credit score (calculated by bureaus like CIBIL, Experian, Equifax) ranges from 300 to 900. It measures your creditworthiness based on loan/card payment histories.

**Why a 750+ score is critical:**
• Low interest rates on home/car loans (can save you ₹5-10 Lakhs over a 20-year loan).
• Fast-tracked loan approvals.
• High-limit premium credit cards.

**How to build and improve your score:**
1. **Pay 100% On Time**: Even one delayed credit card payment or loan EMI drops your score significantly.
2. **Credit Utilization Ratio**: Keep total monthly credit card spends under 30% of your limit.
3. **Credit Mix**: A healthy mix of secured loans (home/gold) and unsecured (credit card) helps.
4. **Avoid Multiple Applications**: Don't apply for 3 cards at once. Each inquiry drops your score by a few points.

💡 **Action Tip**: Check your credit report free once a year on CIBIL's official website or monthly on platforms like Paisabazaar, OneScore, or GPay.`,
  },
  {
    keywords: ['pmjdy', 'jan dhan', 'mudra', 'apy', 'pmsby', 'schemes', 'government schemes', 'government scheme'],
    response: `**Government Financial Schemes for Everyone** 🏛️

The Indian Government offers several high-value, subsidized financial schemes. Check your eligibility:

1. **PM Jan Dhan Yojana (PMJDY)**:
   • **What**: Zero-balance savings account.
   • **Benefits**: Free RuPay debit card, ₹2 Lakh accidental insurance, ₹10,000 overdraft limit.

2. **PM Mudra Yojana**:
   • **What**: Collateral-free business loans up to ₹10 Lakhs.
   • **Categories**: Shishu (up to ₹50k), Kishor (up to ₹5L), Tarun (up to ₹10L).

3. **Atal Pension Yojana (APY)**:
   • **What**: Pension for unorganized sector workers (age 18-40).
   • **Benefits**: Guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60 depending on premium contribution (starts as low as ₹42/month).

4. **PM Suraksha Bima Yojana (PMSBY)**:
   • **What**: Accidental death/disability insurance.
   • **Premium**: Just ₹20 per year auto-debited! Cover is ₹2 Lakhs.

💡 **Apply**: Visit any public sector bank or post office branch to enroll in APY, PMSBY, or open a PMJDY account.`,
  },
  {
    keywords: ['otp', 'fraud', 'scam', 'kyc', 'safety', 'upi safety'],
    response: `**UPI Safety & Financial Scam Shield** 🔐

Online fraud is rising rapidly in India. Knowing these core rules will protect 99% of your money.

**Top Digital Scams:**
1. **KYC Update Scam**: SMS/WhatsApp claims your SIM or bank account is blocked. Demands you click a link or download an app (AnyDesk, TeamViewer) which gives them control of your phone.
2. **UPI Collect Request**: Scammer sends a request to collect money on GPay/PhonePe, claiming you won a lottery. **To receive money, you NEVER enter your UPI PIN.**
3. **OTP Scam**: Scammer calls posing as a bank manager, asking for the OTP to "verify" or "reactivate" a card. Never share OTPs.
4. **Lottery/Part-time Job scams**: Messages offering ₹5,000/day for liking YouTube videos or reviews. They will ask you to pay a "deposit" to withdraw your earnings.

**Safety Checklist:**
• Never click shortened links (bit.ly, tinyurl) from unknown numbers.
• Banks will NEVER call you to ask for OTP, UPI PIN, password, or CVV.
• Report any financial scam immediately on the National Cybercrime Portal: **cybercrime.gov.in** or call the toll-free helpline **1930** within 1 hour.`,
  },
];

const fallbackResponse = `That's a very interesting financial question! 🤔

Since I am running in **Offline Demo AI Mode**, here is a general financial health checklist you should follow:
1. **Pay Yourself First**: Invest 20% of your earnings on the day you receive your salary.
2. **Emergency Reserve**: Park 6 months of expenses in a high-yield savings account or liquid fund.
3. **Pure Protection**: Buy a term insurance plan and a health insurance policy separately. Never combine insurance and investment.
4. **Beat Inflation**: Invest in mutual funds (specifically index funds) for goals that are 5+ years away.

**To learn more, try asking me about:**
• What is a SIP?
• How much emergency fund should I keep?
• How does 80C work?
• How to improve CIBIL/credit score?
• What insurance should a beginner buy?
• How do Mudra or PMSBY government schemes work?`;

export function generateFinancialResponse(message: string): string {
  const query = message.trim().toLowerCase();
  
  if (!query) {
    return "Please ask a question so I can help you understand finance!";
  }

  // Exact matching or substring matching on keywords
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => {
      // Check if message contains the keyword as a word or substring
      return query.includes(keyword);
    })) {
      return item.response;
    }
  }

  return fallbackResponse;
}
