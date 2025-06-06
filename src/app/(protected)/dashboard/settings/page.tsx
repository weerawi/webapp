"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { useDispatch } from "react-redux";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, FileText, Settings } from "lucide-react";

export default function SettingsPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);

  const settingsItems = [
    {
      title: "Admin Settings",
      description: "Manage administrators, view audit logs, and configure sessions",
      icon: Shield,
      href: "/dashboard/settings/admin",
    },
    {
      title: "User Preferences",
      description: "Customize your personal settings and preferences",
      icon: Users,
      href: "#",
    },
    {
      title: "Reports Configuration",
      description: "Configure report templates and schedules",
      icon: FileText,
      href: "#",
    },
    {
      title: "System Settings",
      description: "General system configuration and maintenance",
      icon: Settings,
      href: "#",
    },
  ];

  return (
    <>
      <Breadcrumb />
      <div className="space-y-6">
        <Card className='mx-5'>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {settingsItems.map((item) => (
                <Card key={item.title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <Link href={item.href}>
                      <Button variant="outline" size="sm" disabled={item.href === "#"}>
                         Manage
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}