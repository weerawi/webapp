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

export default function UserSidebar() {
  const dispatch = useDispatch();
  const { users, selectedUserId } = useSelector(
    (state: RootState) => state.userLocations
  );
  const searchTerm = useSelector((state: RootState) => state.userLocations.searchTerm);


  // userSidebar.tsx
const filteredUsers = users.filter((user) => {
    // Add safety checks
    if (!user || !user.name || typeof user.name !== 'string') {
      return false;
    }
    if (!searchTerm || typeof searchTerm !== 'string') {
      return true; // Show all users if no search term
    }
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Users</h3>

      <Input
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
      />

      <ScrollArea className="h-[500px] pr-2">
        <div className="space-y-2 mt-2">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-muted ${
                selectedUserId === user.id ? "border border-blue-500" : ""
              }`}
              onClick={() => dispatch(setSelectedUserId(user.id))}
            >
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{user.name}</div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
