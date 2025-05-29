
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user) => {
          const actionName = user ? 'LOGIN_USER' : 'CLEAR_USER';
          const actionPayload = user ? { 
            type: actionName, 
            payload: { userId: user.uid, email: user.email } 
          } : actionName;
          
          set(
            { user, isAuthenticated: !!user },
            false, // replace state instead of merging
            actionPayload // Enhanced action info for DevTools
          );

          // 🔍 Console log AFTER state change
          console.log('✅ After setUser:', {
            actionName,
            newState: get(),
            devToolsPayload: actionPayload
          });
        },
        logout: () => {
          set(
            { user: null, isAuthenticated: false },
            false, // replace state instead of merging
            'LOGOUT_USER' // This shows in DevTools instead of numbers
          );
        },
      }),
      {
        name: 'auth-storage', // localStorage key
        // Optional: Only persist specific parts
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'AuthStore', // DevTools store name
      enabled: process.env.NODE_ENV === 'development', // Only in dev
    }
  )
);