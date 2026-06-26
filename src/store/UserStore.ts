import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: string;
  occupation: string;
  income: string;
  city: string;
  avatar: string;
  currency: string;
  goal: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  age: '',
  occupation: '',
  income: '',
  city: '',
  avatar: '',
  currency: 'INR',
  goal: '',
};

interface ProfileState {
  profile: UserProfile;
  setProfile: (updater: Partial<UserProfile> | ((p: UserProfile) => UserProfile)) => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      setProfile: (updater) => set((state) => {
        const nextProfile = typeof updater === 'function' 
          ? updater(state.profile) 
          : { ...state.profile, ...updater };
          
        if (nextProfile.name && nextProfile.name !== state.profile.name) {
          nextProfile.avatar = nextProfile.name.charAt(0).toUpperCase();
        }
        
        return { profile: nextProfile };
      }),
    }),
    {
      name: 'as_profile',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
