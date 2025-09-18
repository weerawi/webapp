// // src/lib/services/reportService.ts
// import { AppDispatch } from "../store/store";
// import {
//   fetchReportsStart,
//   fetchReportsSuccess,
//   fetchReportsFailure
// } from "../store/slices/reportSlice";
// // import { mockDisconnectionData } from "@/lib/mock-data";
// import { AuthUser } from "../store/slices/authSlice";
// import { DisconnectionRecord } from "@/types/disconnection";
// import { collection, getDocs, doc, } from "firebase/firestore";
// import { db } from "@/lib/firebase/config"; 
// import { setLocations } from "../store/slices/userLocationsSlice";

// // Call this function in ReportPage
// // Update the function signature to accept currentUser
// export async function fetchAndStoreReports(
//   dispatch: AppDispatch,
//   currentUser: AuthUser | null
// ) {
//   try {
//     dispatch(fetchReportsStart());
//     console.log("Starting to fetch reports...");

//     const allRecords: DisconnectionRecord[] = [];

//     const helpersSnapshot = await getDocs(collection(db, "helpers"));
//     const helpersMap = new Map();
//     helpersSnapshot.docs.forEach(doc => {
//       const data = doc.data();
//       helpersMap.set(doc.id, data.username || data.userName || "");
//     });

//     // First fetch all supervisors to get their IDs
//     const supervisorsSnapshot = await getDocs(collection(db, "supervisors"));
//     console.log(`Found ${supervisorsSnapshot.size} supervisors`);
//     console.log(`Found ${helpersSnapshot.size} helpers`);

//     const userLocationsMap = new Map();

//     for (const supervisorDoc of supervisorsSnapshot.docs) {
//       const supervisorId = supervisorDoc.id;
//       const supervisorData = supervisorDoc.data();
//       console.log(`Checking supervisor ${supervisorId} (${supervisorData.username})`);
      
//       try {
//         // Try to access the jobs subcollection directly
//         const jobsRef = collection(db, "completed_jobs", supervisorId, "jobs");
//         const jobsSnapshot = await getDocs(jobsRef);
        
//         if (jobsSnapshot.empty) {
//           console.log(`No jobs found for supervisor ${supervisorId}`);
//           continue;
//         }
        
//         console.log(`Found ${jobsSnapshot.size} jobs for supervisor ${supervisorId}`);
        
//         // Add current date check
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);

//         for (const jobDoc of jobsSnapshot.docs) {
//           const jobData = jobDoc.data();

          
//           console.log(`Processing job ${jobDoc.id}:`, jobData);

//           // Extract location for supervisor (get latest job's location)
//           if (jobData.latitude && jobData.longitude && jobData.timestamp) {
//             // Add date check - skip if not today's data
//             // if (jobData.timestamp) {
//             //   const jobDate = new Date(jobData.timestamp);
//             //   if (jobDate < today || jobDate >= tomorrow) {
//             //     continue; // Skip jobs not from today
//             //   }
//             // } else {
//             //   continue; // Skip jobs without timestamp
//             // }
//             const existingLocation = userLocationsMap.get(supervisorId);
//             if (!existingLocation || jobData.timestamp > existingLocation.timestamp) {
//               userLocationsMap.set(supervisorId, {
//                 id: supervisorId,
//                 name: supervisorData.username || supervisorData.userName || "",
//                 avatar: supervisorData.avatar || `https://i.pravatar.cc/150?u=${supervisorId}`,
//                 area: supervisorData.area || "",
//                 lat: jobData.latitude,
//                 lng: jobData.longitude,
//                 timestamp: jobData.timestamp,
//                 role: 'Supervisor'
//               });
//             }
//           }
          

//           // Extract date and time
//           let date = "";
//           let time = "";
//           if (jobData.timestamp) {
//             const dateObj = new Date(jobData.timestamp);
//             date = dateObj.toISOString().split('T')[0];
//             time = jobData.time || dateObj.toTimeString().split(' ')[0].substring(0, 5);
//           }
          
//           // Create record
//           const record: DisconnectionRecord = {
//             id: `${supervisorId}_${jobDoc.id}`,
//             date: date,
//             time: time,
//             accountNo: jobDoc.id,
//             area: supervisorData.area || "",
//             supervisor: supervisorData.username || supervisorData.userName || "",
//             teamNo: supervisorData.teamNumber?.toString() || "",
//             helper: jobData.helperId ? (helpersMap.get(jobData.helperId) || jobData.helperId) : "",
//             meterNo: "",
//             reading: "",
            
//             // Store original type and image
//             type: jobData.type || jobData.disconnectionAction || "",
//             imageUrl: jobData.imageUrl || "",
//             photo:   "",
            
//             // Initialize all boolean fields
//             dc: false,
//             rc: false,
//             payment100: false,
//             payment80: false,
//             payment50: false,
//             alreadyPaid: false,
//             unSolvedCusComp: false,
//             gateClosed: false,
//             meterRemoved: false,
//             alreadyDisconnected: false,
//             wrongMeter: false,
//             billingError: false,
//             cantFind: false,
//             objections: false,
//             stoppedByBoard: false,
//           };
          
//           allRecords.push(record);
//         }
        
//       } catch (error) {
//         console.log(`Error fetching jobs for supervisor ${supervisorId}:`, error);
//       }
//     }


//     // Convert map to array and dispatch to locations
//     const userLocations = Array.from(userLocationsMap.values())
//       .map(({ timestamp, ...rest }) => rest); // Remove timestamp from final object
    
//     // Filter by area if needed
//     let filteredLocations = userLocations;
//     if (currentUser?.role === 'Waterboard' && currentUser.area) {
//       filteredLocations = userLocations.filter(loc => loc.area === currentUser.area);
//     }
    
//     console.log("locationsssssssssssssssss", filteredLocations); 
//     // Dispatch locations
//     dispatch(setLocations(filteredLocations));

//     console.log(`Total records fetched: ${allRecords.length}`);
//     if (allRecords.length > 0) {
//       console.log("First record:", allRecords[0]);
//     }

//     // Apply filtering
//     let filteredReports = allRecords;
//     if (currentUser?.role === 'Waterboard' && currentUser.area) {
//       filteredReports = allRecords.filter(report => report.area === currentUser.area);
//       console.log(`Filtered to ${filteredReports.length} records for area: ${currentUser.area}`);
//     }

//     dispatch(fetchReportsSuccess(filteredReports));
//   } catch (error: any) {
//     console.error("Error fetching reports:", error);
//     dispatch(fetchReportsFailure(error.message || "Failed to fetch reports"));
//   }
// }




import { AppDispatch } from "../store/store";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { setYearlyRecords, setCurrentMonthRecords, setTodayRecords } from "../store/slices/reportSlice";
import { setLocations } from "../store/slices/userLocationsSlice";
import { DisconnectionRecord } from "@/types/disconnection";

// Fetch all reports for current year except current month (runs once on dashboard)
export async function fetchYearlyReportsExceptCurrentMonth(
  dispatch: AppDispatch,
  currentUser: AuthUser | null
) {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Start of year
    const yearStart = new Date(currentYear, 0, 1);
    // Start of current month
    const monthStart = new Date(currentYear, currentMonth, 1);
    
    const allRecords: DisconnectionRecord[] = [];
    
    // Get helpers map once
    const helpersSnapshot = await getDocs(collection(db, "helpers"));
    const helpersMap = new Map();
    helpersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      helpersMap.set(doc.id, data.username || "");
    });
    
    // Get supervisors based on area if needed
    let supervisorsQuery = collection(db, "supervisors");
    if (currentUser?.role === 'Waterboard' && currentUser.area) {
      supervisorsQuery = query(supervisorsQuery, where("area", "==", currentUser.area));
    }
    
    const supervisorsSnapshot = await getDocs(supervisorsQuery);
    
    // Process in batches to avoid memory issues
    const batchSize = 5; // Process 5 supervisors at a time
    const supervisorDocs = supervisorsSnapshot.docs;
    
    for (let i = 0; i < supervisorDocs.length; i += batchSize) {
      const batch = supervisorDocs.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (supervisorDoc) => {
        const supervisorId = supervisorDoc.id;
        const supervisorData = supervisorDoc.data();
        
        try {
          const jobsRef = collection(db, "completed_jobs", supervisorId, "jobs");
          
          // Query with date filter at database level
          const jobsQuery = query(
            jobsRef,
            where("timestamp", ">=", yearStart.getTime()),
            where("timestamp", "<", monthStart.getTime()),
            orderBy("timestamp", "desc")
          );
          
          const jobsSnapshot = await getDocs(jobsQuery);
          
          jobsSnapshot.docs.forEach(jobDoc => {
            const jobData = jobDoc.data();
            const dateObj = new Date(jobData.timestamp);
            
            const record: DisconnectionRecord = {
              id: `${supervisorId}_${jobDoc.id}`,
              date: dateObj.toISOString().split('T')[0],
              time: jobData.time || dateObj.toTimeString().split(' ')[0].substring(0, 5),
              accountNo: jobDoc.id,
              area: supervisorData.area || "",
              supervisor: supervisorData.username || "",
              teamNo: supervisorData.teamNumber?.toString() || "",
              helper: jobData.helperId ? (helpersMap.get(jobData.helperId) || "") : "",
              type: jobData.type || jobData.disconnectionAction || "",
              imageUrl: jobData.imageUrl || "",
              // ... other fields
            };
            
            allRecords.push(record);
          });
        } catch (error) {
          console.error(`Error fetching jobs for supervisor ${supervisorId}:`, error);
        }
      }));
    }
    
    dispatch(setYearlyRecords(allRecords));
    console.log(`Fetched ${allRecords.length} yearly records`);
    
  } catch (error) {
    console.error("Error fetching yearly reports:", error);
  }
}

// Fetch current month reports only
export async function fetchCurrentMonthReports(
  dispatch: AppDispatch,
  currentUser: AuthUser | null
) {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const allRecords: DisconnectionRecord[] = [];
    
    // Get helpers map
    const helpersSnapshot = await getDocs(collection(db, "helpers"));
    const helpersMap = new Map();
    helpersSnapshot.docs.forEach(doc => {
      helpersMap.set(doc.id, doc.data().username || "");
    });
    
    // Get supervisors
    let supervisorsQuery = collection(db, "supervisors");
    if (currentUser?.role === 'Waterboard' && currentUser.area) {
      supervisorsQuery = query(supervisorsQuery, where("area", "==", currentUser.area));
    }
    
    const supervisorsSnapshot = await getDocs(supervisorsQuery);
    
    // Process supervisors
    for (const supervisorDoc of supervisorsSnapshot.docs) {
      const supervisorId = supervisorDoc.id;
      const supervisorData = supervisorDoc.data();
      
      try {
        const jobsRef = collection(db, "completed_jobs", supervisorId, "jobs");
        
        // Query for current month but NOT today
        const jobsQuery = query(
          jobsRef,
          where("timestamp", ">=", monthStart.getTime()),
          where("timestamp", "<", todayStart.getTime()),
          orderBy("timestamp", "desc")
        );
        
        const jobsSnapshot = await getDocs(jobsQuery);
         
        
        jobsSnapshot.docs.forEach(jobDoc => {
          const jobData = jobDoc.data();
          const dateObj = new Date(jobData.timestamp);
          const jobDate = dateObj.toISOString().split('T')[0];
          
          
          const record: DisconnectionRecord = {
            id: `${supervisorId}_${jobDoc.id}`,
            date: jobDate,
            time: jobData.time || dateObj.toTimeString().split(' ')[0].substring(0, 5),
            accountNo: jobDoc.id,
            area: supervisorData.area || "",
            supervisor: supervisorData.username || "",
            teamNo: supervisorData.teamNumber?.toString() || "",
            helper: jobData.helperId ? (helpersMap.get(jobData.helperId) || "") : "",
            type: jobData.type || jobData.disconnectionAction || "",
            imageUrl: jobData.imageUrl || "",
            // ... other fields
          };
          
          allRecords.push(record);
        });
        
        
      } catch (error) {
        console.error(`Error fetching jobs for supervisor ${supervisorId}:`, error);
      }
    }
    
    // Dispatch current month records
    dispatch(setCurrentMonthRecords(allRecords));
    
    console.log(`Fetched ${allRecords.length} current month records`);
    
  } catch (error) {
    console.error("Error fetching current month reports:", error);
  }
}


// Fetch only today's data (with locations)
export async function fetchTodayReports(
  dispatch: AppDispatch,
  currentUser: AuthUser | null
) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const allRecords: DisconnectionRecord[] = [];
    
    // Get helpers map
    const helpersSnapshot = await getDocs(collection(db, "helpers"));
    const helpersMap = new Map();
    helpersSnapshot.docs.forEach(doc => {
      helpersMap.set(doc.id, doc.data().username || "");
    });
    
    // Get supervisors
    let supervisorsQuery = collection(db, "supervisors");
    if (currentUser?.role === 'Waterboard' && currentUser.area) {
      supervisorsQuery = query(supervisorsQuery, where("area", "==", currentUser.area));
    }
    
    const supervisorsSnapshot = await getDocs(supervisorsQuery);
    
    for (const supervisorDoc of supervisorsSnapshot.docs) {
      const supervisorId = supervisorDoc.id;
      const supervisorData = supervisorDoc.data();
      
      try {
        const jobsRef = collection(db, "completed_jobs", supervisorId, "jobs");
        
        // Query for today only
        const jobsQuery = query(
          jobsRef,
          where("timestamp", ">=", today.getTime()),
          where("timestamp", "<", tomorrow.getTime()),
          orderBy("timestamp", "desc")
        );
        
        const jobsSnapshot = await getDocs(jobsQuery); 
        
        jobsSnapshot.docs.forEach(jobDoc => {
          const jobData = jobDoc.data();
          const dateObj = new Date(jobData.timestamp);
          
          
          const record: DisconnectionRecord = {
            id: `${supervisorId}_${jobDoc.id}`,
            date: dateObj.toISOString().split('T')[0],
            time: jobData.time || dateObj.toTimeString().split(' ')[0].substring(0, 5),
            accountNo: jobDoc.id,
            area: supervisorData.area || "",
            supervisor: supervisorData.username || "",
            teamNo: supervisorData.teamNumber?.toString() || "",
            helper: jobData.helperId ? (helpersMap.get(jobData.helperId) || "") : "",
            type: jobData.type || jobData.disconnectionAction || "",
            imageUrl: jobData.imageUrl || "",
            // ... other fields
          };
          
          allRecords.push(record);
        });
         
      } catch (error) {
        console.error(`Error fetching today's jobs for supervisor ${supervisorId}:`, error);
      }
    }
    
    dispatch(setTodayRecords(allRecords)); 
    
    console.log(`Fetched ${allRecords.length} today's records`); 
    
  } catch (error) {
    console.error("Error fetching today's reports:", error);
  }
}



// Fetch only today's supervisor locations (for live location page)
export async function fetchTodayLocations(
  dispatch: AppDispatch,
  currentUser: AuthUser | null
) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const locations = [];
    
    // Get supervisors
    let supervisorsQuery = collection(db, "supervisors");
    if (currentUser?.role === 'Waterboard' && currentUser.area) {
      supervisorsQuery = query(supervisorsQuery, where("area", "==", currentUser.area));
    }
    
    const supervisorsSnapshot = await getDocs(supervisorsQuery);
    
    for (const supervisorDoc of supervisorsSnapshot.docs) {
      const supervisorId = supervisorDoc.id;
      const supervisorData = supervisorDoc.data();
      
      try {
        const jobsRef = collection(db, "completed_jobs", supervisorId, "jobs");
        
        // Query for today only, get latest job
        const jobsQuery = query(
          jobsRef,
          where("timestamp", ">=", today.getTime()),
          where("timestamp", "<", tomorrow.getTime()),
          orderBy("timestamp", "desc"),
          limit(1)  // Only get the latest job
        );
        
        const jobsSnapshot = await getDocs(jobsQuery);
        
        if (!jobsSnapshot.empty) {
          const latestJob = jobsSnapshot.docs[0].data();
          
          if (latestJob.latitude && latestJob.longitude) {
            locations.push({
              id: supervisorId,
              name: supervisorData.username || "",
              avatar: supervisorData.avatar || `https://i.pravatar.cc/150?u=${supervisorId}`,
              area: supervisorData.area || "",
              lat: latestJob.latitude,
              lng: latestJob.longitude,
              role: 'Supervisor'
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching location for supervisor ${supervisorId}:`, error);
      }
    }
    
    dispatch(setLocations(locations));
    console.log(`Found ${locations.length} supervisor locations for today`);
    
  } catch (error) {
    console.error("Error fetching today's locations:", error);
  }
}