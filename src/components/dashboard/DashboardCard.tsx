"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  href: string;
  children?: ReactNode;
}

export default function DashboardCard({ title, href, children }: DashboardCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105">
        <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
        {children}
      </div>
    </Link>
  );
}
