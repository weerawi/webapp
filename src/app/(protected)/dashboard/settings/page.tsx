"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";

export default function SettingsPage() {
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