// // userLocationSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { mockUserLocations } from "@/lib/mock-locations";

// interface UserLocation {
//   id: string;
//   name: string;
//   avatar: string;
//   lat: number;
//   lng: number;
// }

// interface LocationState {
//   users: UserLocation[];
//   selectedUserId: number | null;
// }

// const initialState: LocationState = {
//   users: mockUserLocations,
//   selectedUserId: null,
// };

// const userLocationSlice = createSlice({
//   name: "userLocations",
//   initialState,
//   reducers: {
//     setLocations(state, action: PayloadAction<UserLocation[]>) {
//       state.users = action.payload;
//     },
//     setSelectedUserId: (state, action: PayloadAction<number | null>) => {
//         state.selectedUserId = action.payload;
//     }
//   },
// });

// export const { setLocations, setSelectedUserId } = userLocationSlice.actions;
// export default userLocationSlice.reducer;


// userLocationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserLocation {
    id: string; // Changed from number to string
    name: string;
    avatar: string;
    lat: number;
    lng: number;
  }
  
  interface LocationState {
    users: UserLocation[];
    selectedUserId: string | null;  
    searchTerm: string;
  }
  
  const initialState: LocationState = {
    users: [],
    selectedUserId: null,
    searchTerm: "",
  };
  
  const userLocationSlice = createSlice({
    name: "userLocations",
    initialState,
    reducers: {
      setLocations(state, action: PayloadAction<UserLocation[]>) {
        state.users = action.payload;
      },
      setSelectedUserId(state, action: PayloadAction<string | null>) { // Changed parameter type
        state.selectedUserId = action.payload;
      },
      setSearchTerm(state, action: PayloadAction<string>) {
        state.searchTerm = action.payload;
      },
      setResetLocations(state){
        state.selectedUserId =  initialState.selectedUserId;
        state.searchTerm = initialState.searchTerm;
      }
    },
  });

export const { setLocations, setSelectedUserId, setSearchTerm ,setResetLocations} = userLocationSlice.actions;
export default userLocationSlice.reducer;
