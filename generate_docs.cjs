const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Information');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const docs = {
  'Project_Overview.md': '# Project Overview\nArthSaathi AI is an intelligent financial companion designed to help users track budgets, learn financial literacy, set goals, and detect scams using local AI.\n',
  'Problem_Statement.md': '# Problem Statement\nMany individuals lack basic financial literacy, struggle to track expenses, and frequently fall victim to online scams due to a lack of accessible, real-time guidance.\n',
  'Solution.md': '# Solution\nAn all-in-one platform providing automated budget insights, interactive financial education, goal tracking, and AI-powered scam detection.\n',
  'Features.md': '# Features\n1. AI Coach\n2. Scam Shield\n3. Budget Tracker\n4. Goal Planner\n5. Financial Health Score\n6. Government Schemes Finder\n',
  'User_Flow.md': '# User Flow\n1. Landing Page -> Google Auth -> Onboarding -> Dashboard.\n2. Dashboard -> Add Transactions / Check AI Coach.\n3. Explore Sidebar -> Scam Shield, Budget, Learn, Health Score.\n',
  'Tech_Stack.md': '# Tech Stack\n- **Frontend**: React (Vite), TypeScript\n- **Styling**: Vanilla CSS, Framer Motion\n- **State Management**: Zustand\n- **Routing**: React Router DOM\n- **Charts**: Recharts\n- **Auth**: Google OAuth 2.0\n',
  'Folder_Structure.md': '# Folder Structure\n- `/src`\n  - `/components`: Reusable UI elements\n  - `/pages`: Main route views\n  - `/store`: Zustand stores\n  - `/utils`: Helper functions and mock DB\n',
  'Database_Schema.md': '# Database Schema\n(Local Storage Mock DB)\n\n**User Profile**\n- `id`, `name`, `email`, `income`, `expenses`, `onboarding_completed`\n\n**Transactions**\n- `id`, `type`, `amount`, `category`, `date`\n',
  'Architecture.md': '# Architecture\nClient-side heavy architecture with Zustand for state persistence and LocalStorage acting as the primary database layer. Auth is managed via Google OAuth JWT tokens.\n',
  'API_Documentation.md': '# API Documentation\nCurrently, the app relies on internal Zustand state and a MockDB utility class instead of external REST APIs.\n',
  'Routes.md': '# Routes\n- `/`: Landing (Redirects if auth)\n- `/onboarding`: Profile setup\n- `/dashboard`: Main overview\n- `/budget`: Transactions\n- `/health`: Score\n- `/scam-shield`: Fraud detection\n',
  'AI_Features.md': '# AI Features\n- **Scam Shield**: Uses Regex heuristics to detect phishing and fraud messages.\n- **AI Coach**: Contextual tips based on user spending habits.\n- **Health Score**: Computes a dynamic score based on 7 financial pillars.\n',
  'Team_Roles.md': '# Team Roles\n- Lead Developer (Full Stack)\n- UI/UX Designer\n- Product Manager\n',
  'Future_Scope.md': '# Future Scope\n- Connect real bank APIs via Account Aggregator.\n- Implement real LLM integration (OpenAI/Gemini) for the AI Coach.\n- Push notifications for bill reminders.\n',
  'Setup_Guide.md': '# Setup Guide\n1. `npm install`\n2. Create `.env` and add `VITE_GOOGLE_CLIENT_ID`\n3. `npm run dev`\n',
  'Deployment_Guide.md': '# Deployment Guide\n1. Build: `npm run build`\n2. Deploy to Vercel/Netlify.\n3. Add `VITE_GOOGLE_CLIENT_ID` to hosting provider environment variables.\n4. Add exact domain to Google Cloud Console OAuth Origins.\n',
};

for (const [filename, content] of Object.entries(docs)) {
  fs.writeFileSync(path.join(dir, filename), content, 'utf-8');
}
console.log('Successfully generated all 16 Information files.');
