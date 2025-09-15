import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 
import { DisconnectionRecord } from "@/types/disconnection";

interface ReportState {
  records: DisconnectionRecord[];
  filteredRecords: DisconnectionRecord[];
  filters: {
    area: string;
    supervisor: string;
    teamNo: string;
    helper: string;
    paymentStatus: string;
    disconnectionStatus: string;
    accountNo: string;
    dateFrom: string | null;
    dateTo: string | null;
  };
  loading: boolean;
  error: string | null;
  areas: string[],
  supervisors: string[],
  teamNumbers: string[],
  helpers: string[],
  currentDate: string; 
  dynamicColumns: string[];
}

const initialState: ReportState = {
  records: [],
  filteredRecords: [],
  filters: {
    area: "all",
    supervisor: "all",
    teamNo: "all",
    helper: "all",
    paymentStatus: "all",
    accountNo: "all",
    disconnectionStatus: "all",
    dateFrom: null,
    dateTo: null,
  },
  loading: false,
  error: null,
  areas: [],
  supervisors: [],
  teamNumbers: [],
  helpers: [],
  currentDate: new Date().toISOString().split('T')[0],
  dynamicColumns: [],
};


const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    fetchReportsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchReportsSuccess: (state, action: PayloadAction<DisconnectionRecord[]>) => {
      const records = action.payload;
    
      // Set records
      state.records = records;
      state.filteredRecords = records;
      state.loading = false;
    
      // Dynamically extract unique values
      const unique = <K extends keyof DisconnectionRecord>(key: K) =>
        [...new Set(records.map((r) => r[key]))].filter(Boolean) as string[];
    
      state.areas = unique("area");
      state.supervisors = unique("supervisor");
      state.teamNumbers = unique("teamNo");
      state.helpers = unique("helper");
      state.accountNumbers = unique("accountNo")
    },    
    fetchReportsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ReportState["filters"]>>) => {
      // state.filters = { ...state.filters, ...action.payload };
      const updates = { ...action.payload }; 
      
      state.filters = { ...state.filters, ...updates };
      
      // Auto-apply filters
      reportSlice.caseReducers.applyFilters(state);
    },
    applyFilters: (state) => {
      const {
        area,
        supervisor,
        teamNo,
        helper,
        accountNo,
        // paymentStatus,
        // disconnectionStatus,
        dateFrom,
        dateTo,
      } = state.filters;

      state.filteredRecords = state.records.filter((record) => {
        const matchesArea = area === "all" || record.area === area;
        const matchesSupervisor = supervisor === "all" || record.supervisor === supervisor;
        const matchesTeam = teamNo === "all" || record.teamNo === teamNo;
        const matchesHelper = helper === "all" || record.helper === helper;
        const matchesAccountNo = accountNo === "all" || record.accountNo === accountNo;
        // const matchesPayment =
        //   paymentStatus === "all" ||
        //   (paymentStatus === "paid" && record.alreadyPaid) ||
        //   record[`payment${paymentStatus}` as keyof typeof record];
        // const matchesStatus =
        //   disconnectionStatus === "all" ||
        //   record[disconnectionStatus as keyof typeof record] === true;

        
          
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);

        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        if (from) from.setHours(0, 0, 0, 0);
        if (to) to.setHours(23, 59, 59, 999); 
        const withinDateRange =
          (!dateFrom || new Date(dateFrom) <= recordDate) &&
          (!dateTo || recordDate <= new Date(dateTo));

        return (
          matchesArea &&
          matchesSupervisor &&
          matchesTeam &&
          matchesHelper &&
          matchesAccountNo && 
          // matchesPayment &&
          // matchesStatus &&
          withinDateRange
        );
      });
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredRecords = state.records;
    },
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    setDynamicColumnsAll: (state, action: PayloadAction<string[]>) => {
      state.dynamicColumns = action.payload;
    },
    resetReportState: () => initialState,
  },
});

export const {
  fetchReportsStart,
  fetchReportsSuccess,
  fetchReportsFailure,
  setFilters,
  applyFilters,
  resetFilters,
  setCurrentDate,
  setDynamicColumnsAll,
  resetReportState
} = reportSlice.actions;

export default reportSlice.reducer;
