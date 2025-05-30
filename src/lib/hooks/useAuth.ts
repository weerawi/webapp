// "use client"

// import { useState, useEffect } from 'react';
// import { User, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '@/lib/firebase/config';

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   return { user, loading };
// } 

// hooks/useAuth.ts
"use client"

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { sessionManager } from '@/lib/auth/sessionManager';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth); // This will trigger onAuthStateChanged
      sessionManager.clearSession();
      setUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Store token in session when user logs in
        const token = await firebaseUser.getIdToken();
        sessionManager.setSession(token);
        setUser(firebaseUser);
        console.log('User logged in');
      } else {
        // Clear session when user logs out
        sessionManager.clearSession();
        setUser(null);
        console.log('User state cleared');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check session validity periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('Checking session validity...');
      if (!sessionManager.isSessionValid()) {
        console.log('Session invalid, logging out...');
        handleLogout(); // Use proper logout instead of just setting user to null
      }
    }, 3600000); // Check every 10 seconds for testing (change back to 60000 later)

    return () => clearInterval(interval);
  }, [user]);

  return { user, loading, logout: handleLogout };
}