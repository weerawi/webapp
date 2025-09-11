// import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/store/store";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "./custom-marker.css";
// import { useEffect } from "react";

// const createAvatarIcon = (user: { avatar: string; name: string }) =>
//   L.divIcon({
//     className: "custom-avatar-icon",
//     html: `<div class="avatar-pin"><img src="${user.avatar}" /></div>`,
//     iconSize: [45, 55],
//     iconAnchor: [22, 55],
//   });

// function FlyToUser({ userId }: { userId: string | null }) {
//   const map = useMap();
//   const users = useSelector((state: RootState) => state.userLocations.users);
//   const user = users.find((u) => u.id === userId);

//   useEffect(() => {
//     if (user) {
//       map.flyTo([user.lat, user.lng], 17, { duration: 1.5 });
//     }
//   }, [user, map]);

//   return null;
// }

// export default function UserMap() {
//   const users = useSelector((state: RootState) => state.userLocations.users);
//   const selectedUserId = useSelector((state: RootState) => state.userLocations.selectedUserId);

//   return (
//     <MapContainer center={[7.2906, 80.6337]} zoom={14} scrollWheelZoom style={{ height: "600px" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <FlyToUser userId={selectedUserId} />
//       {users.map((user) => (
//         <Marker key={user.id} position={[user.lat, user.lng]} icon={createAvatarIcon(user)} />
//       ))}
//     </MapContainer>
//   );
// }



"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./custom-marker.css";
import { useEffect } from "react";

// Avatar marker
const createAvatarIcon = (user: { avatar: string }) =>
  L.divIcon({
    className: "custom-avatar-icon",
    html: `<div class="avatar-pin"><img src="${user.avatar}" /></div>`,
    iconSize: [45, 55],
    iconAnchor: [22, 55],
  });

// Focus view on selected user
// UserMap.tsx
function FlyToUser({ userId }: { userId: string | null }) { // Changed from number to string
    const map = useMap();
    const users = useSelector((state: RootState) => state.userLocations.users);
    const user = users.find((u) => u.id === userId);
  
    useEffect(() => {
      if (user) {
        map.flyTo([user.lat, user.lng], 16, { duration: 1.5 });
      }
    }, [user, map]);
  
    return null;
  }

export default function UserMap() {
  const users = useSelector((state: RootState) => state.userLocations.users);
  const selectedUserId = useSelector(
    (state: RootState) => state.userLocations.selectedUserId
  );

  return (
    <MapContainer
      center={[7.2906, 80.6337]}
      zoom={14}
      scrollWheelZoom
      style={{ height: "calc(100vh - 20px)", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToUser userId={selectedUserId} />
      {users.map((user) => (
        <Marker
          key={user.id}
          position={[user.lat, user.lng]}
          icon={createAvatarIcon(user)}
        />
      ))}
    </MapContainer>
  );
}
