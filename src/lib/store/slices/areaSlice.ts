// lib/store/slices/areaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Area {
  id: string;
  name: string;
}

interface AreaState {
  areas: Area[];
}

const initialState: AreaState = {
  areas: [],
};

const areaSlice = createSlice({
  name: "all_areas",
  initialState,
  reducers: {
    setAreas(state, action: PayloadAction<Area[]>) {
      state.areas = action.payload;
    },
    resetAreaState() {
      return initialState;
    },
  },
});

export const { setAreas, resetAreaState } = areaSlice.actions;
export default areaSlice.reducer;