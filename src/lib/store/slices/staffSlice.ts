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
  },
});

export const { setStaff, addStaff } = staffSlice.actions;
export default staffSlice.reducer;
