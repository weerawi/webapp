import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  id: string;
  uid?: string;
  username: string;
  email: string;
  password: string;
  role: "Admin" | "Waterboard";
  status: "Active" | "Disabled";
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  // Waterboard specific fields
  area?: string;
  tenderNumber?: string;
  options?: string[]; // DC, RC, etc.
}

export interface WaterboardOption {
  id: string;
  name: string;
  createdAt: string;
}

export interface Area {
  id: string;
  name: string;
  assignedTo?: string; // user id
  createdAt: string;
}

interface AdminState {
  adminList: Admin[];
  waterboardOptions: WaterboardOption[];
  areas: Area[];
  auditLogs: AuditLog[];
}

const initialState: AdminState = {
  adminList: [],
  waterboardOptions: [],
  areas: [],
  auditLogs: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setWaterboardOptions: (state, action: PayloadAction<WaterboardOption[]>) => {
      state.waterboardOptions = action.payload;
    },
    addWaterboardOption: (state, action: PayloadAction<WaterboardOption>) => {
      state.waterboardOptions.push(action.payload);
    },
    setAreas: (state, action: PayloadAction<Area[]>) => {
      state.areas = action.payload;
    },
    addArea: (state, action: PayloadAction<Area>) => {
      state.areas.push(action.payload);
    },
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
    },
    resetAdminState() {
      return initialState;
    }
  },
});

export const { 
  setWaterboardOptions, 
  addWaterboardOption,
  setAreas,
  addArea,
  setAdmins, 
  addAdmin, 
  updateAdmin, 
  deleteAdmin, 
  setAuditLogs, 
  addAuditLog,
  setSessionTimeout,
  resetAdminState
} = adminSlice.actions;

export default adminSlice.reducer;