import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { staffAdmin  } from "@/lib/store/slices/staffAdminSlice";
import { AppDispatch } from "@/lib/store/store";
import { setStaff } from "@/lib/store/slices/staffAdminSlice";

export const saveStaffToFirestore = async (staffAdmin: Omit<staffAdmin, "id">) => {
  const docRef = await addDoc(collection(db, "staffAdmin"), {
    ...staffAdmin,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updatestaffAdminInFirestore = async (id: string, updates: Partial<staffAdmin>) => {
  await updateDoc(doc(db, "staffAdmin", id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deletestaffAdminFromFirestore = async (id: string) => {
  await deleteDoc(doc(db, "staffAdmin", id));
};

export const fetchstaffAdminFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "staffAdmin"));
  const staffAdmin = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as staffAdmin[];
  dispatch(setStaff(staffAdmin));
  return staffAdmin;
};

export const fetchstaffAdminByUserType = async (userType: "Helper" | "Supervisor") => {
  const q = query(collection(db, "staffAdmin"), where("userType", "==", userType));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as staffAdmin[];
};