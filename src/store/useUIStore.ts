import { create } from 'zustand';

interface UIState {
  isSupportModalOpen: boolean;
  openSupportModal: () => void;
  closeSupportModal: () => void;
  
  isCommunityModalOpen: boolean;
  openCommunityModal: () => void;
  closeCommunityModal: () => void;
  
  hasSeenCommunityModal: boolean;
  setHasSeenCommunityModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSupportModalOpen: false,
  openSupportModal: () => set({ isSupportModalOpen: true }),
  closeSupportModal: () => set({ isSupportModalOpen: false }),
  
  isCommunityModalOpen: false,
  openCommunityModal: () => set({ isCommunityModalOpen: true }),
  closeCommunityModal: () => set({ isCommunityModalOpen: false }),
  
  hasSeenCommunityModal: typeof window !== 'undefined' 
    ? localStorage.getItem('hasSeenCommunityModal') === 'true'
    : false,
  setHasSeenCommunityModal: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenCommunityModal', 'true');
    }
    set({ hasSeenCommunityModal: true });
  },
}));
