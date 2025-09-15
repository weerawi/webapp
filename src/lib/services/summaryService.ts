import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { DisconnectionRecord } from "@/types/disconnection";
import { checkRecordType } from "@/lib/utils/record-type-checker";

export async function saveMonthlySummariesFromRedux(records: DisconnectionRecord[]) {
  try {
    // Group records by supervisor and year-month
    const summaryMap = new Map<string, Map<string, number>>();
    const todayCountMap = new Map<string, number>(); // For today's count
    
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    records.forEach(record => {
      // Get supervisor ID (you might need to fetch this mapping)
      const supervisorKey = record.supervisor; // or use actual UID if available
      const yearMonth = record.date.substring(0, 7); // "2025-09-10" -> "2025-09"
      
      if (!summaryMap.has(supervisorKey)) {
        summaryMap.set(supervisorKey, new Map());
      }
      
      const monthMap = summaryMap.get(supervisorKey)!;
      if (!monthMap.has(yearMonth)) {
        monthMap.set(yearMonth, 0);
      }
      
      // Count DC only
      if (checkRecordType(record, 'dc')) {
        monthMap.set(yearMonth, monthMap.get(yearMonth)! + 1);
        
        // Count today's DC
        if (record.date === today) {
          todayCountMap.set(supervisorKey, (todayCountMap.get(supervisorKey) || 0) + 1);
        }
      }
    });
    
    // Save to Firebase
    for (const [supervisorKey, months] of summaryMap.entries()) {
      // Get actual supervisor UID from supervisors collection
      const supervisorsSnapshot = await getDocs(collection(db, "supervisors"));
      const supervisorDoc = supervisorsSnapshot.docs.find(
        doc => doc.data().username === supervisorKey
      );
      
      if (supervisorDoc) {
        const supervisorUID = supervisorDoc.id;
        
        for (const [yearMonth, dcCount] of months.entries()) {
          const currentYearMonth = new Date().toISOString().substring(0, 7);
          const todayCount = yearMonth === currentYearMonth ? (todayCountMap.get(supervisorKey) || 0) : 0;
          
          // Changed: Remove '/data' from the path - save directly under yearMonth
          const summaryRef = doc(db, "summarydc", supervisorUID, yearMonth, "data");
          await setDoc(summaryRef, { 
            dcCount: dcCount,
            todayCount: todayCount,
            updatedAt: new Date().toISOString()
          });
        }
      }
    }
    
    console.log("Summaries saved successfully");
  } catch (error) {
    console.error("Error saving summaries:", error);
  }
}