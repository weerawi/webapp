import { AppDispatch } from "../store/store";
import { AttendanceRecord, setAttendance } from "../store/slices/attendanceSlice";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Singleton pattern for attendance data management
class AttendanceManager {
  private static instance: AttendanceManager;
  private lastFetchDate: string | null = null;
  private cachedMonthData: AttendanceRecord[] = [];
  private isFetchingMonth = false;
  private isFetchingToday = false;
  private staffMap: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): AttendanceManager {
    if (!AttendanceManager.instance) {
      AttendanceManager.instance = new AttendanceManager();
    }
    return AttendanceManager.instance;
  }

  // Load staff details into map
  private async loadStaffMap() {
    if (this.staffMap.size > 0) return; // Already loaded
    
    const [helpersSnap, supervisorsSnap] = await Promise.all([
      getDocs(collection(db, "helpers")),
      getDocs(collection(db, "supervisors"))
    ]);
    
    helpersSnap.forEach(doc => {
      const data = doc.data();
      this.staffMap.set(doc.id, {
        name: data.username || data.userName || "Unknown",
        role: "helper",
        area: data.area,
        teamNumber: data.teamNumber,
        isActive: data.isActive !== false && data.status !== 'Deleted'
      });
    });
    
    supervisorsSnap.forEach(doc => {
      const data = doc.data();
      this.staffMap.set(doc.id, {
        name: data.username || data.userName || "Unknown",
        role: "supervisor",
        area: data.area,
        teamNumber: data.teamNumber,
        isActive: data.isActive !== false && data.status !== 'Deleted'
      });
    });
  }

  // Parse attendance data for a specific date
  private parseAttendanceData(dateString: string, dayData: any): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    
    Object.entries(dayData).forEach(([uid, data]: [string, any]) => {
      const staffInfo = this.staffMap.get(uid);
      if (staffInfo && staffInfo.isActive) {
        records.push({
          id: `${dateString}_${uid}`,
          staffId: uid,
          staffName: staffInfo.name,
          area: data.area || staffInfo.area,
          teamNumber: data.teamNumber || staffInfo.teamNumber || 0,
          role: data.role?.toLowerCase() || staffInfo.role,
          date: dateString,
          timeIn: data.timeIn || undefined,
          timeOut: data.timeOut || undefined,
          status: data.status || "out",
          gpsLocationIn: data.gpsLocationIn || undefined,
          gpsLocationOut: data.gpsLocationOut || undefined,
          imageUrl: data.imageUrl || undefined
        });
      }
    });
    
    return records;
  }

  // Fetch one month of attendance data (excluding today)
  async fetchMonthlyAttendance(dispatch: AppDispatch): Promise<void> {
    if (this.isFetchingMonth) return;
    
    this.isFetchingMonth = true;
    try {
      await this.loadStaffMap();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toISOString().split('T')[0];
      
      // Check if we already fetched this month
      const currentMonth = today.toISOString().substring(0, 7);
      if (this.lastFetchDate?.startsWith(currentMonth) && this.cachedMonthData.length > 0) {
        dispatch(setAttendance(this.cachedMonthData));
        return;
      }

      const attendanceRecords: AttendanceRecord[] = [];

      // Fetch last 30 days excluding today
      const promises = [];
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        promises.push(
          getDoc(doc(db, "attendance", dateString)).then(docSnap => ({
            dateString,
            data: docSnap.exists() ? docSnap.data() : null
          }))
        );
      }

      const results = await Promise.all(promises);
      
      results.forEach(({ dateString, data }) => {
        if (data) {
          attendanceRecords.push(...this.parseAttendanceData(dateString, data));
        }
      });

      this.cachedMonthData = attendanceRecords;
      this.lastFetchDate = todayString;
      dispatch(setAttendance(attendanceRecords));
      
      console.log(`Fetched ${attendanceRecords.length} monthly attendance records`);
      
    } finally {
      this.isFetchingMonth = false;
    }
  }

  // Fetch only today's attendance
  async fetchTodayAttendance(dispatch: AppDispatch): Promise<void> {
    if (this.isFetchingToday) return;
    
    this.isFetchingToday = true;
    try {
      await this.loadStaffMap();
      
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      const attendanceDoc = await getDoc(doc(db, "attendance", todayString));
      
      let todayRecords: AttendanceRecord[] = [];
      if (attendanceDoc.exists()) {
        todayRecords = this.parseAttendanceData(todayString, attendanceDoc.data());
      }

      // Merge with cached data (remove old today's data first)
      const filteredCache = this.cachedMonthData.filter(r => r.date !== todayString);
      const allRecords = [...filteredCache, ...todayRecords];
      
      dispatch(setAttendance(allRecords));
      console.log(`Fetched ${todayRecords.length} today's attendance records`);
      
    } finally {
      this.isFetchingToday = false;
    }
  }

  // Fetch attendance for specific date
  async fetchDateAttendance(dispatch: AppDispatch, date: Date): Promise<void> {
    await this.loadStaffMap();
    
    const dateString = date.toISOString().split('T')[0];
    const attendanceDoc = await getDoc(doc(db, "attendance", dateString));
    
    let dateRecords: AttendanceRecord[] = [];
    if (attendanceDoc.exists()) {
      dateRecords = this.parseAttendanceData(dateString, attendanceDoc.data());
    }

    dispatch(setAttendance(dateRecords));
    console.log(`Fetched ${dateRecords.length} records for ${dateString}`);
  }

  // Refresh staff map (call when staff is added/updated)
  async refreshStaffMap(): Promise<void> {
    this.staffMap.clear();
    await this.loadStaffMap();
  }

  // Clear all cached data
  clearCache(): void {
    this.cachedMonthData = [];
    this.lastFetchDate = null;
    this.staffMap.clear();
  }
}

// Export singleton instance methods
const attendanceManager = AttendanceManager.getInstance();

export const fetchMonthlyAttendance = (dispatch: AppDispatch) => 
  attendanceManager.fetchMonthlyAttendance(dispatch);

export const fetchTodayAttendance = (dispatch: AppDispatch) => 
  attendanceManager.fetchTodayAttendance(dispatch);

export const fetchDateAttendance = (dispatch: AppDispatch, date: Date) => 
  attendanceManager.fetchDateAttendance(dispatch, date);

export const refreshAttendanceStaffMap = () => 
  attendanceManager.refreshStaffMap();

export const clearAttendanceCache = () => 
  attendanceManager.clearCache();