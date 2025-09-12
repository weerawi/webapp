// lib/auth/sessionManager.ts
import { queryClient } from '../query/queryClient';

export const SESSION_KEY = 'auth_storage';
const SESSION_TIMEOUT = 60 * 60 * 1000 ;

export const sessionManager = {
  setSession: (token: string) => {
    const sessionData = {
      token,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    console.log('Session set:', sessionData); // Debug log
  },

  getSession: () => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    try {
      const session = JSON.parse(sessionStr);
      const now = Date.now();
      const expired = now - session.timestamp > SESSION_TIMEOUT;

      console.log('Session check:', { 
        now, 
        timestamp: session.timestamp, 
        diff: now - session.timestamp, 
        timeout: SESSION_TIMEOUT, 
        expired 
      }); // Debug log

      // Check if session has expired
      if (expired) {
        console.log('Session expired, clearing...'); // Debug log
        sessionManager.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error parsing session:', error);
      sessionManager.clearSession();
      return null;
    }
  },

  clearSession: () => {
    console.log('Clearing session...'); // Debug log
    localStorage.removeItem(SESSION_KEY);
    
    // Also clear all related auth keys
    localStorage.removeItem('auth-debug');
    localStorage.removeItem('auth-storage'); // Make sure this exact key is removed
    
    queryClient.clear();
    console.log('Session cleared'); // Debug log
  },

  isSessionValid: () => {
    const session = sessionManager.getSession();
    const valid = session !== null;
    console.log('Session valid:', valid); // Debug log
    return valid;
  },
};