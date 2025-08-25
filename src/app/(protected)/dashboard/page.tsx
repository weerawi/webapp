// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { signOut } from "firebase/auth";
// import { auth } from "@/lib/firebase/config";
// import { LogOut } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import DashboardCard from "@/components/dashboard/DashboardCard";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/lib/store/store";
// import { logout } from "@/lib/store/slices/authSlice";
// import { showLoader, hideLoader } from "@/lib/store/slices/loaderSlice";
// import { useRouter } from "next/navigation";
// import { GRADIENTS } from "@/lib/constant/colors";

// export default function DashboardHome() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const isAuthenticated = !!user;
//   const router = useRouter();

//   useEffect(() => {
//     dispatch(hideLoader());
//   }, [dispatch]);

//   // 🔍 Log store state changes
//   useEffect(() => {
//     console.log("🔄 Auth state changed:", {
//       user: user ? { uid: user.uid, email: user.email } : null,
//       isAuthenticated,
//       timestamp: new Date().toISOString(),
//     });
//   }, [user, isAuthenticated]);

//   const handleLogout = async () => {
//     dispatch(showLoader("Logging out..."));
//     try {
//       await signOut(auth);
//       dispatch(logout());
//       console.log("🔐 Logout successful");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       dispatch(hideLoader());
//     }
//   };

//   // vantajs wave adding start
//   const vantaRef = useRef<HTMLDivElement>(null);
//   const [vantaEffect, setVantaEffect] = useState<any>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const loadScript = (src: string): Promise<void> => {
//         return new Promise((resolve, reject) => {
//           if (document.querySelector(`script[src="${src}"]`)) {
//             resolve();
//             return;
//           }

//           const script = document.createElement("script");
//           script.src = src;
//           script.onload = () => resolve();
//           script.onerror = reject;
//           document.head.appendChild(script);
//         });
//       };

//       const initVanta = async () => {
//         try {
//           // Load THREE.js from CDN first
//           await loadScript(
//             "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
//           );

//           // Wait a bit for THREE to be available
//           await new Promise((resolve) => setTimeout(resolve, 100));

//           if (!window.THREE) {
//             console.error("THREE.js failed to load");
//             return;
//           }

//           // Now load Vanta WAVES instead of birds
//           const vantaModule = await import("vanta/dist/vanta.waves.min");
//           const VANTA = vantaModule.default;

//           if (vantaRef.current && !vantaEffect) {
//             const effect = VANTA({
//               el: vantaRef.current,
//               mouseControls: true,
//               touchControls: true,
//               gyroControls: false,
//               minHeight: 200.0,
//               minWidth: 200.0,
//               // Wave-specific options
//               color: 0x6188,
//               shininess: 30,
//               waveHeight: 20,
//               waveSpeed: 1,
//               zoom: 0.75,
//             });
//             setVantaEffect(effect);
//           }
//         } catch (error) {
//           console.error("Error loading Vanta effect:", error);
//         }
//       };

//       initVanta();
//     }

//     return () => {
//       if (vantaEffect) {
//         vantaEffect.destroy();
//       }
//     };
//   }, [vantaEffect]);

//   return (
//     <div className="relative min-h-screen">
//       <div ref={vantaRef} className="fixed inset-0 -z-10" />

//       <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
//         <h1 className="text-4xl font-bold mb-6 text-white">Welcome</h1>
//         {/* <div className="grid grid-cols-2 gap-4 w-[600px]"> 
//           <DashboardCard href="/dashboard/staff" title="Staff" />
//           <DashboardCard href="/dashboard/report" title="Report" />
//           <DashboardCard href="/dashboard/reconnection-management" title="Reconnection Management" />
//           <DashboardCard href="/dashboard/live-location" title="Live Location" /> 
//         </div>  */}

//         {/* <div className="grid grid-cols-2 gap-8 w-[700px]">
//           <DashboardCard
//             href="/dashboard/staff"
//             title="Staff"
//             // gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
//             gradient={`${GRADIENTS.insidecard}`}
//           />
//           <DashboardCard
//             href="/dashboard/report"
//             title="Report"
//             // gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
//             gradient={`${GRADIENTS.insidecard}`}
//           />
//           <DashboardCard
//             href="/dashboard/reconnection-management"
//             title="Reconnection"
//             // gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
//             gradient={`${GRADIENTS.insidecard}`}
//           />
//           <DashboardCard
//             href="/dashboard/live-location"
//             title="Live Location"
//             // gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
//             gradient={`${GRADIENTS.insidecard}`}
//           />
//         </div> */}

//         <div className="grid grid-cols-2 gap-8 w-[700px]">
//           <DashboardCard
//             href="/dashboard/staff"
//             title="Staff"
//             gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//             cardNumber="01"
//           />
//           <DashboardCard
//             href="/dashboard/report"
//             title="Report"
//             gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
//             cardNumber="02"
//           />
//           <DashboardCard
//             href="/dashboard/reconnection-management"
//             title="Reconnection"
//             gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
//             cardNumber="03"
//           />
//           <DashboardCard
//             href="/dashboard/live-location"
//             title="Live Location"
//             gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
//             cardNumber="04"
//           />
//         </div>

//         <div className="absolute flex justify-center items-center gap-4 top-4 right-4 cursor-pointer text-white transition-colors duration-200">
//           <div className="col-span-2">
//             <Button
//               onClick={() => {
//                 dispatch(showLoader(`Loading settings page..`));
//                 router.push("/dashboard/settings");
//               }}
//               className="w-full bg-transparent h-10 text-lg cursor-pointer hover:bg-cyan-200 hover:animate-none transition-all duration-300 hover:scale-105"
//             >
//               Settings
//             </Button>
//           </div>
//           <LogOut
//             onClick={handleLogout}
//             className="h-10 p-2 rounded-xl hover:bg-cyan-200"
//             size={36}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



///////////////////////////////////////////////////   without vantajs    //////////////////////////////////////////////////////////////////











"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { logout } from "@/lib/store/slices/authSlice";
import { showLoader, hideLoader } from "@/lib/store/slices/loaderSlice";
import { useRouter } from "next/navigation";
import { GRADIENTS } from "@/lib/constant/colors";

export default function DashboardHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    dispatch(hideLoader());
  }, [dispatch]);

  // 🔍 Log store state changes
  useEffect(() => {
    console.log("🔄 Auth state changed:", {
      user: user ? { uid: user.uid, email: user.email } : null,
      isAuthenticated,
      timestamp: new Date().toISOString(),
    });
  }, [user, isAuthenticated]);

  useEffect(() => {
    const prev = document.body.style.overflowY;
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = prev;
    };
  }, []);

  const handleLogout = async () => {
    dispatch(showLoader("Logging out..."));
    try {
      await signOut(auth);
      dispatch(logout());
      console.log("🔐 Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(hideLoader());
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10" />

      <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
        <h1 className="text-4xl font-bold mb-6 text-black">Welcome</h1>
     
        <div className="grid grid-cols-2 gap-8 w-[700px]">
          <DashboardCard
            href="/dashboard/staff"
            title="Staff"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            cardNumber="01"
          />
          <DashboardCard
            href="/dashboard/report"
            title="Report"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            cardNumber="02"
          />
          <DashboardCard
            href="/dashboard/reconnection-management"
            title="Reconnection"
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            cardNumber="03"
          />
          <DashboardCard
            href="/dashboard/live-location"
            title="Live Location"
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            cardNumber="04"
          />
        </div>

        <div className="absolute flex justify-center items-center gap-4 top-4 right-4 cursor-pointer text-black transition-colors duration-200">
          <div className="col-span-2">
            <Button
              onClick={() => {
                dispatch(showLoader(`Loading settings page..`));
                router.push("/dashboard/settings");
              }}
              className="w-full text-black bg-transparent h-10 text-lg cursor-pointer hover:bg-cyan-200 hover:animate-none transition-all duration-300 hover:scale-105"
            >
              Settings
            </Button>
          </div>
          <LogOut
            onClick={handleLogout}
            className="h-10 p-2 rounded-xl hover:bg-cyan-200"
            size={36}
          />
        </div>
      </div>
    </div>
  );
}
