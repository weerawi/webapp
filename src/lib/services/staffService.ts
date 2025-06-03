// lib/services/staffService.ts
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Staff } from "../store/slices/staffSlice";
import { AppDispatch } from "../store/store";
import { setStaff } from "../store/slices/staffSlice";

// Save new staff to Firestore
export const saveStaffToFirestore = async (staff: Omit<Staff, "id">) => {
  const docRef = await addDoc(collection(db, "staff"), staff); // changed collection name to 'staff'
  return docRef.id;
};

// Fetch all staff from Firestore and dispatch to Redux
export const fetchStaffFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "staff"));
  const staffList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Staff[];
  dispatch(setStaff(staffList));
};
