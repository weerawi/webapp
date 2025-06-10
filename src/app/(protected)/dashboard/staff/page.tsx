// app/dashboard/staff/page.tsx
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from "react";
import AddStaffForm from "@/components/dashboard/staff/addStaffForm";
import StaffTable from "@/components/dashboard/staff/staffTable";
import { AppDispatch } from "@/lib/store/store";
import { Separator } from "@/components/ui/separator";
import { fetchStaffFromFirestore } from "@/lib/services/staffService";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function StaffPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hideLoader());
    // Fetch staff data on component mount
    fetchStaffFromFirestore(dispatch);
  }, [dispatch]); 

  return (
    <div>
      <Breadcrumb />
      <ProtectedRoute allowedRoles={["Admin"]}>

        <Card className="mx-5 px-5 gap-2">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Staff Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your team members, assign roles, and track assignments
            </p>
          </div>
          <AddStaffForm />
        </CardHeader>

        <Separator />

        <StaffTable />
      </Card>
      </ProtectedRoute>
      
    </div>
  );
}