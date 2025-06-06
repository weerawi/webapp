"use client";

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { sessionManager } from '@/lib/auth/sessionManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store/store';
import { loginSuccess, logout } from '@/lib/store/slices/authSlice';
import { getAdminByUid } from '@/lib/services/adminService';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      sessionManager.clearSession();
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        sessionManager.setSession(token);
        
        // Fetch user details from Firestore
        const adminData = await getAdminByUid(firebaseUser.uid);
        
        if (adminData) {
          dispatch(loginSuccess({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: adminData.role,
              username: adminData.username,
              area: adminData.area,
              options: adminData.options,
              tenderNumber: adminData.tenderNumber,
            },
            token
          }));
        } else {
          // If no admin data found, just use basic info
          dispatch(loginSuccess({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            },
            token
          }));
        }
        
        console.log('User logged in');
      } else {
        sessionManager.clearSession();
        dispatch(logout());
        console.log('User state cleared');
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Session validity check
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (!sessionManager.isSessionValid()) {
        handleLogout();
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [user]);

  return { user, loading, logout: handleLogout };
}