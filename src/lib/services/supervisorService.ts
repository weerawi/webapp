// import { collection, addDoc, getDocs, setDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase/config";
// import { Supervisor } from "../store/slices/supervisorSlice";
// import { AppDispatch } from "../store/store";
// import { setSupervisors, updateSupervisor, deleteSupervisor } from "../store/slices/supervisorSlice";
// import { updateHelper } from "../store/slices/helperSlice";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { initializeApp, deleteApp } from "firebase/app";
// import { getAuth, signOut } from "firebase/auth";
// import { firebaseConfig } from "@/lib/firebase/config";
// import { mockAttendanceData } from "../data/mockAttendanceData";
// import { AttendanceRecord, setAttendance } from "../store/slices/attendanceSlice";

// // Create auth user for Supervisor
// export const createSupervisorAuthUser = async (email: string, password: string) => {
//   try {
//     const secondaryApp = initializeApp(firebaseConfig, 'SupervisorSecondary');
//     const secondaryAuth = getAuth(secondaryApp);
    
//     const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
//     const newUserUid = userCredential.user.uid;
    
//     await signOut(secondaryAuth);
//     await deleteApp(secondaryApp);
    
//     return newUserUid;
//   } catch (error: any) {
//     if (error.code === 'auth/email-already-in-use') {
//       throw new Error('Email is already in use');
//     }
//     throw error;
//   }
// };

// // Save supervisor to Firestore
// export const saveSupervisorToFirestore = async (supervisor: Omit<Supervisor, "id">) => {
//   if (supervisor.uid) {
//     await setDoc(doc(db, "supervisors", supervisor.uid), supervisor);
//     return supervisor.uid;
//   } else {
//     const docRef = await addDoc(collection(db, "supervisors"), supervisor);
//     return docRef.id;
//   }
// };

// // Fetch all supervisors
// export const fetchSupervisorsFromFirestore = async (dispatch: AppDispatch) => {
//   const snapshot = await getDocs(collection(db, "supervisors"));
//   const supervisorList = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Supervisor[];
//   dispatch(setSupervisors(supervisorList));
//   return supervisorList;
// };

// // Update supervisor
// export const updateSupervisorAndSync = async (
//   dispatch: AppDispatch,
//   id: string,
//   updates: Partial<Supervisor>
// ) => {
//   const supervisorRef = doc(db, "supervisors", id);
//   await updateDoc(supervisorRef, updates);
//   dispatch(updateSupervisor({ id, updates }));
// };

// //dummy, need to add separate attendance 
// export const fetchAttendanceFromFirestore = async (dispatch: AppDispatch) => {
//   // Simulate async call
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   // Load mock data
//   const attendanceList = mockAttendanceData.attendance as AttendanceRecord[];
//   dispatch(setAttendance(attendanceList));
// };

// // Delete supervisor
// export const deleteSupervisorAndSync = async (dispatch: AppDispatch, supervisorId: string) => {
//   try {
//     const supervisorDoc = await getDoc(doc(db, "supervisors", supervisorId));
//     if (!supervisorDoc.exists()) {
//       throw new Error("Supervisor not found");
//     }
    
//     const supervisorData = supervisorDoc.data();
//     const linkedHelperId = supervisorData.linkedHelperId;
    
//     // Delete supervisor
//     await deleteDoc(doc(db, "supervisors", supervisorId));
//     dispatch(deleteSupervisor(supervisorId));
    
//     // Update linked helper if exists
//     if (linkedHelperId) {
//       const helperDoc = await getDoc(doc(db, "helpers", linkedHelperId));
//       if (helperDoc.exists()) {
//         await updateDoc(doc(db, "helpers", linkedHelperId), {
//           linkedSupervisorId: "",
//           status: "Incomplete",
//           updatedAt: new Date().toISOString()
//         });
        
//         dispatch(updateHelper({
//           id: linkedHelperId,
//           updates: {
//             linkedSupervisorId: "",
//             status: "Incomplete"
//           }
//         }));
//       }
//     }
    
//     return true;
//   } catch (error) {
//     console.error("Error deleting supervisor:", error);
//     throw error;
//   }
// };


import { collection, addDoc, getDocs, setDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Supervisor } from "../store/slices/supervisorSlice";
import { AppDispatch } from "../store/store";
import { setSupervisors, updateSupervisor, deleteSupervisor } from "../store/slices/supervisorSlice";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase/config";

export const createSupervisorAuthUser = async (email: string, password: string) => {
  try {
    const secondaryApp = initializeApp(firebaseConfig, 'SupervisorSecondary');
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

export const saveSupervisorToFirestore = async (supervisor: Omit<Supervisor, "id">) => {
  if (supervisor.uid) {
    await setDoc(doc(db, "supervisors", supervisor.uid), supervisor);
    return supervisor.uid;
  } else {
    const docRef = await addDoc(collection(db, "supervisors"), supervisor);
    return docRef.id;
  }
};

export const fetchSupervisorsFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "supervisors"));
  const supervisorList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Supervisor[];
  dispatch(setSupervisors(supervisorList));
  return supervisorList;
};

export const updateSupervisorAndSync = async (
  dispatch: AppDispatch,
  id: string,
  updates: Partial<Supervisor>
) => {
  const supervisorRef = doc(db, "supervisors", id);
  await updateDoc(supervisorRef, updates);
  dispatch(updateSupervisor({ id, updates }));
};

export const deleteSupervisorAndSync = async (dispatch: AppDispatch, id: string) => {
  const supervisorRef = doc(db, "supervisors", id);
  await deleteDoc(supervisorRef);
  dispatch(deleteSupervisor(id));
};