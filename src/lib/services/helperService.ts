// import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase/config";
// import { Helper } from "../store/slices/helperSlice";
// import { AppDispatch } from "../store/store";
// import { setHelpers, updateHelper, deleteHelper } from "../store/slices/helperSlice";
// import { updateSupervisor } from "../store/slices/supervisorSlice";

// // Save helper to Firestore
// export const saveHelperToFirestore = async (helper: Omit<Helper, "id">) => {
//   const docRef = await addDoc(collection(db, "helpers"), helper);
//   return docRef.id;
// };

// // Fetch all helpers
// export const fetchHelpersFromFirestore = async (dispatch: AppDispatch) => {
//   const snapshot = await getDocs(collection(db, "helpers"));
//   const helperList = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Helper[];
//   dispatch(setHelpers(helperList));
//   return helperList;
// };

// // Update helper
// export const updateHelperAndSync = async (
//   dispatch: AppDispatch,
//   id: string,
//   updates: Partial<Helper>
// ) => {
//   const helperRef = doc(db, "helpers", id);
//   await updateDoc(helperRef, updates);
//   dispatch(updateHelper({ id, updates }));
// };

// // Delete helper
// export const deleteHelperAndSync = async (dispatch: AppDispatch, helperId: string) => {
//   try {
//     const helperDoc = await getDoc(doc(db, "helpers", helperId));
//     if (!helperDoc.exists()) {
//       throw new Error("Helper not found");
//     }
    
//     const helperData = helperDoc.data();
//     const linkedSupervisorId = helperData.linkedSupervisorId;
    
//     // Delete helper
//     await deleteDoc(doc(db, "helpers", helperId));
//     dispatch(deleteHelper(helperId));
    
//     // Update linked supervisor if exists
//     if (linkedSupervisorId) {
//       const supervisorDoc = await getDoc(doc(db, "supervisors", linkedSupervisorId));
//       if (supervisorDoc.exists()) {
//         await updateDoc(doc(db, "supervisors", linkedSupervisorId), {
//           linkedHelperId: "",
//           status: "Incomplete",
//           updatedAt: new Date().toISOString()
//         });
        
//         dispatch(updateSupervisor({
//           id: linkedSupervisorId,
//           updates: {
//             linkedHelperId: "",
//             status: "Incomplete"
//           }
//         }));
//       }
//     }
    
//     return true;
//   } catch (error) {
//     console.error("Error deleting helper:", error);
//     throw error;
//   }
// };

// // Link supervisor and helper
// export const linkSupervisorAndHelper = async (
//   dispatch: AppDispatch,
//   supervisorId: string,
//   helperId: string,
//   teamNumber: number
// ) => {
//   // Update supervisor
//   await updateDoc(doc(db, "supervisors", supervisorId), {
//     linkedHelperId: helperId,
//     teamNumber,
//     status: "Active"
//   });
  
//   // Update helper
//   await updateDoc(doc(db, "helpers", helperId), {
//     linkedSupervisorId: supervisorId,
//     teamNumber,
//     status: "Active"
//   });
  
//   // Update Redux
//   dispatch(updateSupervisor({
//     id: supervisorId,
//     updates: { linkedHelperId: helperId, teamNumber, status: "Active" }
//   }));
  
//   dispatch(updateHelper({
//     id: helperId,
//     updates: { linkedSupervisorId: supervisorId, teamNumber, status: "Active" }
//   }));
// };

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Helper } from "../store/slices/helperSlice";
import { AppDispatch } from "../store/store";
import { setHelpers, updateHelper, deleteHelper } from "../store/slices/helperSlice";

export const saveHelperToFirestore = async (helper: Omit<Helper, "id">) => {
  const docRef = await addDoc(collection(db, "helpers"), helper);
  return docRef.id;
};

export const fetchHelpersFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "helpers"));
  const helperList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    status: doc.data().status || undefined
  })) as Helper[];
  dispatch(setHelpers(helperList));
  return helperList;
};

export const updateHelperAndSync = async (
  dispatch: AppDispatch,
  id: string,
  updates: Partial<Helper>
) => {
  const helperRef = doc(db, "helpers", id);
  await updateDoc(helperRef, updates);
  dispatch(updateHelper({ id, updates }));
};

// export const deleteHelperAndSync = async (dispatch: AppDispatch, id: string) => {
//   const helperRef = doc(db, "helpers", id);
//   await deleteDoc(helperRef);
//   dispatch(deleteHelper(id));
// };
// Replace deleteHelperAndSync function (around line 38)
export const deleteHelperAndSync = async (dispatch: AppDispatch, id: string) => {
  try {
    // Get helper data FIRST (before updating)
    const helperDoc = await getDoc(doc(db, "helpers", id));
    if (!helperDoc.exists()) {
      throw new Error("Helper not found");
    }
    
    const helperData = helperDoc.data();
    const linkedSupervisorId = helperData.linkedSupervisorId;
    
    // NOW update to Deleted status
    await updateDoc(doc(db, "helpers", id), {
      status: "Deleted",
      isActive: false,
      deletedAt: new Date().toISOString(),
      linkedSupervisorId: "", // Clear the link
      teamNumber: 0 // Reset team number
    });
    
    // Update Redux state
    dispatch(updateHelper({ 
      id, 
      updates: { 
        status: "Deleted", 
        isActive: false,
        linkedSupervisorId: "",
        teamNumber: 0
      } 
    }));
    
    // Update linked supervisor if exists
    if (linkedSupervisorId) {
      await updateDoc(doc(db, "supervisors", linkedSupervisorId), {
        linkedHelperId: "",
        status: "Incomplete"
      });
      
      // Import and update supervisor in Redux
      const { updateSupervisor } = await import("../store/slices/supervisorSlice");
      dispatch(updateSupervisor({
        id: linkedSupervisorId,
        updates: {
          linkedHelperId: "",
          status: "Incomplete"
        }
      }));
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting helper:", error);
    throw error;
  }
};