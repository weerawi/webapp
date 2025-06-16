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
  name: "areas",
  initialState,
  reducers: {
    setAreas(state, action: PayloadAction<Area[]>) {
      state.areas = action.payload;
    },
  },
});

export const { setAreas } = areaSlice.actions;
export default areaSlice.reducer;