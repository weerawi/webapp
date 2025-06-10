export const COLORS = {
    // Primary Green Shades
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
  
    // Blue Accent Shades
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
  
    // Neutral Colors
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
  
    // Status Colors
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  } as const
  
  export const GRADIENTS = {
    primary: "bg-gradient-to-r from-green-500 to-blue-600",
    primaryHover: "bg-gradient-to-r from-green-600 to-blue-700",
    background: "bg-gradient-to-br from-green-50 via-blue-50 to-green-100",
    card: "bg-gradient-to-br from-white to-green-50/30",
    insidecard: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",  
  } as const
  