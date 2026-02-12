// lib/store.ts
import { create } from 'zustand';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  instituteLevel: string;
  instituteType: string;
  photoUrl?: string;
}

interface ProfileState {
  profile: UserProfile;
  isEditing: {
    name: boolean;
    phone: boolean;
    location: boolean;
    instituteLevel: boolean;
    instituteType: boolean;
    password: boolean;
  };
  setProfile: (data: Partial<UserProfile>) => void;
  toggleEdit: (field: keyof ProfileState['isEditing']) => void;
  setEditing: (field: keyof ProfileState['isEditing'], value: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+234 823 456 7890",
    location: "Lagos, Nigeria",
    instituteLevel: "Mid level",
    instituteType: "School",
  },
  isEditing: {
    name: false,
    phone: false,
    location: false,
    instituteLevel: false,
    instituteType: false,
    password: false,
  },
  setProfile: (data) =>
    set((state) => ({ profile: { ...state.profile, ...data } })),
  toggleEdit: (field) =>
    set((state) => ({
      isEditing: {
        ...state.isEditing,
        [field]: !state.isEditing[field],
      },
    })),
  setEditing: (field, value) =>
    set((state) => ({
      isEditing: { ...state.isEditing, [field]: value },
    })),
}));