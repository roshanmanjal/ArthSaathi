export const mockExpenses = [
  { month: 'Jan', income: 42000, expenses: 28000, savings: 14000 },
  { month: 'Feb', income: 42000, expenses: 31000, savings: 11000 },
  { month: 'Mar', income: 45000, expenses: 27000, savings: 18000 },
  { month: 'Apr', income: 42000, expenses: 33000, savings: 9000 },
  { month: 'May', income: 48000, expenses: 29000, savings: 19000 },
  { month: 'Jun', income: 42000, expenses: 25000, savings: 17000 },
];
 
export const mockCategories = [
  { name: 'Rent', amount: 12000, percent: 40, color: '#3b82f6' },
  { name: 'Food', amount: 5500, percent: 18, color: '#10b981' },
  { name: 'Transport', amount: 3000, percent: 10, color: '#f59e0b' },
  { name: 'Entertainment', amount: 2500, percent: 8, color: '#8b5cf6' },
  { name: 'Utilities', amount: 2000, percent: 7, color: '#ec4899' },
  { name: 'Others', amount: 5000, percent: 17, color: '#6b7280' },
];
 
export const mockGoals = [
  { id: 1, name: 'Emergency Fund', target: 150000, saved: 87000, emoji: '🛡️', deadline: 'Dec 2025', monthlyNeeded: 10500 },
  { id: 2, name: 'New Laptop', target: 80000, saved: 32000, emoji: '💻', deadline: 'Mar 2025', monthlyNeeded: 12000 },
  { id: 3, name: 'Goa Vacation', target: 40000, saved: 18000, emoji: '🏖️', deadline: 'Jan 2025', monthlyNeeded: 5500 },
  { id: 4, name: 'Down Payment', target: 500000, saved: 120000, emoji: '🏠', deadline: 'Dec 2026', monthlyNeeded: 15000 },
];
 
export const mockSchemes = [
  { name: 'PM Jan Dhan Yojana', benefit: 'Zero balance savings account + ₹2L accident insurance', eligibility: 'All Indians', category: 'Banking', tag: 'Popular' },
  { name: 'Sukanya Samriddhi Yojana', benefit: '8.2% interest + tax benefits for girl child education', eligibility: 'Girl child under 10', category: 'Savings', tag: 'High Returns' },
  { name: 'Atal Pension Yojana', benefit: '₹1000–₹5000/month pension after 60', eligibility: '18–40 years, unorganized sector', category: 'Pension', tag: 'Retirement' },
  { name: 'PM Mudra Yojana', benefit: 'Business loan up to ₹10L without collateral', eligibility: 'Small business owners', category: 'Loan', tag: 'Business' },
  { name: 'PM Kisan Samman Nidhi', benefit: '₹6000/year direct transfer to farmers', eligibility: 'Small & marginal farmers', category: 'Agriculture', tag: 'Farmers' },
  { name: 'PMSBY Accident Insurance', benefit: '₹2L accident death cover for ₹20/year premium', eligibility: 'Age 18–70, bank account', category: 'Insurance', tag: 'Must Have' },
];
 
export const mockLessons = [
  { id: 1, title: 'What is SIP?', duration: '5 min', xp: 50, done: true, category: 'Investing' },
  { id: 2, title: 'Emergency Fund 101', duration: '4 min', xp: 40, done: true, category: 'Savings' },
  { id: 3, title: 'How to Read Credit Score', duration: '6 min', xp: 60, done: false, category: 'Credit' },
  { id: 4, title: 'Term Insurance vs ULIP', duration: '7 min', xp: 70, done: false, category: 'Insurance' },
  { id: 5, title: 'Tax Saving under 80C', duration: '8 min', xp: 80, done: false, category: 'Tax' },
  { id: 6, title: 'UPI Scams to Avoid', duration: '5 min', xp: 50, done: false, category: 'Safety' },
];
 
export const mockAlerts = [
  { type: 'danger', message: 'Unusual: ₹45,000 transfer requested via WhatsApp link', time: '2h ago' },
  { type: 'warning', message: 'Spending 23% above budget in Food category this month', time: '1d ago' },
  { type: 'success', message: 'Emergency fund reached 58% of target! Keep going 💪', time: '2d ago' },
];
 
export const healthScoreBreakdown = [
  { label: 'Savings Rate', score: 72, max: 100, tip: 'Save at least 20% of income' },
  { label: 'Debt Management', score: 85, max: 100, tip: 'Low debt is great!' },
  { label: 'Emergency Fund', score: 58, max: 100, tip: 'Need 6 months of expenses' },
  { label: 'Budget Adherence', score: 63, max: 100, tip: 'Stick to monthly budget' },
  { label: 'Investment Portfolio', score: 45, max: 100, tip: 'Start a SIP today' },
  { label: 'Scam Awareness', score: 90, max: 100, tip: 'You\'re vigilant!' },
  { label: 'Financial Knowledge', score: 55, max: 100, tip: 'Complete more lessons' },
];