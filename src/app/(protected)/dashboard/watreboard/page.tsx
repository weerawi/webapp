"use client";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"; 
import WaterboardManagement from "@/components/dashboard/watreboard/WaterboardManagement";
import { useEffect } from "react";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useDispatch } from "react-redux";

export default function WaterboardPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);

  return (
    <>
      <Breadcrumb />
      <Card className="mx-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Waterboard User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProtectedRoute allowedRoles={["Admin"]}>
            <WaterboardManagement />
          </ProtectedRoute>
        </CardContent>
      </Card>
    </>
  );
}