"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from "react"; 
import AddStaffForm from '@/components/dashboard/staff/addStaffForm';
import StaffTable from '@/components/dashboard/staff/staffTable';

export default function StaffPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);
  return (
    <>
      <Breadcrumb />
      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Staff management and information will appear here.</p>
          <AddStaffForm />
          <StaffTable />
        </CardContent>
      </Card>
    </>
  );
} 