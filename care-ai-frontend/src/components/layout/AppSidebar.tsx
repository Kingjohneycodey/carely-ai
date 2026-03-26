import {
  Home, Stethoscope, Camera, MessageCircle, Wallet, FileText, Upload,
  Users, UserCircle, Phone, MapPin, CreditCard, Settings, AlertTriangle,
  Heart, Activity
} from "lucide-react";
import { NavLink } from "./NavLink";
import {

  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Symptom Checker", url: "/symptoms", icon: Stethoscope },
  { title: "Image Diagnosis", url: "/image-diagnosis", icon: Camera },
  { title: "AI Chat", url: "/chat", icon: MessageCircle },
];

const healthNav = [
  { title: "Health Wallet", url: "/wallet", icon: Wallet },
  { title: "Medical Records", url: "/records", icon: FileText },
  { title: "Upload & Scan", url: "/upload", icon: Upload },
  { title: "Vitals", url: "/vitals", icon: Activity },
];

const careNav = [
  { title: "Find Doctors", url: "/doctors", icon: Users },
  { title: "Nearby Facilities", url: "/facilities", icon: MapPin },
  { title: "Emergency", url: "/emergency", icon: AlertTriangle },
];

const accountNav = [
  { title: "Plans & Payments", url: "/plans", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
];

function NavGroup({ label, items }: { label: string; items: typeof mainNav }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
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
                  className="hover:bg-accent/50 rounded-lg transition-colors"
                  activeClassName="bg-accent text-accent-foreground font-medium"
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
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
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Heart className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-lg group-data-[collapsible=icon]:hidden">
          Care AI
        </span>
      </div>
      <SidebarContent className="px-2">
        <NavGroup label="Main" items={mainNav} />
        <NavGroup label="Health" items={healthNav} />
        <NavGroup label="Care" items={careNav} />
        <NavGroup label="Account" items={accountNav} />
      </SidebarContent>
    </Sidebar>
  );
}
