// components/staff/StaffForm.tsx
"use client";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AppDispatch, RootState } from "@/lib/store/store";
import { addStaff } from "@/lib/store/slices/staffSlice";
import { saveStaffToFirestore } from "@/lib/services/staffService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AddStaffForm() {
  const dispatch = useDispatch<AppDispatch>();
  const staffList = useSelector((state: RootState) => state.staff.staffList);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    userType: "Helper" as "Helper" | "Supervisor",
    linkedStaffId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = await saveStaffToFirestore(form);
    dispatch(addStaff({ id, ...form }));
    setForm({ username: "", email: "", phone: "", password: "", userType: "Helper", linkedStaffId: "" });
  };

  const linkedOptions =
    form.userType === "Helper"
      ? staffList.filter((s) => s.userType === "Supervisor")
      : staffList.filter((s) => s.userType === "Helper");

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label>Username</Label>
        <Input name="username" value={form.username} onChange={handleChange} />
      </div>
      <div>
        <Label>Email</Label>
        <Input name="email" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <Label>Phone</Label>
        <Input name="phone" value={form.phone} onChange={handleChange} />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" name="password" value={form.password} onChange={handleChange} />
      </div>
      <div>
        <Label>User Type</Label>
        <Select value={form.userType} onValueChange={(val) => setForm({ ...form, userType: val as any })}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Helper">Helper</SelectItem>
            <SelectItem value="Supervisor">Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{form.userType === "Helper" ? "Supervisor" : "Helper"}</Label>
        <Select
          value={form.linkedStaffId}
          onValueChange={(val) => setForm({ ...form, linkedStaffId: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select linked staff" />
          </SelectTrigger>
          <SelectContent>
            {linkedOptions.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Save Staff</Button>
    </form>
  );
}
