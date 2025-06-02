// src/lib/services/reportService.ts
import { AppDispatch } from "../store/store";
import {
  fetchReportsStart,
  fetchReportsSuccess,
  fetchReportsFailure
} from "../store/slices/reportSlice";
import { mockDisconnectionData } from "@/lib/mock-data";


// Call this function in ReportPage
export async function fetchAndStoreReports(dispatch: AppDispatch) {
  try {
    dispatch(fetchReportsStart());

    // Mocking delay and data
    await new Promise((res) => setTimeout(res, 500));
    dispatch(fetchReportsSuccess(mockDisconnectionData));

    // 🔒 Future Firebase (commented for now)
    /*
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "disconnectionRecords"));
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DisconnectionRecord[];
    dispatch(fetchReportsSuccess(reports));
    */
  } catch (err: unknown) {
    let errorMessage = "Failed to load reports";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    }
    dispatch(fetchReportsFailure(errorMessage));
  }
}
