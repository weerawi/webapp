"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from "react";

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
        </CardContent>
      </Card>
    </>
  );
} 