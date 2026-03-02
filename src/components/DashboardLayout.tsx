import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  role: string;
}

function SidebarNav({ navItems, role }: { navItems: NavItem[]; role: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-accent-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">UniAttend</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{role}</p>
          </div>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="p-3 mt-auto">
        <SidebarMenuButton asChild>
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground w-full px-2 py-1.5 text-sm">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </SidebarMenuButton>
      </div>
    </Sidebar>
  );
}

const DashboardLayout = ({ children, title, subtitle, navItems, role }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav navItems={navItems} role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-4 shrink-0">
            <SidebarTrigger />
            <div>
              <h1 className="text-base font-serif font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
