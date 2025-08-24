// lib/store/slices/attendanceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  area: string;
  teamNumber: number;
  role: 'supervisor' | 'helper';
  date: string;
  timeIn: string;
  timeOut: string;
  status: 'in' | 'out';
  gpsLocation: string;
  imageUrl?: string;
}

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendance: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.records = action.payload;
    },
    addAttendance: (state, action: PayloadAction<AttendanceRecord>) => {
      state.records.push(action.payload);
    },
    updateAttendance: (state, action: PayloadAction<{ id: string; updates: Partial<AttendanceRecord> }>) => {
      const index = state.records.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = { ...state.records[index], ...action.payload.updates };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAttendance, addAttendance, updateAttendance, setLoading } = attendanceSlice.actions;
export default attendanceSlice.reducer;