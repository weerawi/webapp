import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Admin, AuditLog, WaterboardOption, Area } from "@/lib/store/slices/adminSlice";
import { AppDispatch } from "@/lib/store/store";
import { setAdmins, setAuditLogs } from "@/lib/store/slices/adminSlice";

// Add this function to delete area by assignedTo (userId)
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

// Update saveArea to use userId instead of email
export const saveArea = async (areaName: string, userId?: string): Promise<string> => {
  // Check if area already exists (case-insensitive)
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

// Keep existing functions...
export const saveAdminToFirestore = async (admin: Omit<Admin, "id">) => {
  const docRef = await addDoc(collection(db, "admins"), {
    ...admin,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateAdminInFirestore = async (id: string, updates: Partial<Admin>) => {
  await updateDoc(doc(db, "admins", id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteAdminFromFirestore = async (id: string) => {
  await deleteDoc(doc(db, "admins", id));
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

// Waterboard Options functions
export const saveWaterboardOption = async (optionName: string): Promise<string> => {
  // Check if option already exists (case-insensitive)
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

export const fetchAreas = async (): Promise<Area[]> => {
  const snapshot = await getDocs(collection(db, "areas"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Area[];
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