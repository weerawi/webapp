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
import { useDispatch, useSelector } from "react-redux";
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
import { BarChart3, FileText, MapPin, Users } from "lucide-react";

export default function ReportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("workdone");
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(hideLoader());
    fetchAndStoreReports(dispatch, currentUser);
  }, [dispatch, currentUser]);

  return (
    <>
      <Breadcrumb />

      <Card className="mx-5 py-1 pb-2 mb-5 w-full max-w-[calc(98vw-2rem)] ">
        <div className="container mx-auto px-6 space-y-3">
          <div className="flex flex-col">
            {/* <CardHeader className="text-3xl font-semibold pl-0">
              Reports
            </CardHeader>  */}
            <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="workdone" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Work Done
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Summary View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workdone">
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

            <TabsContent value="summary">
              <Tabs defaultValue="supervisor" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger
                    value="supervisor"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Supervisor Wise
                  </TabsTrigger>
                  <TabsTrigger value="area" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Area Wise
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="supervisor" className="mt-4">
                  <SupervisorWiseReport />
                </TabsContent>

                <TabsContent value="area" className="mt-4">
                  <AreaWiseReport />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
          </div>

          
        </div>
      </Card>
    </>
  );
}
