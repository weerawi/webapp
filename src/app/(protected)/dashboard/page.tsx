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
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { LogOut, Settings, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { logout } from "@/lib/store/slices/authSlice";
import { showLoader, hideLoader } from "@/lib/store/slices/loaderSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import hegraLogo from "@/assets/hegra.jpg";
import { motion } from "framer-motion";
import { resetApp } from "@/lib/store/actions/resetActions";

// Animated Water Drop Component
const WaterDrop = ({ 
  delay = 0, 
  duration = 20, 
  color = "#3B82F6",
  size = 120,
  position 
}: any) => (
  <motion.div
    className="absolute opacity-10 pointer-events-none"
    style={{
      left: position.x,
      top: position.y,
    }}
    initial={{ y: 0, opacity: 0 }}
    animate={{ 
      y: [-10, -20, -10],
      opacity: [0.05, 0.15, 0.05],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`gradient-${delay}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M50 10 C50 10, 20 40, 20 70 C20 85, 35 100, 50 100 C65 100, 80 85, 80 70 C80 40, 50 10, 50 10Z"
        fill={`url(#gradient-${delay})`}
      />
    </svg>
  </motion.div>
);

// Navigation Card Component
const NavigationCard = ({ title, href, gradient, icon, index }: any) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        dispatch(showLoader(`Loading ${title}...`));
        router.push(href);
      }}
      className="relative group cursor-pointer h-full"
    >
      <div 
        className="h-full min-h-[120px] lg:min-h-[140px] rounded-xl p-4 lg:p-5 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        style={{ background: gradient }}
      >
        <div className="relative z-10">
          <div className="text-white/80 text-xs font-medium mb-1">0{index + 1}</div>
          <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>
        
        <div className="flex justify-end">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
            <ArrowRight className="text-white w-5 h-5" />
          </div>
        </div>
        
        {/* Subtle water drop decoration */}
        <motion.div
          className="absolute -bottom-8 -right-8 opacity-10"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            width="100"
            height="130"
            viewBox="0 0 100 130"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10 C50 10, 20 40, 20 70 C20 85, 35 100, 50 100 C65 100, 80 85, 80 70 C80 40, 50 10, 50 10Z"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function DashboardHome() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(hideLoader());
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(showLoader("Logging out..."));
    try {
      await signOut(auth);
      dispatch(logout());
      dispatch(resetApp());
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(hideLoader());
    }
  };

  const navigationItems = [
    {
      title: "Staff",
      href: "/dashboard/staff",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Report",
      href: "/dashboard/report",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Reconnection",
      href: "/dashboard/reconnection-management",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Live Location",
      href: "/dashboard/live-location",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    }
  ];

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen">
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
              variant="ghost"
              size="sm"
              onClick={() => {
                dispatch(showLoader("Loading settings..."));
                router.push("/dashboard/settings");
              }}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center relative z-40 px-6 py-4 min-h-[calc(100vh-120px)]">
        <div className="max-w-7xl w-full mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 lg:mb-10"
          >
            <p className="text-sm font-medium text-blue-600 mb-2">
              Streamlining Water Services Management
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-3">
              Water Board Operations Hub
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Access all management tools from a single, unified dashboard
            </p>
          </motion.div>

          {/* Navigation Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-2xl lg:max-w-6xl mx-auto">
            {navigationItems.map((item, index) => (
              <NavigationCard
                key={item.href}
                {...item}
                index={index}
              />
            ))}
          </div>

          
        </div>
      </main>
    </div>
  );
}