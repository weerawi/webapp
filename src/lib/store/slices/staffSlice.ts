// lib/store/slices/staffSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Staff {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  userType: "Helper" | "Supervisor";
  linkedStaffId: string;
  createdAt?: string; // Add timestamp for trend calculation
}

interface StaffState {
  staffList: Staff[];
}

const initialState: StaffState = {
  staffList: [],
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaff(state, action: PayloadAction<Staff[]>) {
      state.staffList = action.payload;
    },
    addStaff(state, action: PayloadAction<Staff>) {
      state.staffList.push(action.payload);
    },
    updateStaff(state, action: PayloadAction<{ id: string; updates: Partial<Staff> }>) {
      const index = state.staffList.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staffList[index] = { ...state.staffList[index], ...action.payload.updates };
      }
    },
    deleteStaff(state, action: PayloadAction<string>) {
        state.staffList = state.staffList.filter(staff => staff.id !== action.payload);
      },
  },
});

export const { setStaff, addStaff, updateStaff,deleteStaff } = staffSlice.actions;
export default staffSlice.reducer;