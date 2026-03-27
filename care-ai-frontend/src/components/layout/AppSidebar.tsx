import {
  Home, Stethoscope, Camera, MessageCircle, Wallet, FileText, Upload,
  Users, UserCircle, Phone, MapPin, CreditCard, Settings, AlertTriangle,
  Heart, Activity, Calendar
} from "lucide-react";
import { NavLink } from "./NavLink";
import {

  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuth } from "@/contexts/AuthContext";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Appointments", url: "/appointments", icon: Calendar },
  { title: "Symptom Checker", url: "/symptoms", icon: Stethoscope },
  { title: "Image Diagnosis", url: "/image-diagnosis", icon: Camera },
  { title: "AI Chat", url: "/chat", icon: MessageCircle },
];

const doctorNav = [
  { title: "Doctor Overview", url: "/doctor/dashboard", icon: Home },
  { title: "My Appointments", url: "/doctor/appointments", icon: Calendar },
  { title: "My Profile", url: "/doctor/profile", icon: UserCircle },
];

const healthNav = [
  { title: "Medical Records", url: "/records", icon: FileText },
  { title: "Upload & Scan", url: "/upload", icon: Upload },
  { title: "Vitals", url: "/vitals", icon: Activity },
];

const careNav = [
  { title: "Find Doctors", url: "/doctors", icon: Users },
  { title: "Nearby Hospital", url: "/facilities", icon: MapPin },
  { title: "Emergency", url: "/emergency", icon: AlertTriangle },
];

const accountNav = [
  { title: "Plans & Payments", url: "/plans", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
];

function NavGroup({ label, items }: { label: string; items: any[] }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-2">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  href={item.url}
                  end
                  className="hover:bg-accent/50 rounded-lg transition-colors px-3 h-10 w-full"
                  activeClassName="bg-accent text-accent-foreground font-bold border-l-2 border-primary"
                >
                  <item.icon className="mr-3 h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { user } = useAuth();
  const isDoctor = user?.role === "DOCTOR";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-white">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-slate-900 group-data-[collapsible=icon]:hidden">
          Care AI
        </span>
      </div>
      <SidebarContent className="px-3 gap-6">
        {isDoctor ? (
          <>
            <NavGroup label="Doctor Dashboard" items={doctorNav} />
            <NavGroup label="Practice Management" items={[
              { title: "Medical Records", url: "/records", icon: FileText },
              { title: "Settings", url: "/settings", icon: Settings },
            ]} />
          </>
        ) : (
          <>
            <NavGroup label="Discover" items={mainNav} />
            <NavGroup label="Health Wallet" items={healthNav} />
            <NavGroup label="Medical Care" items={careNav} />
            <NavGroup label="Financial" items={accountNav} />
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
