"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";

export default function ReportPage() {
  return (
    <>
      <Breadcrumb />
      <Card>
        <CardHeader>
          <CardTitle>Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reports and analytics will appear here.</p>
        </CardContent>
      </Card>
    </>
  );
} 