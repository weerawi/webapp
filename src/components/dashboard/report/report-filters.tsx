"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  setFilters,
  applyFilters,
  resetFilters,
} from "@/lib/store/slices/reportSlice";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

export function ReportFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.report.filters);
  const areas = useSelector((state: RootState) => state.report.areas);
  const supervisors = useSelector(
    (state: RootState) => state.report.supervisors
  );
  const teamNumbers = useSelector(
    (state: RootState) => state.report.teamNumbers
  );
  const helpers = useSelector((state: RootState) => state.report.helpers);

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
    to: filters.dateTo ? new Date(filters.dateTo) : undefined,
  });

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
    dispatch(
      setFilters({
        dateFrom: range?.from ? range.from.toISOString() : null,
        dateTo: range?.to ? range.to.toISOString() : null,
      })
    );
  };

  const handleApplyFilters = () => {
    dispatch(applyFilters());
  };

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined });
    dispatch(resetFilters());
  };

  const handleRemoveFilter = (key: keyof typeof filters) => {
    dispatch(
      setFilters({
        [key]: key === "dateFrom" || key === "dateTo" ? null : "all",
      })
    );
    if (key === "dateFrom" || key === "dateTo")
      setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-2 max-w-xs">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>

      {/* Date Range */}
      <div className="space-y-1">
        <Label>Date Range</Label>
        <DatePickerWithRange
          value={dateRange}
          onChange={handleDateRangeChange}
          className="w-full"
        />
      </div>

      {/* Area */}
      <div className="space-y-1">
        <Label>Area</Label>
        <Select
          value={filters.area}
          onValueChange={(val) => dispatch(setFilters({ area: val }))}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {(areas || []).map((area: string) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Supervisor */}
      <div className="space-y-1">
        <Label>Supervisor</Label>
        <Select
          value={filters.supervisor}
          onValueChange={(val) => dispatch(setFilters({ supervisor: val }))}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Supervisors</SelectItem>
            {(supervisors || []).map((s: string) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Number */}
      <div className="space-y-1">
        <Label>Team Number</Label>
        <Select
          value={filters.teamNo}
          onValueChange={(val) => dispatch(setFilters({ teamNo: val }))}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select team number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {(teamNumbers || []).map((t: string) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Helper */}
      <div className="space-y-1">
        <Label>Helper</Label>
        <Select
          value={filters.helper}
          onValueChange={(val) => dispatch(setFilters({ helper: val }))}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select helper" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Helpers</SelectItem>
            {(helpers || []).map((h: string) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Status */}
      <div className="space-y-1">
        <Label>Payment Status</Label>
        <Select
          value={filters.paymentStatus}
          onValueChange={(val) => dispatch(setFilters({ paymentStatus: val }))}
        >
          <SelectTrigger className="cursor-pointer">
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

      {/* Disconnection Status */}
      <div className="space-y-1">
        <Label>Disconnection Status</Label>
        <Select
          value={filters.disconnectionStatus}
          onValueChange={(val) =>
            dispatch(setFilters({ disconnectionStatus: val }))
          }
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select disconnection status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="dc">DC</SelectItem>
            <SelectItem value="rc">RC</SelectItem>
            <SelectItem value="gateClosed">Gate Closed</SelectItem>
            <SelectItem value="meterRemoved">Meter Removed</SelectItem>
            <SelectItem value="alreadyDisconnected">
              Already Disconnected
            </SelectItem>
            <SelectItem value="wrongMeter">Wrong Meter</SelectItem>
            <SelectItem value="billingError">Billing Error</SelectItem>
            <SelectItem value="cantFind">Can&apos;t Find</SelectItem>
            <SelectItem value="objections">Objections</SelectItem>
            <SelectItem value="stoppedByNWSDB">Stopped By NWSDB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Active Filters Badges */}
      <div className="space-y-1">
        <Label>Active Filters</Label>
        <div className="flex flex-wrap gap-2">
          {filters.area !== "all" && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              Area: {filters.area}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 cursor-pointer"
                onClick={() => handleRemoveFilter("area")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.supervisor !== "all" && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              Supervisor: {filters.supervisor}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 cursor-pointer"
                onClick={() => handleRemoveFilter("supervisor")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.teamNo !== "all" && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              Team: {filters.teamNo}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 cursor-pointer"
                onClick={() => handleRemoveFilter("teamNo")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.helper !== "all" && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              Helper: {filters.helper}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 cursor-pointer"
                onClick={() => handleRemoveFilter("helper")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.paymentStatus !== "all" && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              Payment: {filters.paymentStatus}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 cursor-pointer"
                onClick={() => handleRemoveFilter("paymentStatus")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {filters.disconnectionStatus !== "all" && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              Status: {filters.disconnectionStatus}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 cursor-pointer"
                onClick={() => handleRemoveFilter("disconnectionStatus")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
              Date Range
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 cursor-pointer"
                onClick={() => {
                  handleRemoveFilter("dateFrom");
                  handleRemoveFilter("dateTo");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={handleApplyFilters} className="w-full cursor-pointer">
          Apply Filters
        </Button>
        <Button onClick={handleReset}  className="w-full cursor-pointer">
          Clear All
        </Button>
      </div>
    </div>
  );
}
