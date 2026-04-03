import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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
import { LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}
function SidebarNav({ navItems, role }: { navItems: NavItem[]; role: string }) {
  const { state, setOpenMobile, isMobile  } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-card/50"
    >
      {/* Brand Logo Section */}
      <div className="p-4 mb-2 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm shadow-primary/10">
          <img
            src="../image.png"
            alt="Logo"
            className="h-6 w-6 object-contain"
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-in fade-in slide-in-from-left-2">
            <p className="text-sm font-black tracking-tight text-foreground truncate">
              SAMS PORTAL
            </p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-80">
              {role}
            </p>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="h-10 p-0"
                    variant="none"
                    onClick={handleItemClick}
                  >
                    <NavLink to={item.url} end>
                      {({ isActive }: { isActive: boolean }) => (
                        <div
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 group",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                            )}
                          />
                          {!collapsed && (
                            <span className="text-sm font-semibold tracking-tight">
                              {item.title}
                            </span>
                          )}
                          {isActive && !collapsed && (
                            <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Footer */}
      <div className="p-4 mt-auto border-t border-border/10">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 w-full px-3 py-2 text-sm font-bold text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </Sidebar>
  );
}

const DashboardLayout = ({
  children,
  title,
  subtitle,
  navItems,
  role,
}: any) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f8fafc]">
        <SidebarNav navItems={navItems} role={role} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Modern Header */}
          <header className="h-16 flex items-center justify-between border-b border-border/40 bg-white px-5 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border/50 md:hidden">
                <SidebarTrigger />
              </div>

              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="text-lg font-black tracking-tight text-foreground leading-none">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-sm transition-all hover:bg-primary/15 group">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </div>

                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {role}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8 bg-dot-pattern">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
