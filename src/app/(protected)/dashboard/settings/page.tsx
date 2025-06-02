"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from "react";
  
export default function SettingsPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);
  return (
    <>
      <Breadcrumb />
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings and preferences will appear here.</p>
        </CardContent>
      </Card>
    </>
  );
} 