"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";

export default function WaterBoardPage() {
  return (
    <>
      <Breadcrumb />
      <Card>
        <CardHeader>
          <CardTitle>Water Board</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Water board information will appear here.</p>
        </CardContent>
      </Card>
    </>
  );
} 