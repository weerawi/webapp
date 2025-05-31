"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { fetchAndStoreReports } from "@/lib/services/reportService";
import { Card, CardHeader } from "@/components/ui/card";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { ReportView } from "@/components/dashboard/report/report-view";
import { ReportFilters } from "@/components/dashboard/report/report-filters";

export default function ReportPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchAndStoreReports(dispatch);
  }, [dispatch]);

  return (
    <>
      <Breadcrumb />

      <Card className="mx-5 py-1 pb-2 mb-5">
        <div className="container mx-auto px-6 space-y-3">
          <div className="flex flex-col">
            <CardHeader className="text-3xl font-semibold pl-0">Reports</CardHeader>
            <p className="text-muted-foreground">
              Track and analyze disconnection activities with comprehensive reporting tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-1">
              <Card className="px-4 py-2">
                <ReportFilters />
              </Card>
            </div>

            <div className="lg:col-span-5">
              <ReportView />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
