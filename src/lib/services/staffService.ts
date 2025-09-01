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
import { collection, addDoc, getDocs,setDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Staff } from "../store/slices/staffSlice";
import { AppDispatch } from "../store/store";
import { setStaff, updateStaff, deleteStaff } from "../store/slices/staffSlice";
import { setAttendance, addAttendance, updateAttendance } from "../store/slices/attendanceSlice";
import { AttendanceRecord } from "../store/slices/attendanceSlice";
import { mockAttendanceData } from "../data/mockAttendanceData";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config"; 

// Create auth user for Supervisor only
export const createStaffAuthUser = async (email: string, password: string) => {
  try {
    // Use secondary auth instance to avoid affecting current user
    const secondaryApp = initializeApp(firebaseConfig, 'StaffSecondary');
    const secondaryAuth = getAuth(secondaryApp);
    
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const newUserUid = userCredential.user.uid;
    
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

// Update saveStaffToFirestore to include uid
export const saveStaffToFirestore = async (staff: Omit<Staff, "id">) => {
  // For Supervisors with UID, use it as document ID
  if (staff.uid && staff.userType === "Supervisor") {
    await setDoc(doc(db, "staff", staff.uid), staff);
    return staff.uid;
  } else {
    // Helpers without UID continue using auto-generated IDs
    const docRef = await addDoc(collection(db, "staff"), staff);
    return docRef.id;
  }
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
// export const deleteStaffAndSync = async (
//   dispatch: AppDispatch,
//   id: string
// ) => {
//   const staffRef = doc(db, "staff", id);
//   await deleteDoc(staffRef);
//   dispatch(deleteStaff(id));
// };
export async function deleteStaffAndSync(dispatch: AppDispatch, staffId: string) {
  try {
    // Get the staff member to be deleted
    const staffDoc = await getDoc(doc(db, "staff", staffId));
    if (!staffDoc.exists()) {
      throw new Error("Staff member not found");
    }
    
    const staffData = staffDoc.data();
    const linkedStaffId = staffData.linkedStaffId;
    
    // Delete the selected staff member from Firestore
    await deleteDoc(doc(db, "staff", staffId));
    dispatch(deleteStaff(staffId));
    
    // If they had a partner, update the partner's status to Incomplete
    if (linkedStaffId) {
      const partnerDoc = await getDoc(doc(db, "staff", linkedStaffId));
      if (partnerDoc.exists()) {
        // Update partner to be incomplete and unlinked
        await updateDoc(doc(db, "staff", linkedStaffId), {
          linkedStaffId: "",
          status: "Incomplete",
          updatedAt: new Date().toISOString()
        });
        
        // Update Redux state for the partner
        dispatch(updateStaff({
          id: linkedStaffId,
          updates: {
            linkedStaffId: "",
            status: "Incomplete"
          }
        }));
      }
    }
    
    // Delete Firebase Auth user ONLY for supervisors with their own UID
    // Only delete if this staff member is a supervisor and has their own unique UID
    if (staffData.userType === "Supervisor" && staffData.uid) {
      try {
        // Create secondary app to delete the user without affecting current session
        const secondaryApp = initializeApp(firebaseConfig, 'DeleteStaffApp');
        const secondaryAuth = getAuth(secondaryApp);
        
        // Note: We can't directly delete a user from admin side without their credentials
        // This would need to be done through Firebase Admin SDK on the backend
        // For now, just clean up the app instance
        await deleteApp(secondaryApp);
        
        console.log("Note: Firebase Auth user cleanup requires backend Admin SDK");
      } catch (error) {
        console.warn("Auth cleanup note:", error);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
}

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

export const updateLinkedStaff = async (
  dispatch: AppDispatch,
  newStaffId: string,          // the staff we just created (or updated)
  linkedStaffId: string,       // the chosen partner
  targetTeamNumber?: number    // optional: force partner to this team
) => {
  const linkedStaffRef = doc(db, "staff", linkedStaffId);

  const updates: Partial<Staff> = {
    linkedStaffId: newStaffId,
  };
  if (targetTeamNumber && targetTeamNumber > 0) {
    updates.teamNumber = targetTeamNumber;  // move partner to merged team
  }

  await updateDoc(linkedStaffRef, updates);
  dispatch(updateStaff({ id: linkedStaffId, updates }));
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
  dispatch: AppDispatch
) => {
  // mockAttendanceData is now directly an array, not nested
  const raw = Array.isArray(mockAttendanceData) 
    ? mockAttendanceData 
    : [];

  const normalized: AttendanceRecord[] = raw.map((r: any, i: number) => ({
    id: r.id || `mock-${i}`,
    staffId: r.staffId || r.staffID || `STAFF-${i}`,
    staffName: r.staffName || r.name || "Unknown",
    area: r.area || "Unknown",
    teamNumber: r.teamNumber ?? r.team ?? 0,
    role: r.role || "helper",
    date: r.date || new Date().toISOString().slice(0, 10),
    timeIn: r.timeIn || "",
    timeOut: r.timeOut || "",
    status: r.status === "in" ? "in" : "out",
    gpsLocationIn: r.gpsLocationIn || "",  // Updated
    gpsLocationOut: r.gpsLocationOut || "",  // Added
    imageUrl: r.imageUrl,
  }));

  dispatch(setAttendance(normalized));
  return;
}

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