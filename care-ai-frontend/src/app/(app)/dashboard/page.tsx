"use client";

import Dashboard from "@/components/pages/Dashboard";
import DoctorOverview from "@/components/pages/doctor/DoctorOverview";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="py-32 flex justify-center"><Loader2 className="h-10 w-10 text-slate-300 animate-spin" /></div>;

  if (user?.role === "DOCTOR") {
    return <DoctorOverview />;
  }

  return <Dashboard />;
}
