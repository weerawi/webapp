import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Admin, AuditLog } from "@/lib/store/slices/adminSlice";
import { AppDispatch } from "@/lib/store/store";
import { setAdmins, setAuditLogs } from "@/lib/store/slices/adminSlice";

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