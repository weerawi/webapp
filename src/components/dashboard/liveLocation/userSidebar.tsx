// // components/dashboard/liveLocation/UserSidebar.tsx
// "use client";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/lib/store/store";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { setSelectedUserId } from "@/lib/store/slices/userLocationsSlice";

// export default function UserSidebar() {
//   const users = useSelector((state: RootState) => state.userLocations.users);
//   const selectedUserId = useSelector((state: RootState) => state.userLocations.selectedUserId);
//   const dispatch = useDispatch();

//   return (
//     <div className="space-y-2">
//       <h3 className="text-lg font-semibold">Users</h3>
//       {users.map((user) => (
//         <Card
//           key={user.id}
//           className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-muted ${
//             selectedUserId === Number(user.id) ? "border border-blue-500" : ""
//           }`}
//           onClick={() => dispatch(setSelectedUserId(Number(user.id)))}
//         >
//           <Avatar>
//             <AvatarImage src={user.avatar} />
//             <AvatarFallback>{user.name[0]}</AvatarFallback>
//           </Avatar>
//           <div className="text-sm font-medium">{user.name}</div>
//         </Card>
//       ))}
//     </div>
//   );
// }


"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  setSelectedUserId,
  setSearchTerm,
} from "@/lib/store/slices/userLocationsSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function UserSidebar() {
  const dispatch = useDispatch();
  const { users, selectedUserId } = useSelector(
    (state: RootState) => state.userLocations
  );
  const searchTerm = useSelector((state: RootState) => state.userLocations.searchTerm);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const areas = useSelector((state: RootState) => state.area.areas);

  console.log("jskjfbsdkls ....." ,areas)

  // userSidebar.tsx
const filteredUsers = users.filter((user) => {
  if (!user || !user.name || typeof user.name !== 'string') {
    return false;
  }
  
  // Area filtering
  if (currentUser?.role === "Admin") {
    // Admin can filter by selected area
    if (selectedArea !== "all" && user.area !== selectedArea) {
      return false;
    }
  } else {
    // Non-admin sees only their area
    if (currentUser?.area && user.area !== currentUser.area) {
      return false;
    }
  }
  
  // Search term filtering
  if (!searchTerm || typeof searchTerm !== 'string') {
    return true;
  }
  return user.name.toLowerCase().includes(searchTerm.toLowerCase());
});

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Users</h3>

    {currentUser?.role === "Admin" ? (
      <Select value={selectedArea} onValueChange={setSelectedArea}>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="All Areas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Areas</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area.id} value={area.name}>
              {area.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      // Show disabled dropdown for non-admin users
      <Select value={currentUser?.area || "all"} disabled>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder={currentUser?.area || "Your Area"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={currentUser?.area || "all"}>
            {currentUser?.area || "Your Area"}
          </SelectItem>
        </SelectContent>
      </Select>
    )}

      <Input
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />

      <ScrollArea className="h-[400px] pr-2">
        <div className="space-y-2 mt-2">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className={`w-40 flex flex-row items-center gap-2 p-1.5 cursor-pointer hover:bg-muted ${
                selectedUserId === user.id ? "border border-blue-500" : ""
              }`}
              onClick={() => dispatch(setSelectedUserId(user.id))}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-xs font-medium">{user.name}</div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
