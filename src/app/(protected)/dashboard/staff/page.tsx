// app/dashboard/staff/page.tsx
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from "react";
import AddStaffForm from "@/components/dashboard/staff/addStaffForm";
import StaffTable from "@/components/dashboard/staff/staffTable";
import { RootState } from "@/lib/store/store";
import { Users, Shield, UserCheck, TrendingUp } from "lucide-react";
import { Separator } from "@radix-ui/react-select";

export default function StaffPage() {
  const dispatch = useDispatch();
  const staffList = useSelector((state: RootState) => state.staff.staffList);

  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);

  // const supervisorCount = staffList.filter(
  //   (s) => s.userType === "Supervisor"
  // ).length;
  // const helperCount = staffList.filter((s) => s.userType === "Helper").length;

  return (
    <div >
      <Breadcrumb />

      <Card className="mx-5 px-5 gap-2 ">
        {/* Header Section */}
        <CardHeader className="flex items-center justify-between ">
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

        <Separator/>

        {/* Staff Table */}
        <StaffTable />
      </Card>
    </div>
  );
}
