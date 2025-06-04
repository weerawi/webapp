import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Staff {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: "Helper" | "Supervisor";
  supervisorId?: string; // For helpers
  helperIds?: string[]; // For supervisors
  createdAt: string;
  updatedAt: string;
}

interface StaffState {
  staffList: Staff[];
  supervisors: Staff[];
  helpers: Staff[];
}

const initialState: StaffState = {
  staffList: [],
  supervisors: [],
  helpers: [],
};

const staffAdminSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaff(state, action: PayloadAction<Staff[]>) {
      state.staffList = action.payload;
      state.supervisors = action.payload.filter(s => s.userType === "Supervisor");
      state.helpers = action.payload.filter(s => s.userType === "Helper");
    },
    addStaff(state, action: PayloadAction<Staff>) {
      state.staffList.push(action.payload);
      if (action.payload.userType === "Supervisor") {
        state.supervisors.push(action.payload);
      } else {
        state.helpers.push(action.payload);
      }
    },
    updateStaff(state, action: PayloadAction<{ id: string; updates: Partial<Staff> }>) {
      const index = state.staffList.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staffList[index] = { ...state.staffList[index], ...action.payload.updates };
        // Update filtered lists
        state.supervisors = state.staffList.filter(s => s.userType === "Supervisor");
        state.helpers = state.staffList.filter(s => s.userType === "Helper");
      }
    },
    deleteStaff(state, action: PayloadAction<string>) {
      state.staffList = state.staffList.filter(staff => staff.id !== action.payload);
      state.supervisors = state.staffList.filter(s => s.userType === "Supervisor");
      state.helpers = state.staffList.filter(s => s.userType === "Helper");
    }
  },
});

export const { setStaff, addStaff, updateStaff, deleteStaff } = staffAdminSlice.actions;
export default staffAdminSlice.reducer;