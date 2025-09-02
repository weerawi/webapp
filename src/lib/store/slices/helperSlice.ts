import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Helper {
  id: string;
  username: string;
  email: string;
  phone: string;
  linkedSupervisorId?: string; // Link to supervisor
  createdAt?: string;
  area: string;
  teamNumber: number;
  empNumber: string;
  joinDate: string;
  isActive: boolean;
  status?: 'Active' | 'Inactive' | 'Incomplete';
}

interface HelperState {
  helpers: Helper[];
}

const initialState: HelperState = {
  helpers: [],
};

function calculateHelperStatus(helper: Helper, supervisors?: Supervisor[]): 'Active' | 'Inactive' | 'Incomplete' {
  if (!helper.isActive) return 'Inactive';
  
  if (helper.linkedSupervisorId && helper.teamNumber > 0) {
    // Check if linked supervisor exists and is active
    if (supervisors) {
      const linkedSupervisor = supervisors.find(s => s.id === helper.linkedSupervisorId);
      if (linkedSupervisor?.isActive) return 'Active';
    }
    return 'Incomplete'; 
  }
  
  return 'Incomplete';
}

const helperSlice = createSlice({
  name: "helper",
  initialState,
  reducers: {
    setHelpers(state, action: PayloadAction<Helper[]>) {
      state.helpers = action.payload.map(h => ({
        ...h,
        status: calculateHelperStatus(h)
      }));
    },
    updateHelper(state, action: PayloadAction<{ id: string; updates: Partial<Helper> }>) {
      const index = state.helpers.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        const updated = { ...state.helpers[index], ...action.payload.updates };
        updated.status = calculateHelperStatus(updated);
        state.helpers[index] = updated;
      }
    },
    addHelper(state, action: PayloadAction<Helper>) {
      state.helpers.push(action.payload);
    }, 
    deleteHelper(state, action: PayloadAction<string>) {
      state.helpers = state.helpers.filter(h => h.id !== action.payload);
    },
  },
});

export const { setHelpers, addHelper, updateHelper, deleteHelper } = helperSlice.actions;
export default helperSlice.reducer;