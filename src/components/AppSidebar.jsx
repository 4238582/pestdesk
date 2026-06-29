import { useSidebar } from "@/components/ui/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  BarChart2,
  MapPin,
  Settings,
  Bug,
  LogOut,
  TrendingUp,
} from "lucide-react"

const navMain = [
  { label: "Dashboard",     icon: LayoutDashboard, href: "#dashboard" },
  { label: "Leads",         icon: TrendingUp,      href: "#leads" },
  { label: "Customers",     icon: Users,            href: "#customers" },
  { label: "Schedule",      icon: Calendar,         href: "#schedule" },
  { label: "Jobs",          icon: ClipboardList,    href: "#jobs" },
]

const navManage = [
  { label: "Invoices",      icon: FileText,   href: "#invoices" },
  { label: "Service areas", icon: MapPin,     href: "#areas" },
  { label: "Reports",       icon: BarChart2,  href: "#reports" },
  { label: "Settings",      icon: Settings,   href: "#settings" },
]

export function AppSidebar({ activePage, setActivePage }) {
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Bug className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm">PestDesk</span>
                <span className="text-xs text-muted-foreground">v1.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  isActive={activePage === item.label}
                  onClick={() => setActivePage(item.label)}
                  tooltip={item.label}
                  className="[&>svg]:size-5"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {navManage.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  isActive={activePage === item.label}
                  onClick={() => setActivePage(item.label)}
                  tooltip={item.label}
                  className="[&>svg]:size-5"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Account">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                  JP
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none text-left">
                <span className="text-sm font-medium">Jean-Philippe</span>
                <span className="text-xs text-muted-foreground">Owner</span>
              </div>
              <LogOut className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}
