"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store/store";
import { fetchAuditLogsFromFirestore } from "@/lib/services/adminService";
import { format } from "date-fns";

export default function AuditLogs() {
  const dispatch = useDispatch<AppDispatch>();
  const { auditLogs } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      await fetchAuditLogsFromFirestore(dispatch);
    } catch (error) {
      console.error("Failed to load audit logs", error);
    }
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("Added") || action.includes("Created")) return "default";
    if (action.includes("Updated") || action.includes("Modified")) return "secondary";
    if (action.includes("Deleted") || action.includes("Removed")) return "destructive";
    if (action.includes("Enabled") || action.includes("Activated")) return "outline";
    if (action.includes("Disabled") || action.includes("Deactivated")) return "destructive";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Audit Logs
        </CardTitle>
        <CardDescription>
          View all administrative actions and system changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No audit logs available
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.details ? (
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {JSON.stringify(log.details)}
                      </code>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}