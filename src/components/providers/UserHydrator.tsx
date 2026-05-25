/* ============================================================
   UserHydrator
   Client component that ensures useUserStore is populated.
   If the Zustand store has no user (e.g. localStorage was cleared),
   it fetches the profile from the server and hydrates the store.
   This runs once on mount inside the (main) layout.
   ============================================================ */

'use client';

import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/useUserStore';
import axios from 'axios';

export function UserHydrator() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch if the store has no user and we haven't already tried
    if (user || hasFetched.current) return;
    hasFetched.current = true;

    async function hydrateUser() {
      try {
        const response = await axios.get('/api/user/profile');
        if (response.data?.success && response.data.data) {
          setUser(response.data.data);
        }
      } catch (error) {
        // User is not authenticated or profile doesn't exist — that's fine,
        // the individual pages will show their "Sign in" fallback UI.
        console.warn('[UserHydrator] Could not fetch user profile:', error);
      }
    }

    hydrateUser();
  }, [user, setUser]);

  return null; // This component renders nothing — it's purely a side-effect hook
}
