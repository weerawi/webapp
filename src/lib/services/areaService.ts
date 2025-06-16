// lib/services/areaService.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { AppDispatch } from "../store/store";
import { setAreas } from "../store/slices/areaSlice";

export const fetchAreasFromFirestore = async (dispatch: AppDispatch) => {
  const snapshot = await getDocs(collection(db, "areas"));
  const areas = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
  dispatch(setAreas(areas));
};