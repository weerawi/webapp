// src/lib/services/userLocationService.ts
import { AppDispatch } from "../store/store";
import { setLocations } from "../store/slices/userLocationsSlice";
import { mockUserLocations } from "@/lib/mock-locations";

// Future Firebase (commented for now)
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { UserLocation } from "../types/location"; // You can create this type separately

export async function fetchAndStoreUserLocations(dispatch: AppDispatch) {
  try {
    // Optional: simulate loading delay
    await new Promise((res) => setTimeout(res, 500));

    // ✅ Use mock data for now
    dispatch(setLocations(mockUserLocations));

    // 🔒 Future Firebase fetching (commented out for now)
    /*
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "userLocations"));
    const locations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserLocation[];

    dispatch(setLocations(locations));
    */
  } catch (error) {
    console.error("Error fetching user locations:", error);
  }
}
