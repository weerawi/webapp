import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { Admin, AuditLog, WaterboardOption, Area } from "@/lib/store/slices/adminSlice";
import { AppDispatch } from "@/lib/store/store";
import { setAdmins, setAuditLogs } from "@/lib/store/slices/adminSlice";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config";  

// Function to create user in Firebase Auth
// Function to create user in Firebase Auth
export const createAuthUser = async (email: string, password: string) => {
  try {
    // Create a secondary Firebase Auth instance to avoid affecting the current user
    const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
    const secondaryAuth = getAuth(secondaryApp);
    
    // Create user with secondary auth instance
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const newUserUid = userCredential.user.uid;
    
    // Sign out from secondary auth and delete the app instance
    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);
    
    return newUserUid;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already in use');
    }
    throw error;
  }
};
// Updated saveAdminToFirestore to use the uid from Firebase Auth
export const saveAdminToFirestore = async (admin: Omit<Admin, "id">, uid: string) => {
  await setDoc(doc(db, "admins", uid), {
    ...admin,
    uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return uid; // Return UID as the document ID
};

// Function to get admin details by UID
export const getAdminByUid = async (uid: string): Promise<Admin | null> => {
  const docSnap = await getDoc(doc(db, "admins", uid));
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: uid,
    ...docSnap.data()
  } as Admin;
};


// Update deleteAdminFromFirestore to not delete from Auth (we'll handle this separately)
// export const deleteAdminFromFirestore = async (id: string) => {
//   await deleteDoc(doc(db, "admins", id));
// };
// Update deleteAdminFromFirestore to also clean up the assigned areas
export const deleteAdminFromFirestore = async (id: string) => {
  try {
    // id is now the UID itself
    await deleteAreaByUserId(id);
    await deleteDoc(doc(db, "admins", id));
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};

// Rest of your existing functions remain the same...
export const updateAdminInFirestore = async (id: string, updates: Partial<Admin>) => {
  await updateDoc(doc(db, "admins", id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const fetchAdminsFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "admins"));
  const admins = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Admin[];
  dispatch(setAdmins(admins));
  return admins;
};

// Area functions
// export const deleteAreaByUserId = async (userId: string) => {
//   try {
//     const q = query(collection(db, "all_areas"), where("assignedTo", "==", userId));
//     const snapshot = await getDocs(q);
    
//     const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
//     await Promise.all(deletePromises);
    
//     const deletedCount = deletePromises.length;
//     console.log(`Deleted ${deletedCount} areas with assignedTo=${userId}`);
//     return deletedCount;
//   } catch (error) {
//     console.error(`Error deleting areas (assignedTo=${userId}):`, error);
//     throw error;
//   }
// };
export const deleteAreaByUserId = async (userId: string) => {
  try {
    const q = query(collection(db, "all_areas"), where("assignedTo", "==", userId));
    const snapshot = await getDocs(q);
    
    // Delete areas and their options
    const deletePromises = snapshot.docs.map(async (doc) => {
      const areaName = doc.data().name;
      await deleteAreaOptions(areaName); // Delete from areaOptions collection
      return deleteDoc(doc.ref);
    });
    
    await Promise.all(deletePromises);
    
    // Cleanup unused global options after deletion
    await cleanupUnusedOptions();
    
    const deletedCount = deletePromises.length;
    console.log(`Deleted ${deletedCount} areas with assignedTo=${userId}`);
    return deletedCount;
  } catch (error) {
    console.error(`Error deleting areas (assignedTo=${userId}):`, error);
    throw error;
  }
};

export const saveArea = async (areaName: string, userId?: string): Promise<string> => {
  const snapshot = await getDocs(collection(db, "all_areas"));
  const exists = snapshot.docs.some(
    doc => doc.data().name.toLowerCase() === areaName.toLowerCase()
  );
  
  if (exists) {
    throw new Error("This area already exists");
  }
  
  const docRef = await addDoc(collection(db, "all_areas"), {
    name: areaName,
    assignedTo: userId || null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const fetchAreas = async (): Promise<Area[]> => {
  const snapshot = await getDocs(collection(db, "all_areas"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Area[];
};

// Waterboard Options functions
// export const saveWaterboardOption = async (optionName: string): Promise<string> => {
//   const snapshot = await getDocs(collection(db, "waterboardOptions"));
//   const exists = snapshot.docs.some(
//     doc => doc.data().name.toLowerCase() === optionName.toLowerCase()
//   );
  
//   if (exists) {
//     throw new Error("This option already exists");
//   }
  
//   const docRef = await addDoc(collection(db, "waterboardOptions"), {
//     name: optionName,
//     createdAt: new Date().toISOString(),
//   });
//   return docRef.id;
// };

// updated after structure change in report view
export const saveWaterboardOption = async (optionName: string): Promise<string> => {
  const clean = optionName.trim();
  if (!clean) throw new Error("Option name cannot be empty");

  const snapshot = await getDocs(collection(db, "waterboardOptions"));
  const exists = snapshot.docs.some(doc =>
    (doc.data().name as string).trim().toLowerCase() === clean.toLowerCase()
  );

  if (exists) {
    throw new Error("This option already exists");
  }

  const docRef = await addDoc(collection(db, "waterboardOptions"), {
    name: clean,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};



export const fetchWaterboardOptions = async (): Promise<WaterboardOption[]> => {
  const snapshot = await getDocs(collection(db, "waterboardOptions"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WaterboardOption[];
};

// Audit Log functions
export const saveAuditLogToFirestore = async (log: Omit<AuditLog, "id">) => {
  const docRef = await addDoc(collection(db, "auditLogs"), {
    ...log,
    timestamp: new Date().toISOString(),
  });
  return docRef.id;
};

export const fetchAuditLogsFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "auditLogs"));
  const logs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AuditLog[];
  dispatch(setAuditLogs(logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))));
  return logs;
};


export const updateLastLogin = async (uid: string) => {
  const docRef = doc(db, "admins", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      lastLogin: new Date().toISOString(),
    });
  }
};

// Area-specific options collection (new)
export const saveAreaOptions = async (areaName: string, options: string[]): Promise<void> => {
  await setDoc(doc(db, "areaOptions", areaName), {
    area: areaName,
    options: options,
    updatedAt: new Date().toISOString(),
  });
};

export const fetchAreaOptions = async (areaName: string): Promise<string[]> => {
  const docSnap = await getDoc(doc(db, "areaOptions", areaName));
  return docSnap.exists() ? (docSnap.data().options || []) : [];
};

export const deleteAreaOptions = async (areaName: string): Promise<void> => {
  await deleteDoc(doc(db, "areaOptions", areaName)).catch(() => {});
};

// Update global waterboardOptions by removing unused options
export const cleanupUnusedOptions = async (): Promise<void> => {
  // Get all area options
  const areaOptionsSnapshot = await getDocs(collection(db, "areaOptions"));
  const allUsedOptions = new Set<string>();
  
  areaOptionsSnapshot.docs.forEach(doc => {
    const options = doc.data().options || [];
    options.forEach((opt: string) => allUsedOptions.add(opt));
  });
  
  // Get current global options
  const globalOptionsSnapshot = await getDocs(collection(db, "waterboardOptions"));
  
  // Delete options not used by any area
  const deletePromises = globalOptionsSnapshot.docs
    .filter(doc => !allUsedOptions.has(doc.data().name))
    .map(doc => deleteDoc(doc.ref));
  
  await Promise.all(deletePromises);
};

//to view area-specific options /NOT use yet
export const fetchAllAreaOptions = async (): Promise<{area: string, options: string[]}[]> => {
  const snapshot = await getDocs(collection(db, "areaOptions"));
  return snapshot.docs.map(doc => ({
    area: doc.data().area,
    options: doc.data().options || []
  }));
};