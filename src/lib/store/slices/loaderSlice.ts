// store/slices/loaderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoaderState {
  isVisible: boolean;
  message?: string;
}

const initialState: LoaderState = {
  isVisible: false,
  message: "",
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<string | undefined>) => {
      state.isVisible = true;
      state.message = action.payload || "Loading...";
    },
    hideLoader: (state) => {
      state.isVisible = false;
      state.message = "";
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
