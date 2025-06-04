import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Sub-admin";
  modules?: string[];
  status: "Active" | "Disabled";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details?: any;
}

interface AdminState {
  adminList: Admin[];
  auditLogs: AuditLog[];
  sessionTimeout: number; // in minutes
}

const initialState: AdminState = {
  adminList: [],
  auditLogs: [],
  sessionTimeout: 30, // default 30 minutes
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmins(state, action: PayloadAction<Admin[]>) {
      state.adminList = action.payload;
    },
    addAdmin(state, action: PayloadAction<Admin>) {
      state.adminList.push(action.payload);
    },
    updateAdmin(state, action: PayloadAction<{ id: string; updates: Partial<Admin> }>) {
      const index = state.adminList.findIndex(admin => admin.id === action.payload.id);
      if (index !== -1) {
        state.adminList[index] = { ...state.adminList[index], ...action.payload.updates };
      }
    },
    deleteAdmin(state, action: PayloadAction<string>) {
      state.adminList = state.adminList.filter(admin => admin.id !== action.payload);
    },
    setAuditLogs(state, action: PayloadAction<AuditLog[]>) {
      state.auditLogs = action.payload;
    },
    addAuditLog(state, action: PayloadAction<AuditLog>) {
      state.auditLogs.unshift(action.payload);
    },
    setSessionTimeout(state, action: PayloadAction<number>) {
      state.sessionTimeout = action.payload;
    }
  },
});

export const { 
  setAdmins, 
  addAdmin, 
  updateAdmin, 
  deleteAdmin, 
  setAuditLogs, 
  addAuditLog,
  setSessionTimeout 
} = adminSlice.actions;
export default adminSlice.reducer;