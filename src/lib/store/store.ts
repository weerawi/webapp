import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";  
import reportReducer from "./slices/reportSlice";
import loaderReducer from "./slices/loaderSlice";
import userLocationReducer from "./slices/userLocationsSlice";
// import staffReducer from "./slices/staffSlice";
import staffAdminReducer from "./slices/staffAdminSlice";
import adminReducer from "./slices/adminSlice";
import reconnectionReducer from "./slices/reconnectionSlice"
import areaReducer from "./slices/areaSlice"
import attendanceReducer from './slices/attendanceSlice';
import supervisorReducer from "./slices/supervisorSlice"; 
import helperReducer from "./slices/helperSlice"; 

const persistConfig = {
  key: "root",
  storage,
};

const appReducer = combineReducers({
  auth: authReducer,
  report: reportReducer,
  loader: loaderReducer,
  userLocations: userLocationReducer,
  // staff:staffReducer,
  supervisor: supervisorReducer,
  helper: helperReducer,
  staffAdmin: staffAdminReducer,
  admin: adminReducer,
  reconnection: reconnectionReducer,
  area: areaReducer,
  attendance: attendanceReducer,
});
const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_APP') {
    storage.removeItem('persist:root');
    state = undefined;
  }
  return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer); 

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    devTools: {
      name: "Hegra webapp",  
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;