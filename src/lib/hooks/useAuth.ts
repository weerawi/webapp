"use client"

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
} 

// "use client";

// import { useState, useEffect } from 'react';
// import { User, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '@/lib/firebase/config';
// import { useAuthStore } from '@/lib/store/authStore'; // ✅ import your Zustand store

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const setAuthUser = useAuthStore((state) => state.setUser); // ✅ Zustand updater
//   const logout = useAuthStore((state) => state.logout);        // ✅ Zustand logout

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser);
//       if (firebaseUser) {
//         setAuthUser(firebaseUser); // ✅ keep Zustand in sync
//       } else {
//         logout(); // ✅ clear Zustand store too
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [setAuthUser, logout]);

//   return { user, loading };
// }
