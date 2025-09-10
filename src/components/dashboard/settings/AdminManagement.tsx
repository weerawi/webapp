"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store/store";
import { Admin, addAdmin, updateAdmin, deleteAdmin } from "@/lib/store/slices/adminSlice";
import {
  saveAdminToFirestore,
  updateAdminInFirestore,
  deleteAdminFromFirestore,
  fetchAdminsFromFirestore,
  saveAuditLogToFirestore,
  saveWaterboardOption,
  fetchWaterboardOptions,
  saveArea,
  fetchAreas,
  deleteAreaByUserId,
  createAuthUser,
  saveAreaOptions,
} from "@/lib/services/adminService";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { WaterboardOptionsManager } from "./WaterboardOptionManager"; 

export default function AdminManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { adminList } = useSelector((state: RootState) => state.admin);
  const [open, setOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [waterboardOptions, setWaterboardOptions] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Admin" as "Admin" | "Waterboard",
    area: "",
    tenderNumber: "",
    options: [] as string[],
  });

  useEffect(() => {
    loadAdmins();
    loadWaterboardData();
  }, []);

  const loadAdmins = async () => {
    try {
      await fetchAdminsFromFirestore(dispatch);
    } catch (error) {
      toast.error("Failed to load admins");
    }
  };

  const loadWaterboardData = async () => {
    try {
      const [options, areasData] = await Promise.all([
        fetchWaterboardOptions(),
        fetchAreas(),
      ]);
      setWaterboardOptions(options.map(o => o.name));
      setAreas(areasData.map(a => a.name));
    } catch (error) {
      console.error("Failed to load waterboard data:", error);
    }
  };

  const handleAddNewOption = async (option: string) => {
    try {
      await saveWaterboardOption(option);
      setWaterboardOptions([...waterboardOptions, option]);
      toast.success("Option added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add option");
      throw error;
    }
  };

  const handleAreaChange = async (area: string) => {
    // Check if area already exists
    const exists = areas.some(a => a.toLowerCase() === area.toLowerCase());
    if (exists) {
      toast.error("This area is already assigned to another user");
      return;
    }
    setFormData({ ...formData, area });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    setIsSubmitting(true); 

    try {
      // Validation for waterboard users
      if (formData.role === "Waterboard") {
        if (!formData.area.trim()) {
          toast.error("Area is required for Waterboard users");
          return;
        }
      }

      const adminData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: "Active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(formData.role === "Waterboard" && {
          area: formData.area,
          tenderNumber: formData.tenderNumber,
          options: formData.options,
        }),
      };

      if (editingAdmin) {
        // For editing, we don't update Firebase Auth password
        const updateData = { ...adminData };
        if (!formData.password) {
          delete updateData.password;
        }
        
        await updateAdminInFirestore(editingAdmin.id, updateData);
        dispatch(updateAdmin({ id: editingAdmin.id, updates: updateData }));
        
        // Update area options if it's a Waterboard user
        if (formData.role === "Waterboard" && formData.area) {
          await saveAreaOptions(formData.area, formData.options);
        }
        
        await saveAuditLogToFirestore({
          userId: currentUser?.uid || "unknown",
          userName: currentUser?.email || "Unknown Admin",
          action: `Updated user: ${formData.username}`,
          details: { adminId: editingAdmin.id },
        });
        
        toast.success("User updated successfully");
      } else {
        // Create new user in Firebase Auth first
        let uid: string;
        try {
          uid = await createAuthUser(formData.email, formData.password);
        } catch (error: any) {
          toast.error(error.message || "Failed to create user authentication");
          return;
        }

        // Then save to Firestore with the UID
        const id = await saveAdminToFirestore(adminData, uid);
        dispatch(addAdmin({ id, ...adminData, uid }));
        
        // Save area and area-specific options
        if (formData.role === "Waterboard") {
          if (!areas.includes(formData.area)) {
            await saveArea(formData.area, id);
          }
          // Save to areaOptions collection
          if (formData.options.length > 0) {
            await saveAreaOptions(formData.area, formData.options);
          }
        }

        // Save area if it's new and user is Waterboard
        if (formData.role === "Waterboard" && !areas.includes(formData.area)) {
          await saveArea(formData.area, id);
        }
        
        await saveAuditLogToFirestore({
          userId: currentUser?.uid || "unknown",
          userName: currentUser?.email || "Unknown Admin",
          action: `Added new user: ${formData.username}`,
          details: { adminId: id },
        });
        
        toast.success("User added successfully");
      }

      resetForm();
      setOpen(false);
      await loadWaterboardData();
    } catch (error: any) {
      toast.error(error.message || (editingAdmin ? "Failed to update user" : "Failed to add user"));
    }finally {
      setIsSubmitting(false); // ADD THIS LINE
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const admin = adminList.find(a => a.id === id);
      
      // Delete the admin
      await deleteAdminFromFirestore(id);
      
      // If it's a Waterboard user, delete their associated area
      if (admin?.role === "Waterboard" && admin.area) {
        await deleteAreaByUserId(id);
      }
      
      dispatch(deleteAdmin(id));
      
      await saveAuditLogToFirestore({
        userId: currentUser?.uid || "unknown",
        userName: currentUser?.email || "Unknown Admin",
        action: `Deleted user: ${admin?.username}`,
        details: { adminId: id },
      });
      
      toast.success("User deleted successfully");
      await loadWaterboardData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const toggleStatus = async (admin: Admin) => {
    const newStatus = admin.status === "Active" ? "Disabled" : "Active";
    try {
      await updateAdminInFirestore(admin.id, { status: newStatus });
      dispatch(updateAdmin({ id: admin.id, updates: { status: newStatus } }));
      
      await saveAuditLogToFirestore({
        userId: currentUser?.uid || "unknown",
        userName: currentUser?.email || "Unknown Admin",
        action: `${newStatus === "Active" ? "Enabled" : "Disabled"} user: ${admin.username}`,
        details: { adminId: admin.id, newStatus },
      });
      
      toast.success(`User ${newStatus === "Active" ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "Admin",
      area: "",
      tenderNumber: "",
      options: [],
    });
    setEditingAdmin(null);
    setShowPassword(false); 
    setIsSubmitting(false);
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={(newOpen) => {
            if (!isSubmitting) {  
              setOpen(newOpen);
              if (!newOpen) {
                resetForm();
              }
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAdmin ? "Edit User" : "Add New User"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingAdmin}
                      placeholder={editingAdmin ? "Leave empty to keep current password" : ""}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">User Type</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as "Admin" | "Waterboard" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Waterboard">Waterboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.role === "Waterboard" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area *</Label>
                      <Input
                        id="area"
                        value={formData.area}
                        onChange={(e) => handleAreaChange(e.target.value)}
                        placeholder="Enter unique area name"
                        required
                      />
                      {areas.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Existing areas: {areas.join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenderNumber">Tender Number</Label>
                      <Input
                        id="tenderNumber"
                        value={formData.tenderNumber}
                        onChange={(e) => setFormData({ ...formData, tenderNumber: e.target.value })}
                        placeholder="Enter tender number"
                      />
                    </div>

                    <WaterboardOptionsManager
                      selectedOptions={formData.options}
                      availableOptions={waterboardOptions}
                      onOptionsChange={(options) => setFormData({ ...formData, options })}
                      onAddNewOption={handleAddNewOption}
                    />
                  </>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : (editingAdmin ? "Update" : "Add")} User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminList.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge variant={admin.role === "Admin" ? "default" : "secondary"}>
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {admin.role === "Admin" ? (
                    <Badge variant="outline">Full Access</Badge>
                  ) : (
                    <div className="space-y-1">
                      <div>Area: <span className="font-medium">{admin.area || "-"}</span></div>
                      {admin.tenderNumber && (
                        <div className="text-xs">Tender: {admin.tenderNumber}</div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Options: {admin.options?.length ? admin.options.join(", ") : "None"}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={admin.status === "Active" ? "default" : "destructive"}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(admin)}
                  >
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell>{admin.lastLogin || "Never"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingAdmin(admin);
                        setFormData({
                          username: admin.username,
                          email: admin.email,
                          password: "",
                          role: admin.role,
                          area: admin.area || "",
                          tenderNumber: admin.tenderNumber || "",
                          options: admin.options || [],
                        });
                        setShowPassword(false); // Reset password visibility when editing
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(admin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}