import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { Admin, AuditLog, WaterboardOption, Area } from "@/lib/store/slices/adminSlice";
import { AppDispatch } from "@/lib/store/store";
import { setAdmins, setAuditLogs } from "@/lib/store/slices/adminSlice";

// Function to create user in Firebase Auth
export const createAuthUser = async (email: string, password: string) => {
  try {
    // Store current user before creating new one
    const currentUser = auth.currentUser;
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUserUid = userCredential.user.uid;
    
    // Sign back in the original user if there was one
    if (currentUser) {
      await auth.updateCurrentUser(currentUser);
    }
    
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
  const docRef = await addDoc(collection(db, "admins"), {
    ...admin,
    uid, // Store the Firebase Auth UID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

// Function to get admin details by UID
export const getAdminByUid = async (uid: string): Promise<Admin | null> => {
  const q = query(collection(db, "admins"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Admin;
};

// Update deleteAdminFromFirestore to not delete from Auth (we'll handle this separately)
export const deleteAdminFromFirestore = async (id: string) => {
  await deleteDoc(doc(db, "admins", id));
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
export const deleteAreaByUserId = async (userId: string) => {
  try {
    const q = query(collection(db, "areas"), where("assignedTo", "==", userId));
    const snapshot = await getDocs(q);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting area:", error);
  }
};

export const saveArea = async (areaName: string, userId?: string): Promise<string> => {
  const snapshot = await getDocs(collection(db, "areas"));
  const exists = snapshot.docs.some(
    doc => doc.data().name.toLowerCase() === areaName.toLowerCase()
  );
  
  if (exists) {
    throw new Error("This area already exists");
  }
  
  const docRef = await addDoc(collection(db, "areas"), {
    name: areaName,
    assignedTo: userId || null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const fetchAreas = async (): Promise<Area[]> => {
  const snapshot = await getDocs(collection(db, "areas"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Area[];
};

// Waterboard Options functions
export const saveWaterboardOption = async (optionName: string): Promise<string> => {
  const snapshot = await getDocs(collection(db, "waterboardOptions"));
  const exists = snapshot.docs.some(
    doc => doc.data().name.toLowerCase() === optionName.toLowerCase()
  );
  
  if (exists) {
    throw new Error("This option already exists");
  }
  
  const docRef = await addDoc(collection(db, "waterboardOptions"), {
    name: optionName,
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
  const q = query(collection(db, "admins"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const adminDoc = snapshot.docs[0];
    await updateDoc(doc(db, "admins", adminDoc.id), {
      lastLogin: new Date().toISOString(),
    });
  }
};