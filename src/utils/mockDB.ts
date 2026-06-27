export interface DBUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  provider: string;
  onboarding_completed: boolean;
  joinedAt: string;
  // Snapshots of their Zustand stores
  profileSnapshot?: any;
  transactionsSnapshot?: any;
  goalsSnapshot?: any;
  learningSnapshot?: any;
}

const DB_KEY = 'mock_database_users';

export const MockDB = {
  getUsers: (): DBUser[] => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[DB] Failed to parse users', e);
      return [];
    }
  },

  getUserByEmail: (email: string): DBUser | undefined => {
    console.log(`[DB] Fetching user by email: ${email}`);
    const users = MockDB.getUsers();
    return users.find(u => u.email === email);
  },

  createUser: (userData: Partial<DBUser>): DBUser => {
    console.log(`[DB] Creating new user: ${userData.email}`);
    const users = MockDB.getUsers();
    
    if (users.find(u => u.email === userData.email)) {
      console.error(`[DB] Error: User with email ${userData.email} already exists!`);
      throw new Error('User already exists');
    }
    
    const newUser: DBUser = {
      id: userData.id || Date.now().toString(),
      email: userData.email!,
      name: userData.name || '',
      avatar: userData.avatar || '',
      provider: userData.provider || 'google',
      onboarding_completed: false,
      joinedAt: userData.joinedAt || new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    console.log(`[DB] User created successfully.`);
    return newUser;
  },

  updateUser: (email: string, updates: Partial<DBUser>) => {
    console.log(`[DB] Updating user: ${email}`);
    const users = MockDB.getUsers();
    const index = users.findIndex(u => u.email === email);
    
    if (index === -1) {
      console.error(`[DB] Cannot update: User ${email} not found`);
      throw new Error('User not found');
    }
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    console.log(`[DB] User updated successfully.`);
  },

  saveSessionSnapshots: (email: string) => {
    console.log(`[DB] Saving session snapshots to database for ${email}`);
    try {
      const profile = JSON.parse(localStorage.getItem('as_profile') || '{}');
      const transactions = JSON.parse(localStorage.getItem('as_transactions') || '{}');
      const goals = JSON.parse(localStorage.getItem('as_goals') || '{}');
      const learning = JSON.parse(localStorage.getItem('as_lessonProgress') || '{}');

      MockDB.updateUser(email, {
        profileSnapshot: profile,
        transactionsSnapshot: transactions,
        goalsSnapshot: goals,
        learningSnapshot: learning
      });
    } catch (e) {
      console.error('[DB] Failed to save session snapshots', e);
    }
  },

  restoreSessionSnapshots: (email: string) => {
    console.log(`[DB] Restoring session snapshots for ${email}`);
    const user = MockDB.getUserByEmail(email);
    if (!user) return;

    if (user.profileSnapshot) localStorage.setItem('as_profile', JSON.stringify(user.profileSnapshot));
    if (user.transactionsSnapshot) localStorage.setItem('as_transactions', JSON.stringify(user.transactionsSnapshot));
    if (user.goalsSnapshot) localStorage.setItem('as_goals', JSON.stringify(user.goalsSnapshot));
    if (user.learningSnapshot) localStorage.setItem('as_lessonProgress', JSON.stringify(user.learningSnapshot));
  }
};
