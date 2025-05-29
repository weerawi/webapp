"use client";
import { Card, CardHeader } from "@/components/ui/card";
import Breadcrumb from "@/components/navigation/Breadcrumb";
// import { ReportFilters } from "@/components/report/report-filters"
import { ReportView } from "@/components/dashboard/report/report-view";
import { ReportStats } from "@/components/dashboard/report/report-stats";
import { ReportFilters } from "@/components/dashboard/report/report-filters";

export default function ReportPage() {
  // For now, we'll use mock data. When Firebase is ready, uncomment the code below:

  /*
  // Firebase implementation:
  const [data, setData] = useState(mockDisconnectionData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Import Firebase functions when ready
        // const { getDisconnectionData } = await import("@/lib/firebase")
        // const firebaseData = await getDisconnectionData()
        // setData(firebaseData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }
  */

  return (
    <>
      <Breadcrumb />

      <Card className="mx-5 py-1 pb-2 mb-5">
        <div className="container mx-auto px-6  space-y-3 ">
          <div className="flex flex-col ">
            <CardHeader className="text-3xl font-semibold pl-0">
              Reports
            </CardHeader>
            <p className="text-muted-foreground">
              Track and analyze disconnection activities with comprehensive
              reporting tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="px-4 py-2">
                <ReportFilters />
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-5 ">
              {/* Stats Overview */}
              {/* <ReportStats /> */}

              {/* Report View */}
              <ReportView />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
