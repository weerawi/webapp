// app/dashboard/staff/page.tsx
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect, useState } from "react";
import AddStaffForm from "@/components/dashboard/staff/addStaffForm";
import StaffTable from "@/components/dashboard/staff/staffTable";
import AttendanceTable from "@/components/dashboard/staff/AttendanceTable";
import { AppDispatch } from "@/lib/store/store";
import { Separator } from "@/components/ui/separator";
import { fetchAllStaffFromFirestore, fetchAttendanceFromFirestore } from "@/lib/services/staffService";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { fetchAreasFromFirestore } from "@/lib/services/areaService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Users, Clock } from "lucide-react";

export default function StaffPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("user-roles");
 

  // In app/dashboard/staff/page.tsx, update the useEffect:
useEffect(() => {
  dispatch(hideLoader());
  // Fetch staff data on component mount
  fetchAllStaffFromFirestore(dispatch);
  fetchAreasFromFirestore(dispatch);
  
  // Fetch attendance data (using mock data)
  fetchAttendanceFromFirestore(dispatch);
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
                Manage your team members, assign roles, and track attendance
              </p>
            </div>
            {activeTab === "user-roles" && <AddStaffForm />}
          </CardHeader>

          <Separator />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="user-roles" className="flex items-center gap-2 cursor-pointer">
                <Users className="h-4 w-4" />
                User Roles
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2 cursor-pointer">
                <Clock className="h-4 w-4" />
                Attendance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user-roles" className="mt-1">
              <StaffTable />
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-1">
              <AttendanceTable />
            </TabsContent>
          </Tabs>
        </Card>
      </ProtectedRoute>
    </div>
  );
}