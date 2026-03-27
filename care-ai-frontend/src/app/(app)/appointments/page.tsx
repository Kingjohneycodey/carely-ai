"use client";
import { Suspense } from "react";
import UserAppointments from "@/components/pages/UserAppointments";
import { Loader2 } from "lucide-react";

function AppointmentsLoader() {
  return (
    <div className="flex h-[30vh] w-full items-center justify-center">
      <Loader2 className="h-10 w-10 text-slate-300 animate-spin" />
    </div>
  );
}

export default function UserAppointmentsPage() { 
  return (
    <Suspense fallback={<AppointmentsLoader />}>
      <UserAppointments />
    </Suspense>
  ); 
}
