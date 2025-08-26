// // lib/store/slices/staffSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface Staff {
//   id: string;
//   username: string;
//   email: string;
//   phone: string;
//   password: string;
//   userType: "Helper" | "Supervisor";
//   linkedStaffId: string;
//   createdAt?: string; 
//   area: string;
//   teamNumber: number;
//   empNumber: string;
//   joinDate: string;
//   isActive: boolean;
//   status?: 'Active' | 'Inactive' | 'Incomplete';
// }

// interface StaffState {
//   staffList: Staff[];
// }

// const initialState: StaffState = {
//   staffList: [],
// };

// const staffSlice = createSlice({
//   name: "staff",
//   initialState,
//   reducers: {
//     setStaff(state, action: PayloadAction<Staff[]>) {
//       state.staffList = action.payload;
//     },
//     addStaff(state, action: PayloadAction<Staff>) {
//       state.staffList.push(action.payload);
//     },
//     updateStaff(state, action: PayloadAction<{ id: string; updates: Partial<Staff> }>) {
//       const index = state.staffList.findIndex(staff => staff.id === action.payload.id);
//       if (index !== -1) {
//         state.staffList[index] = { ...state.staffList[index], ...action.payload.updates };
//       }
//     },
//     deleteStaff(state, action: PayloadAction<string>) {
//         state.staffList = state.staffList.filter(staff => staff.id !== action.payload);
//       },
//   },
// });

// export const { setStaff, addStaff, updateStaff,deleteStaff } = staffSlice.actions;
// export default staffSlice.reducer;



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
  createdAt?: string; 
  area: string;
  teamNumber: number;
  empNumber: string;
  joinDate: string;
  isActive: boolean;
  status?: 'Active' | 'Inactive' | 'Incomplete';
}

interface StaffState {
  staffList: Staff[];
}

const initialState: StaffState = {
  staffList: [],
};

// ADD: central status recalculation helper
function recalcStatuses(list: Staff[]): Staff[] {
  // Group by area + teamNumber
  const groups = new Map<string, Staff[]>();
  list.forEach(s => {
    const key = `${s.area}|${s.teamNumber}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  });

  // Determine completeness per group
  groups.forEach(group => {
    const activeSup = group.some(m => m.userType === 'Supervisor' && m.isActive);
    const activeHelp = group.some(m => m.userType === 'Helper' && m.isActive);
    const fullPair = activeSup && activeHelp;

    group.forEach(member => {
      if (!member.isActive) {
        member.status = 'Inactive';
      } else if (fullPair) {
        member.status = 'Active';
      } else {
        member.status = 'Incomplete';
      }
    });
  });

  return list;
}

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaff(state, action: PayloadAction<Staff[]>) {
      state.staffList = recalcStatuses(action.payload.slice());
    },
    addStaff(state, action: PayloadAction<Staff>) {
      state.staffList.push(action.payload);
      state.staffList = recalcStatuses(state.staffList.slice());
    },
    updateStaff(state, action: PayloadAction<{ id: string; updates: Partial<Staff> }>) {
      const index = state.staffList.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staffList[index] = { ...state.staffList[index], ...action.payload.updates };
        state.staffList = recalcStatuses(state.staffList.slice());
      }
    },
    deleteStaff(state, action: PayloadAction<string>) {
      state.staffList = state.staffList.filter(staff => staff.id !== action.payload);
      state.staffList = recalcStatuses(state.staffList.slice());
    },
  },
});

export const { setStaff, addStaff, updateStaff, deleteStaff } = staffSlice.actions;
export default staffSlice.reducer;