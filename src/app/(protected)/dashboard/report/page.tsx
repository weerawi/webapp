// "use client";

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/lib/store/store";
// import { fetchAndStoreReports } from "@/lib/services/reportService";
// import { Card, CardHeader } from "@/components/ui/card";
// import Breadcrumb from "@/components/navigation/Breadcrumb";
// import { ReportView } from "@/components/dashboard/report/report-view";
// import { ReportFilters } from "@/components/dashboard/report/report-filters";
// import { hideLoader } from "@/lib/store/slices/loaderSlice";

// export default function ReportPage() {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     fetchAndStoreReports(dispatch);
//     dispatch(hideLoader());
//   }, [dispatch]);

//   return (
//     <>
//       <Breadcrumb />

//       <Card className="mx-5 py-1 pb-2 mb-5">
//         <div className="container mx-auto px-6 space-y-3">
//           <div className="flex flex-col">
//             <CardHeader className="text-3xl font-semibold pl-0">Reports</CardHeader>
//             <p className="text-muted-foreground">
//               Track and analyze disconnection activities with comprehensive reporting tools
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
//             <div className="lg:col-span-1">
//               <Card className="px-4 py-2">
//                 <ReportFilters />
//               </Card>
//             </div>

//             <div className="lg:col-span-5">
//               <ReportView />
//             </div>
//           </div>
//         </div>
//       </Card>
//     </>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { fetchAndStoreReports } from "@/lib/services/reportService";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import { ReportView } from "@/components/dashboard/report/report-view";
import { ReportFilters } from "@/components/dashboard/report/report-filters";
import { AreaWiseReport } from "@/components/dashboard/report/area-wise-report";
import { SupervisorWiseReport } from "@/components/dashboard/report/supervisor-wise-report";
import { hideLoader } from "@/lib/store/slices/loaderSlice";
import { FileText, MapPin, Users } from "lucide-react";

export default function ReportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("disconnection");

  useEffect(() => {
    fetchAndStoreReports(dispatch);
    dispatch(hideLoader());
  }, [dispatch]);

  return (
    <>
      <Breadcrumb />

      <Card className="mx-5 py-1 pb-2 mb-5 w-full max-w-[calc(98vw-2rem)] ">
        <div className="container mx-auto px-6 space-y-3">
          <div className="flex flex-col">
            <CardHeader className="text-3xl font-semibold pl-0">Reports</CardHeader>
            <p className="text-muted-foreground">
              Track and analyze disconnection activities with comprehensive reporting tools
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="disconnection" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Disconnection
              </TabsTrigger>
              <TabsTrigger value="area" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Area Wise
              </TabsTrigger>
              <TabsTrigger value="supervisor" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Supervisor Wise
              </TabsTrigger>
            </TabsList>

            <TabsContent value="disconnection">
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
            </TabsContent>

            <TabsContent value="area">
              <AreaWiseReport />
            </TabsContent>

            <TabsContent value="supervisor">
              <SupervisorWiseReport />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </>
  );
}