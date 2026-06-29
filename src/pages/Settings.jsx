import { useState, useEffect } from "react"
import { Moon, Sun, Monitor, Bug, Bell, Users, Shield, Palette } from "lucide-react"

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark",  label: "Dark",  icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem("pd-theme") || "dark")
  const [activeSection, setActiveSection] = useState("appearance")

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
    } else {
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches
      sys ? root.classList.add("dark") : root.classList.remove("dark")
    }
    localStorage.setItem("pd-theme", theme)
  }, [theme])

  const sections = [
    { id: "appearance", label: "Appearance",    icon: Palette },
    { id: "account",    label: "Account",       icon: Users },
    { id: "company",    label: "Company",       icon: Bug },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security",   label: "Security",      icon: Shield },
  ]

  return (
    <div className="flex h-full">
      {/* Left nav */}
      <div className="w-52 border-r flex-shrink-0 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Settings</p>
        <div className="flex flex-col gap-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors
                ${activeSection === s.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"}`}>
              <s.icon className="size-4 flex-shrink-0" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 max-w-2xl">
        {activeSection === "appearance" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Appearance</h2>
            <p className="text-sm text-muted-foreground mb-6">Customize how PestDesk looks on your device.</p>

            <div className="rounded-xl border p-5 mb-4">
              <p className="text-sm font-medium mb-1">Theme</p>
              <p className="text-xs text-muted-foreground mb-4">Select your preferred color theme.</p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map(t => (
                  <button key={t.value} onClick={() => setTheme(t.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors
                      ${theme === t.value ? "border-blue-500 bg-blue-500/10" : "border-border hover:border-border-strong"}`}>
                    <t.icon className={`size-6 ${theme === t.value ? "text-blue-500" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${theme === t.value ? "text-blue-500" : "text-muted-foreground"}`}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm font-medium mb-1">Sidebar</p>
              <p className="text-xs text-muted-foreground mb-4">The sidebar auto-collapses when not in use.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Hover to expand</span>
                <div className="size-4 rounded-full bg-green-500" title="Active" />
              </div>
            </div>
          </div>
        )}

        {activeSection === "account" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Account</h2>
            <p className="text-sm text-muted-foreground mb-6">Manage your personal information.</p>
            <div className="rounded-xl border p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">JP</div>
                <div>
                  <p className="font-medium">Jean-Philippe Laurin Bedard</p>
                  <p className="text-sm text-muted-foreground">Owner · Hull Pest Control</p>
                </div>
              </div>
              <div className="border-t pt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground mb-1">Email</p><p>jeepeb1992@gmail.com</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">Role</p><p>Owner / Admin</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">Location</p><p>Gatineau, QC</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">Language</p><p>English / Français</p></div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "company" && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Company</h2>
            <p className="text-sm text-muted-foreground mb-6">Your pest control business info.</p>
            <div className="rounded-xl border p-5 grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground mb-1">Company name</p><p>Hull Pest Control</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Phone</p><p>819-555-0000</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Service area</p><p>Gatineau / Ottawa</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Plan</p><p className="text-blue-500 font-medium">PestDesk Pro</p></div>
            </div>
          </div>
        )}

        {(activeSection === "notifications" || activeSection === "security") && (
          <div>
            <h2 className="text-lg font-semibold mb-1">{sections.find(s => s.id === activeSection)?.label}</h2>
            <p className="text-sm text-muted-foreground">Coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
