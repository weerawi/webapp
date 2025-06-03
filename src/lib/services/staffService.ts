// lib/services/staffService.ts
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Staff } from "../store/slices/staffSlice";
import { AppDispatch } from "../store/store";
import { setStaff, updateStaff, deleteStaff } from "../store/slices/staffSlice";

// Save new staff to Firestore
export const saveStaffToFirestore = async (staff: Omit<Staff, "id">) => {
  const docRef = await addDoc(collection(db, "staff"), staff);
  return docRef.id;
};

// Update staff in Firestore
export const updateStaffInFirestore = async (id: string, updates: Partial<Staff>) => {
  const staffRef = doc(db, "staff", id);
  await updateDoc(staffRef, updates);
};

export const deleteStaffFromFirestore = async (id: string) => {
    const staffRef = doc(db, "staff", id);
    await deleteDoc(staffRef);
  };
  
// Fetch all staff from Firestore and dispatch to Redux
// Update fetchStaffFromFirestore function
export const fetchStaffFromFirestore = async (dispatch: AppDispatch) => {
    const snapshot = await getDocs(collection(db, "staff"));
    const staffList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Normalize linkedStaffId to handle empty strings
      linkedStaffId: doc.data().linkedStaffId || "",
    })) as Staff[];
    dispatch(setStaff(staffList));
  };