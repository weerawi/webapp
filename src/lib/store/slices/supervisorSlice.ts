import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Helper } from "./helperSlice";

export interface Supervisor {
  id: string;
  uid?: string;
  username: string;
  email: string;
  phone: string;
  password: string; // Only supervisors have passwords
  linkedHelperId?: string; // Link to helper
  createdAt?: string;
  area: string;
  teamNumber: number;
  empNumber: string;
  joinDate: string;
  isActive: boolean;
  status?: 'Active' | 'Inactive' | 'Incomplete'| 'Deleted';
  userType: 'Supervisor';
}

interface SupervisorState {
  supervisors: Supervisor[];
}

const initialState: SupervisorState = {
  supervisors: [],
};

function calculateSupervisorStatus(supervisor: Supervisor, helpers?: Helper[]): 'Active' | 'Inactive' | 'Incomplete' {
  if (!supervisor.isActive) return 'Inactive';
  
  if (supervisor.linkedHelperId && supervisor.teamNumber > 0) {
    // Check if linked helper exists and is active
    if (helpers) {
      const linkedHelper = helpers.find(h => h.id === supervisor.linkedHelperId);
      if (linkedHelper?.isActive) return 'Active';
    }
    return 'Incomplete'; // Assume active if we can't check helper
  }
  
  return 'Incomplete';
}

const supervisorSlice = createSlice({
  name: "supervisor",
  initialState,
  reducers: {
    setSupervisors(state, action: PayloadAction<Supervisor[]>) {
      state.supervisors = action.payload.map(s => ({
        ...s,
        status: s.status === 'Deleted' ? 'Deleted' : calculateSupervisorStatus(s)
      }));
    },
    updateSupervisor(state, action: PayloadAction<{ id: string; updates: Partial<Supervisor> }>) {
      const index = state.supervisors.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        const updated = { ...state.supervisors[index], ...action.payload.updates };
        updated.status = calculateSupervisorStatus(updated);
        state.supervisors[index] = updated;
      }
    },
    addSupervisor(state, action: PayloadAction<Supervisor>) {
      state.supervisors.push(action.payload);
    }, 
    deleteSupervisor(state, action: PayloadAction<string>) {
      state.supervisors = state.supervisors.filter(s => s.id !== action.payload);
    },
    resetSupervisorState() {
      return initialState;
    },
  },
});

export const { setSupervisors, addSupervisor, updateSupervisor, deleteSupervisor, resetSupervisorState } = supervisorSlice.actions;
export default supervisorSlice.reducer;