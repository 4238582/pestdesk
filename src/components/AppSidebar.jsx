import { useState } from "react"
import {
  LayoutDashboard, TrendingUp, Users, Calendar,
  ClipboardList, FileText, MapPin, BarChart2,
  Settings, Bug, LogOut,
} from "lucide-react"

const navMain = [
  { label: "Dashboard",     icon: LayoutDashboard },
  { label: "Leads",         icon: TrendingUp },
  { label: "Customers",     icon: Users },
  { label: "Schedule",      icon: Calendar },
  { label: "Jobs",          icon: ClipboardList },
]

const navManage = [
  { label: "Invoices",      icon: FileText },
  { label: "Service areas", icon: MapPin },
  { label: "Reports",       icon: BarChart2 },
  { label: "Settings",      icon: Settings },
]

export const SIDEBAR_COLLAPSED_W = 48
export const SIDEBAR_EXPANDED_W = 200

export function AppSidebar({ activePage, setActivePage }) {
  const [expanded, setExpanded] = useState(false)

  const w = expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W

  return (
    <div
      className="fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 overflow-hidden"
      style={{ width: w }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 h-12 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center justify-center size-7 rounded-lg bg-blue-600 text-white flex-shrink-0">
          <Bug className="size-4" />
        </div>
        {expanded && <span className="font-semibold text-sm whitespace-nowrap">PestDesk</span>}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-hidden py-2">
        <NavSection items={navMain} activePage={activePage} setActivePage={setActivePage} expanded={expanded} />
        <div className="mx-3 my-2 border-t border-sidebar-border" />
        <NavSection items={navManage} activePage={activePage} setActivePage={setActivePage} expanded={expanded} />
      </div>

      {/* User */}
      <div className="flex items-center gap-3 px-3 py-3 border-t border-sidebar-border flex-shrink-0">
        <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
          JP
        </div>
        {expanded && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">Jean-Philippe</p>
            <p className="text-xs text-muted-foreground truncate">Owner</p>
          </div>
        )}
        {expanded && <LogOut className="size-4 text-muted-foreground flex-shrink-0" />}
      </div>
    </div>
  )
}

function NavSection({ items, activePage, setActivePage, expanded }) {
  return (
    <div className="flex flex-col gap-0.5 px-2">
      {items.map(item => {
        const active = activePage === item.label
        return (
          <button
            key={item.label}
            onClick={() => setActivePage(item.label)}
            className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors w-full text-left
              ${active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
          >
            <item.icon className="size-5 flex-shrink-0" />
            {expanded && <span className="whitespace-nowrap">{item.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
