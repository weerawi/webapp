import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReconnectionTask {
  id: string;
  accountNumber: string;
  team: string;
  imageUrl?: string;
  allocatedTime: string;
  status: 'pending' | 'done_by_waterboard' | 'transfer_to_new';
  finishTime?: string;
  finished: boolean;
  transferredFrom?: string; // For tracking transferred tasks
}

interface ReconnectionState {
  tasks: ReconnectionTask[];
  loading: boolean;
  error: string | null;
}

const initialState: ReconnectionState = {
  tasks: [],
  loading: false,
  error: null
};

const reconnectionSlice = createSlice({
  name: 'reconnection',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<ReconnectionTask[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<ReconnectionTask>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<ReconnectionTask>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetReconnectionState() {
      return initialState;
    },
  }
});

export const { setTasks, addTask, updateTask, setLoading, setError, resetReconnectionState } = reconnectionSlice.actions;
export default reconnectionSlice.reducer;