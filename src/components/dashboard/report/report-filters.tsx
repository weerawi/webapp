"use client"

import { useState } from "react"
import { FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useDisconnectionStore } from "@/lib/store/disconnection"
import { areas, supervisors, teamNumbers, helpers } from "@/lib/mock-data"

export function ReportFilters() {
  const [dateRange, setDateRange] = useState<any>(null)

  const filters = useDisconnectionStore((state) => state.filters)
  const setFilters = useDisconnectionStore((state) => state.setFilters)
  const applyFilters = useDisconnectionStore((state) => state.applyFilters)
  const resetFilters = useDisconnectionStore((state) => state.resetFilters)

  const handleDateRangeChange = (range: any) => {
    setDateRange(range)
    setFilters({
      dateFrom: range?.from || null,
      dateTo: range?.to || null,
    })
  }

  const handleApplyFilters = () => {
    applyFilters()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <Label htmlFor="date-range">Date Range</Label>
        <DatePickerWithRange value={dateRange} onChange={handleDateRangeChange} className="w-full" />
      </div>

      <Separator />

      {/* Area Filter */}
      <div className="space-y-2">
        <Label htmlFor="area">Area</Label>
        <Select value={filters.area} onValueChange={(value) => setFilters({ area: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Supervisor Filter */}
      <div className="space-y-2">
        <Label htmlFor="supervisor">Supervisor</Label>
        <Select value={filters.supervisor} onValueChange={(value) => setFilters({ supervisor: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Supervisors</SelectItem>
            {supervisors.map((supervisor) => (
              <SelectItem key={supervisor} value={supervisor}>
                {supervisor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Number Filter */}
      <div className="space-y-2">
        <Label htmlFor="teamNo">Team Number</Label>
        <Select value={filters.teamNo} onValueChange={(value) => setFilters({ teamNo: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select team number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {teamNumbers.map((teamNo) => (
              <SelectItem key={teamNo} value={teamNo}>
                {teamNo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Helper Filter */}
      <div className="space-y-2">
        <Label htmlFor="helper">Helper</Label>
        <Select value={filters.helper} onValueChange={(value) => setFilters({ helper: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select helper" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Helpers</SelectItem>
            {helpers.map((helper) => (
              <SelectItem key={helper} value={helper}>
                {helper}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Payment Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select value={filters.paymentStatus} onValueChange={(value) => setFilters({ paymentStatus: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="100">100% Payment</SelectItem>
            <SelectItem value="80">80% Payment</SelectItem>
            <SelectItem value="50">50% Payment</SelectItem>
            <SelectItem value="paid">Already Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Disconnection Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="disconnectionStatus">Disconnection Status</Label>
        <Select
          value={filters.disconnectionStatus}
          onValueChange={(value) => setFilters({ disconnectionStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select disconnection status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="dc">DC</SelectItem>
            <SelectItem value="rc">RC</SelectItem>
            <SelectItem value="gateClosed">Gate Closed</SelectItem>
            <SelectItem value="meterRemoved">Meter Removed</SelectItem>
            <SelectItem value="alreadyDisconnected">Already Disconnected</SelectItem>
            <SelectItem value="wrongMeter">Wrong Meter</SelectItem>
            <SelectItem value="billingError">Billing Error</SelectItem>
            <SelectItem value="cantFind">Can't Find</SelectItem>
            <SelectItem value="objections">Objections</SelectItem>
            <SelectItem value="stoppedByNWSDB">Stopped By NWSDB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Active Filters */}
      {(filters.area !== "all" ||
        filters.supervisor !== "all" ||
        filters.teamNo !== "all" ||
        filters.helper !== "all" ||
        filters.paymentStatus !== "all" ||
        filters.disconnectionStatus !== "all" ||
        filters.dateFrom ||
        filters.dateTo) && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-1">
            {filters.area !== "all" && <Badge variant="secondary">Area: {filters.area}</Badge>}
            {filters.supervisor !== "all" && <Badge variant="secondary">Supervisor: {filters.supervisor}</Badge>}
            {filters.teamNo !== "all" && <Badge variant="secondary">Team: {filters.teamNo}</Badge>}
            {filters.helper !== "all" && <Badge variant="secondary">Helper: {filters.helper}</Badge>}
            {filters.paymentStatus !== "all" && <Badge variant="secondary">Payment: {filters.paymentStatus}</Badge>}
            {filters.disconnectionStatus !== "all" && (
              <Badge variant="secondary">Status: {filters.disconnectionStatus}</Badge>
            )}
            {(filters.dateFrom || filters.dateTo) && <Badge variant="secondary">Date Range Selected</Badge>}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  )
}
