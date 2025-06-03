// components/staff/StaffTable.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Card } from "@/components/ui/card";

export default function StaffTable() {
  const staffList = useSelector((state: RootState) => state.staff.staffList);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Staff List</h2>
      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted text-sm">
            <tr>
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">User Type</th>
              <th className="p-2">Linked To</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} className="border-t">
                <td className="p-2">{staff.username}</td>
                <td className="p-2">{staff.email}</td>
                <td className="p-2">{staff.phone}</td>
                <td className="p-2">{staff.userType}</td>
                <td className="p-2">{staff.linkedStaffId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
