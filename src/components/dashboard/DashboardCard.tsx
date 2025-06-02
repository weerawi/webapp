"use client";

import { ReactNode, useState } from "react";
import { useDispatch } from "react-redux";
import { showLoader} from "@/lib/store/slices/loaderSlice";
import { useRouter } from "next/navigation";
interface DashboardCardProps {
  title: string;
  href: string;
  children?: ReactNode;
}

export default function DashboardCard({ title, href, children }: DashboardCardProps) {

  const router = useRouter();
  const dispatch = useDispatch();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    if(isNavigating) return;
    setIsNavigating(true);
    dispatch(showLoader(`Loading ${title}..`));
    router.push(href)
  }

  return ( 
      <div onClick={handleClick} className="bg-gray-800 rounded-lg shadow-lg p-6 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105">
        <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
        {children}
      </div> 
  );
}
