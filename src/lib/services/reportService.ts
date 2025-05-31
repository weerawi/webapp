// src/lib/services/reportService.ts
import { AppDispatch } from "../store/store";
import {
  fetchReportsStart,
  fetchReportsSuccess,
  fetchReportsFailure
} from "../store/slices/reportSlice";
import { mockDisconnectionRecords } from "@/lib/mock/disconnection-data";


// Call this function in ReportPage
export async function fetchAndStoreReports(dispatch: AppDispatch) {
  try {
    dispatch(fetchReportsStart());

    // Mocking delay and data
    await new Promise((res) => setTimeout(res, 500));
    dispatch(fetchReportsSuccess(mockDisconnectionRecords));

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
  } catch (err: any) {
    dispatch(fetchReportsFailure(err.message || "Failed to load reports"));
  }
}
