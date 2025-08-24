// import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase/config";
// import { Staff } from "../store/slices/staffSlice";
// import { AppDispatch } from "../store/store";
// import { setStaff, updateStaff, deleteStaff } from "../store/slices/staffSlice";

// // Save new staff to Firestore
// export const saveStaffToFirestore = async (staff: Omit<Staff, "id">) => {
//   const docRef = await addDoc(collection(db, "staff"), staff);
//   return docRef.id;
// };

// // Fetch and sync all staff
// export const fetchStaffFromFirestore = async (dispatch: AppDispatch) => {
//   const snapshot = await getDocs(collection(db, "staff"));
//   const staffList = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//     linkedStaffId: doc.data().linkedStaffId || "",
//   })) as Staff[];
//   dispatch(setStaff(staffList));
// };

// // ✅ Update staff and dispatch to Redux
// export const updateStaffAndSync = async (
//   dispatch: AppDispatch,
//   id: string,
//   updates: Partial<Staff>
// ) => {
//   const staffRef = doc(db, "staff", id);
//   await updateDoc(staffRef, updates);
//   dispatch(updateStaff({ id, updates }));
// };

// // ✅ Delete staff and dispatch to Redux
// export const deleteStaffAndSync = async (
//   dispatch: AppDispatch,
//   id: string
// ) => {
//   const staffRef = doc(db, "staff", id);
//   await deleteDoc(staffRef);
//   dispatch(deleteStaff(id));
// };


// export const updateLinkedStaff = async (
//   dispatch: AppDispatch,
//   staffId: string,
//   linkedStaffId: string
// ) => {
//   // Update the linked staff's linkedStaffId field
//   const linkedStaffRef = doc(db, "staff", linkedStaffId);
//   await updateDoc(linkedStaffRef, { linkedStaffId: staffId });
//   dispatch(updateStaff({ id: linkedStaffId, updates: { linkedStaffId: staffId } }));
// };



// lib/services/staffService.ts
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Staff } from "../store/slices/staffSlice";
import { AppDispatch } from "../store/store";
import { setStaff, updateStaff, deleteStaff } from "../store/slices/staffSlice";
import { setAttendance, addAttendance, updateAttendance } from "../store/slices/attendanceSlice";
import { AttendanceRecord } from "../store/slices/attendanceSlice";
import { mockAttendanceData } from "../data/mockAttendanceData";

// Import mock data
// import mockAttendanceData from "../data/mockAttendanceData.json";

// ========== STAFF FUNCTIONS ==========
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

// Update staff and dispatch to Redux
export const updateStaffAndSync = async (
  dispatch: AppDispatch,
  id: string,
  updates: Partial<Staff>
) => {
  const staffRef = doc(db, "staff", id);
  await updateDoc(staffRef, updates);
  dispatch(updateStaff({ id, updates }));
};

// Delete staff and dispatch to Redux
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

// ========== ATTENDANCE FUNCTIONS ==========

// Fetch attendance from Firestore (COMMENTED OUT - USING MOCK DATA)
/*
export const fetchAttendanceFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "attendance"));
  const attendanceList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AttendanceRecord[];
  dispatch(setAttendance(attendanceList));
};
*/

// Fetch attendance using mock data
export const fetchAttendanceFromFirestore = async (dispatch: AppDispatch) => {
  // Simulate async call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Load mock data
  const attendanceList = mockAttendanceData.attendance as AttendanceRecord[];
  dispatch(setAttendance(attendanceList));
};

// Save new attendance record (COMMENTED OUT - USING MOCK DATA)
/*
export const saveAttendanceToFirestore = async (attendance: Omit<AttendanceRecord, "id">) => {
  const docRef = await addDoc(collection(db, "attendance"), attendance);
  return docRef.id;
};
*/

// Save new attendance record (mock version)
export const saveAttendanceToFirestore = async (attendance: Omit<AttendanceRecord, "id">) => {
  // Simulate async call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate a mock ID
  const mockId = `att-${Date.now()}`;
  return mockId;
};

// Update attendance record (COMMENTED OUT - USING MOCK DATA)
/*
export const updateAttendanceAndSync = async (
  dispatch: AppDispatch,
  id: string,
  updates: Partial<AttendanceRecord>
) => {
  const attendanceRef = doc(db, "attendance", id);
  await updateDoc(attendanceRef, updates);
  dispatch(updateAttendance({ id, updates }));
};
*/

// Update attendance record (mock version)
export const updateAttendanceAndSync = async (
  dispatch: AppDispatch,
  id: string,
  updates: Partial<AttendanceRecord>
) => {
  // Simulate async call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Just dispatch to Redux since we're using mock data
  dispatch(updateAttendance({ id, updates }));
};

// Check in staff member
export const checkInStaff = async (
  dispatch: AppDispatch,
  staffData: {
    staffId: string;
    staffName: string;
    area: string;
    teamNumber: number;
    role: 'supervisor' | 'helper'; // Add this
    gpsLocation: string;
    imageUrl?: string;
  }
) => {
  const attendanceData: Omit<AttendanceRecord, "id"> = {
    ...staffData,
    date: new Date().toISOString().split('T')[0],
    timeIn: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    timeOut: "",
    status: "in",
  };
  
  const id = await saveAttendanceToFirestore(attendanceData);
  dispatch(addAttendance({ id, ...attendanceData }));
  return id;
};

// Check out staff member
export const checkOutStaff = async (
  dispatch: AppDispatch,
  attendanceId: string
) => {
  const updates = {
    timeOut: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    status: "out" as const,
  };
  
  await updateAttendanceAndSync(dispatch, attendanceId, updates);
};