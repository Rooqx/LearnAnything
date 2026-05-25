import { create } from 'zustand';

export type ChatSessionStatus = 'active' | 'generating' | 'completed' | 'failed' | null;

interface ChatSessionState {
  sessionId: string | null;
  status: ChatSessionStatus;
  
  /** 
   * Reads from localStorage and populates state.
   * Call this on app/component load to instantly show the cached state 
   * (e.g., the loading screen) before the DB responds.
   */
  initFromStorage: () => void;
  
  /** 
   * Call this when the webhook returns {"message": "course_generation_starting"}
   */
  setGenerating: (sessionId: string) => void;
  
  /** 
   * Clears both the Zustand state and the localStorage keys simultaneously.
   * Use this when a session is completed, failed, or cancelled.
   */
  clearSession: () => void;
  
  /** 
   * The source of truth sync. 
   * Pass the result of `GET /api/chat/session/active` here.
   */
  syncFromDB: (dbSession: { id: string; status: string } | null) => void;
}

export const useChatSessionStore = create<ChatSessionState>((set) => ({
  sessionId: null,
  status: null,

  initFromStorage: () => {
    // Ensure we are in the browser
    if (typeof window === 'undefined') return;
    
    const storedSessionId = localStorage.getItem('generatingSessionId');
    const storedStatus = localStorage.getItem('generationStatus') as ChatSessionStatus;
    
    if (storedSessionId && storedStatus) {
      set({ sessionId: storedSessionId, status: storedStatus });
    }
  },

  setGenerating: (sessionId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('generatingSessionId', sessionId);
      localStorage.setItem('generationStatus', 'generating');
    }
    set({ sessionId, status: 'generating' });
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      // "Always clear both keys together — never one without the other"
      localStorage.removeItem('generatingSessionId');
      localStorage.removeItem('generationStatus');
    }
    set({ sessionId: null, status: null });
  },

  syncFromDB: (dbSession) => {
    if (!dbSession) {
      // If DB has no session -> clear localStorage, show fresh chat
      if (typeof window !== 'undefined') {
        localStorage.removeItem('generatingSessionId');
        localStorage.removeItem('generationStatus');
      }
      set({ sessionId: null, status: null });
      return;
    }

    const { id, status } = dbSession;

    if (status === 'generating' || status === 'active') {
      // If DB says generating (or active) -> keep loading screen / restore UI state
      if (typeof window !== 'undefined') {
        localStorage.setItem('generatingSessionId', id);
        localStorage.setItem('generationStatus', status);
      }
      set({ sessionId: id, status: status as ChatSessionStatus });
    } else {
      // If DB says completed or failed -> clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('generatingSessionId');
        localStorage.removeItem('generationStatus');
      }
      set({ sessionId: null, status: null }); 
      // The React component will observe the `status` change or DB response to navigate/show error
    }
  },
}));
