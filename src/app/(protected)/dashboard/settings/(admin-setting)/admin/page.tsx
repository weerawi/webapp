"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminManagement from "@/components/dashboard/settings/AdminManagement";
import AuditLogs from "@/components/dashboard/settings//AuditLogs";
import SessionSettings from "@/components/dashboard/settings//SessionSettings";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <>
      <Breadcrumb />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admins" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admins">Admin Management</TabsTrigger>
              <TabsTrigger value="session">Session Settings</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="admins">
              <AdminManagement />
            </TabsContent>
            <TabsContent value="session">
              <SessionSettings />
            </TabsContent>
            <TabsContent value="audit">
              <AuditLogs />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}