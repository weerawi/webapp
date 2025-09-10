// src/lib/services/reportService.ts
import { AppDispatch } from "../store/store";
import {
  fetchReportsStart,
  fetchReportsSuccess,
  fetchReportsFailure
} from "../store/slices/reportSlice";
// import { mockDisconnectionData } from "@/lib/mock-data";
import { AuthUser } from "../store/slices/authSlice";
import { DisconnectionRecord } from "@/types/disconnection";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config"; 

// Call this function in ReportPage
// Update the function signature to accept currentUser
export async function fetchAndStoreReports(
  dispatch: AppDispatch,
  currentUser: AuthUser | null
) {
  try {
    dispatch(fetchReportsStart());
    console.log("Starting to fetch reports...");

    const allRecords: DisconnectionRecord[] = [];

    // First fetch all supervisors to get their IDs
    const supervisorsSnapshot = await getDocs(collection(db, "supervisors"));
    console.log(`Found ${supervisorsSnapshot.size} supervisors`);

    for (const supervisorDoc of supervisorsSnapshot.docs) {
      const supervisorId = supervisorDoc.id;
      const supervisorData = supervisorDoc.data();
      console.log(`Checking supervisor ${supervisorId} (${supervisorData.username})`);
      
      try {
        // Try to access the jobs subcollection directly
        const jobsRef = collection(db, "completed_jobs", supervisorId, "jobs");
        const jobsSnapshot = await getDocs(jobsRef);
        
        if (jobsSnapshot.empty) {
          console.log(`No jobs found for supervisor ${supervisorId}`);
          continue;
        }
        
        console.log(`Found ${jobsSnapshot.size} jobs for supervisor ${supervisorId}`);
        
        for (const jobDoc of jobsSnapshot.docs) {
          const jobData = jobDoc.data();
          console.log(`Processing job ${jobDoc.id}:`, jobData);
          
          // Extract date and time
          let date = "";
          let time = "";
          if (jobData.timestamp) {
            const dateObj = new Date(jobData.timestamp);
            date = dateObj.toISOString().split('T')[0];
            time = jobData.time || dateObj.toTimeString().split(' ')[0].substring(0, 5);
          }
          
          // Create record
          const record: DisconnectionRecord = {
            id: `${supervisorId}_${jobDoc.id}`,
            date: date,
            time: time,
            accountNo: jobDoc.id,
            area: supervisorData.area || "",
            supervisor: supervisorData.username || supervisorData.userName || "",
            teamNo: supervisorData.teamNumber?.toString() || "",
            helper: supervisorData.linkedHelperId || "",
            meterNo: "",
            reading: "",
            
            // Store original type and image
            type: jobData.type || jobData.disconnectionAction || "",
            imageUrl: jobData.imageUrl || "",
            photo:   "",
            
            // Initialize all boolean fields
            dc: false,
            rc: false,
            payment100: false,
            payment80: false,
            payment50: false,
            alreadyPaid: false,
            unSolvedCusComp: false,
            gateClosed: false,
            meterRemoved: false,
            alreadyDisconnected: false,
            wrongMeter: false,
            billingError: false,
            cantFind: false,
            objections: false,
            stoppedByNWSDB: false,
          };
          
          allRecords.push(record);
        }
      } catch (error) {
        console.log(`Error fetching jobs for supervisor ${supervisorId}:`, error);
      }
    }

    console.log(`Total records fetched: ${allRecords.length}`);
    if (allRecords.length > 0) {
      console.log("First record:", allRecords[0]);
    }

    // Apply filtering
    let filteredReports = allRecords;
    if (currentUser?.role === 'Waterboard' && currentUser.area) {
      filteredReports = allRecords.filter(report => report.area === currentUser.area);
      console.log(`Filtered to ${filteredReports.length} records for area: ${currentUser.area}`);
    }

    dispatch(fetchReportsSuccess(filteredReports));
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    dispatch(fetchReportsFailure(error.message || "Failed to fetch reports"));
  }
}