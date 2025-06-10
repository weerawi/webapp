"use client";
import { Card  } from "@/components/ui/card";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from "react";
import UserMap from "@/components/dashboard/liveLocation/UserMap";
import { fetchAndStoreUserLocations } from "@/lib/services/userLocationService";
import UserSidebar from "@/components/dashboard/liveLocation/userSidebar";
import { setResetLocations } from "@/lib/store/slices/userLocationsSlice";
import { RootState } from "@/lib/store/store";

export default function LiveLocationPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

useEffect(() => {
  dispatch(hideLoader());
  fetchAndStoreUserLocations(dispatch, currentUser);
  dispatch(setResetLocations());
}, [dispatch, currentUser]);

  return (
    <>
      <Breadcrumb />
      <Card className="mx-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 border-r p-4">
            <UserSidebar />
          </div>
          <div className="md:col-span-3 p-3">
            <UserMap />
          </div>
        </div>
      </Card>
    </>
  );
}
