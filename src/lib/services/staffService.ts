import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Staff } from "../store/slices/staffSlice";
import { AppDispatch } from "../store/store";
import { setStaff, updateStaff, deleteStaff } from "../store/slices/staffSlice";

// Save new staff to Firestore
export const saveStaffToFirestore = async (staff: Omit<Staff, "id">) => {
  const docRef = await addDoc(collection(db, "staff"), staff);
  return docRef.id;
};

// Fetch and sync all staff
export const fetchStaffFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "staff"));
  const staffList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    linkedStaffId: doc.data().linkedStaffId || "",
  })) as Staff[];
  dispatch(setStaff(staffList));
};

// ✅ Update staff and dispatch to Redux
export const updateStaffAndSync = async (
  dispatch: AppDispatch,
  id: string,
  updates: Partial<Staff>
) => {
  const staffRef = doc(db, "staff", id);
  await updateDoc(staffRef, updates);
  dispatch(updateStaff({ id, updates }));
};

// ✅ Delete staff and dispatch to Redux
export const deleteStaffAndSync = async (
  dispatch: AppDispatch,
  id: string
) => {
  const staffRef = doc(db, "staff", id);
  await deleteDoc(staffRef);
  dispatch(deleteStaff(id));
};


export const updateLinkedStaff = async (
  dispatch: AppDispatch,
  staffId: string,
  linkedStaffId: string
) => {
  // Update the linked staff's linkedStaffId field
  const linkedStaffRef = doc(db, "staff", linkedStaffId);
  await updateDoc(linkedStaffRef, { linkedStaffId: staffId });
  dispatch(updateStaff({ id: linkedStaffId, updates: { linkedStaffId: staffId } }));
};