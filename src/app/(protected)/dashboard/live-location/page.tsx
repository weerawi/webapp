"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from 'react';

export default function LiveLocationPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);
  
  return (
    <>
      <Breadcrumb />
      <Card>
        <CardHeader>
          <CardTitle>Live Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Live location tracking will appear here.</p>
        </CardContent>
      </Card>
    </>
  );
} 