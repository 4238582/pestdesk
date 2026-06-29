import { useState } from "react"
import { AppSidebar, SIDEBAR_COLLAPSED_W } from "@/components/AppSidebar"
import { GlobalSearch } from "@/components/GlobalSearch"
import { QuickCreatePanel } from "@/components/QuickCreatePanel"
import { Plus } from "lucide-react"
import Dashboard from "@/pages/Dashboard"
import Leads from "@/pages/Leads"
import LeadDetail from "@/pages/LeadDetail"
import Customers from "@/pages/Customers"
import Settings from "@/pages/Settings"

function PlaceholderPage({ name }) {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-6">
      {name} page — coming soon
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [selectedLead, setSelectedLead] = useState(null)
  const [quickCreate, setQuickCreate] = useState(false)

  useState(() => {
    const saved = localStorage.getItem("pd-theme") || "dark"
    if (saved === "dark") document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  })

  function handleSearchNav(result) {
    if (result.type === "lead") {
      setSelectedLead({ id: result.id, name: result.name, phone: result.phone, pest: "Unknown", address: "—", email: "—", status: "New" })
      setActivePage("Leads")
    } else {
      setActivePage("Customers")
    }
  }

  function handleQuickSave(lead) {
    setSelectedLead(lead)
    setActivePage("Leads")
  }

  const renderPage = () => {
    if (selectedLead && activePage === "Leads") {
      return (
        <LeadDetail
          lead={selectedLead}
          onBack={() => setSelectedLead(null)}
          onUpdate={updated => setSelectedLead(updated)}
        />
      )
    }
    switch (activePage) {
      case "Dashboard": return <Dashboard />
      case "Leads": return <Leads onSelectLead={lead => setSelectedLead(lead)} />
      case "Customers": return <Customers />
      case "Settings": return <Settings />
      default: return <PlaceholderPage name={activePage} />
    }
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <AppSidebar
        activePage={activePage}
        setActivePage={p => { setActivePage(p); setSelectedLead(null) }}
      />
      <div
        className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-200"
        style={{ marginLeft: `${SIDEBAR_COLLAPSED_W}px` }}
      >
        {/* Topbar */}
        <div className="flex items-center h-12 px-4 border-b bg-background gap-2 flex-shrink-0">
          <GlobalSearch onNavigate={handleSearchNav} />

          {/* + New lead right next to search like Activix "+ CLIENT" */}
          <button
            onClick={() => setQuickCreate(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-border-strong px-3 h-8 rounded-lg transition-colors flex-shrink-0"
          >
            <Plus className="size-3.5" />
            New lead
          </button>

          <span className="ml-auto text-sm text-muted-foreground flex-shrink-0">
            {activePage}{selectedLead ? ` · ${selectedLead.name}` : ""}
          </span>
        </div>

        <div className="flex-1 overflow-auto bg-muted/30">
          {renderPage()}
        </div>
      </div>

      {/* Quick create panel */}
      <QuickCreatePanel
        open={quickCreate}
        onClose={() => setQuickCreate(false)}
        onSave={handleQuickSave}
      />
    </div>
  )
}

export default App
