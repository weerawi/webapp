"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";

export default function LiveLocationPage() {
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