"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDisconnectionStore } from "@/lib/store/disconnection"
import { Zap, ZapOff, DollarSign, AlertTriangle } from "lucide-react"

export function ReportStats() {
  const filteredRecords = useDisconnectionStore((state) => state.filteredRecords)

  // Calculate stats from filtered records
  const totalRecords = filteredRecords.length

  const dcCount = filteredRecords.filter((record) => record.dc).length
  const rcCount = filteredRecords.filter((record) => record.rc).length

  const payment100Count = filteredRecords.filter((record) => record.payment100).length
  const payment80Count = filteredRecords.filter((record) => record.payment80).length
  const payment50Count = filteredRecords.filter((record) => record.payment50).length
  const alreadyPaidCount = filteredRecords.filter((record) => record.alreadyPaid).length

  const fieldIssuesCount = filteredRecords.filter(
    (record) => record.gateClosed || record.meterRemoved || record.alreadyDisconnected || record.wrongMeter,
  ).length

  const customerIssuesCount = filteredRecords.filter(
    (record) =>
      record.unSolvedCusComp || record.billingError || record.cantFind || record.objections || record.stoppedByNWSDB,
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords}</div>
          <p className="text-xs text-muted-foreground">Disconnection activities</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">DC/RC Status</CardTitle>
          <ZapOff className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className="text-red-600">{dcCount}</span> / <span className="text-green-600">{rcCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            DC: {Math.round((dcCount / totalRecords) * 100) || 0}% | RC:{" "}
            {Math.round((rcCount / totalRecords) * 100) || 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agent Payments</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {payment100Count + payment80Count + payment50Count + alreadyPaidCount}
          </div>
          <p className="text-xs text-muted-foreground">
            100%: {payment100Count} | 80%: {payment80Count} | 50%: {payment50Count} | Paid: {alreadyPaidCount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{fieldIssuesCount + customerIssuesCount}</div>
          <p className="text-xs text-muted-foreground">
            Field: {fieldIssuesCount} | Customer: {customerIssuesCount}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
