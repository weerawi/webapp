"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart, TrendingUp } from "lucide-react"

interface ReportChartProps {
  data: any[]
}

export function ReportChart({ data }: ReportChartProps) {
  // Calculate chart data from reports
  const statusCounts = data.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1
    return acc
  }, {})

  const areaCounts = data.reduce((acc, report) => {
    acc[report.area] = (acc[report.area] || 0) + 1
    return acc
  }, {})

  const totalAmount = data.reduce((sum, report) => sum + report.amount, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Status Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm">{status}</span>
                <span className="font-medium">{count as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Area Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Area Distribution</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(areaCounts).map(([area, count]) => (
              <div key={area} className="flex items-center justify-between">
                <span className="text-sm">{area}</span>
                <span className="font-medium">{count as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Summary</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Revenue</span>
              <span className="font-medium">${totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average per Report</span>
              <span className="font-medium">${Math.round(totalAmount / data.length).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Reports</span>
              <span className="font-medium">{data.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
