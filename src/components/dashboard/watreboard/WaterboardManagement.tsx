"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/lib/services/adminService";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { WaterboardOptionsManager } from "@/components/dashboard/settings/WaterboardOptionManager";

export default function WaterboardManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { adminList } = useSelector((state: RootState) => state.admin);
  const [open, setOpen] = useState(false);
  const [editingWaterboard, setEditingWaterboard] = useState<Admin | null>(null);
  const [waterboardOptions, setWaterboardOptions] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    area: "",
    tenderNumber: "",
    options: [] as string[],
  });

  useEffect(() => {
    loadWaterboardUsers();
    loadWaterboardData();
  }, []);

  const loadWaterboardUsers = async () => {
    try {
      await fetchAdminsFromFirestore(dispatch);
    } catch (error) {
      toast.error("Failed to load waterboard users");
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
    const exists = areas.some(a => a.toLowerCase() === area.toLowerCase());
    if (exists && (!editingWaterboard || editingWaterboard.area !== area)) {
      toast.error("This area is already assigned to another user");
      return;
    }
    setFormData({ ...formData, area });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.area.trim()) {
        toast.error("Area is required for Waterboard users");
        return;
      }

      const waterboardData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "Waterboard" as const,
        status: "Active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        area: formData.area,
        tenderNumber: formData.tenderNumber,
        options: formData.options,
      };

      if (editingWaterboard) {
        const updateData = { ...waterboardData };
        if (!formData.password) {
          delete updateData.password;
        }
        
        await updateAdminInFirestore(editingWaterboard.id, updateData);
        dispatch(updateAdmin({ id: editingWaterboard.id, updates: updateData }));
        
        await saveAuditLogToFirestore({
          userId: currentUser?.uid || "unknown",
          userName: currentUser?.email || "Unknown Admin",
          action: `Updated waterboard user: ${formData.username}`,
          details: { adminId: editingWaterboard.id },
        });
        
        toast.success("Waterboard user updated successfully");
      } else {
        let uid: string;
        try {
          uid = await createAuthUser(formData.email, formData.password);
        } catch (error: any) {
          toast.error(error.message || "Failed to create user authentication");
          return;
        }

        const id = await saveAdminToFirestore(waterboardData, uid);
        dispatch(addAdmin({ id, ...waterboardData, uid }));
        
        if (!areas.includes(formData.area)) {
          await saveArea(formData.area, id);
        }
        
        await saveAuditLogToFirestore({
          userId: currentUser?.uid || "unknown",
          userName: currentUser?.email || "Unknown Admin",
          action: `Added new waterboard user: ${formData.username}`,
          details: { adminId: id },
        });
        
        toast.success("Waterboard user added successfully");
      }

      resetForm();
      setOpen(false);
      await loadWaterboardData();
    } catch (error: any) {
      toast.error(error.message || (editingWaterboard ? "Failed to update user" : "Failed to add user"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this waterboard user?")) return;
    
    try {
      const waterboard = adminList.find(a => a.id === id);
      
      await deleteAdminFromFirestore(id);
      
      if (waterboard?.area) {
        await deleteAreaByUserId(id);
      }
      
      dispatch(deleteAdmin(id));
      
      await saveAuditLogToFirestore({
        userId: currentUser?.uid || "unknown",
        userName: currentUser?.email || "Unknown Admin",
        action: `Deleted waterboard user: ${waterboard?.username}`,
        details: { adminId: id },
      });
      
      toast.success("Waterboard user deleted successfully");
      await loadWaterboardData();
    } catch (error) {
      toast.error("Failed to delete waterboard user");
    }
  };

  const toggleStatus = async (waterboard: Admin) => {
    const newStatus = waterboard.status === "Active" ? "Disabled" : "Active";
    try {
      await updateAdminInFirestore(waterboard.id, { status: newStatus });
      dispatch(updateAdmin({ id: waterboard.id, updates: { status: newStatus } }));
      
      await saveAuditLogToFirestore({
        userId: currentUser?.uid || "unknown",
        userName: currentUser?.email || "Unknown Admin",
        action: `${newStatus === "Active" ? "Enabled" : "Disabled"} waterboard user: ${waterboard.username}`,
        details: { adminId: waterboard.id, newStatus },
      });
      
      toast.success(`Waterboard user ${newStatus === "Active" ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      area: "",
      tenderNumber: "",
      options: [],
    });
    setEditingWaterboard(null);
    setShowPassword(false);
  };

  const waterboardUsers = adminList.filter(admin => admin.role === "Waterboard");

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Waterboard User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingWaterboard ? "Edit Waterboard User" : "Add New Waterboard User"}
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
                      required={!editingWaterboard}
                      placeholder={editingWaterboard ? "Leave empty to keep current password" : ""}
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
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingWaterboard ? "Update" : "Add"} Waterboard User
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
              <TableHead>Area</TableHead>
              <TableHead>Tender Number</TableHead>
              <TableHead>Options</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waterboardUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No waterboard users found
                </TableCell>
              </TableRow>
            ) : (
              waterboardUsers.map((waterboard) => (
                <TableRow key={waterboard.id}>
                  <TableCell>{waterboard.username}</TableCell>
                  <TableCell>{waterboard.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{waterboard.area || "-"}</Badge>
                  </TableCell>
                  <TableCell>{waterboard.tenderNumber || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {waterboard.options?.length ? (
                        waterboard.options.map((opt) => (
                          <Badge key={opt} variant="secondary" className="text-xs">
                            {opt}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={waterboard.status === "Active" ? "default" : "destructive"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(waterboard)}
                    >
                      {waterboard.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingWaterboard(waterboard);
                          setFormData({
                            username: waterboard.username,
                            email: waterboard.email,
                            password: "",
                            area: waterboard.area || "",
                            tenderNumber: waterboard.tenderNumber || "",
                            options: waterboard.options || [],
                          });
                          setShowPassword(false);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(waterboard.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}