import { useState } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { GlobalSearch } from "@/components/GlobalSearch"
import Dashboard from "@/pages/Dashboard"
import Leads from "@/pages/Leads"
import LeadDetail from "@/pages/LeadDetail"
import Customers from "@/pages/Customers"

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

  function handleSearchNav(result) {
    if (result.type === "lead") {
      setSelectedLead({ id: result.id, name: result.name, phone: result.phone, pest: "Unknown", address: "—", email: "—", status: "New" })
      setActivePage("Leads")
    } else {
      setActivePage("Customers")
    }
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
      default: return <PlaceholderPage name={activePage} />
    }
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar activePage={activePage} setActivePage={p => { setActivePage(p); setSelectedLead(null) }} />
      <SidebarInset>
        <div className="flex items-center h-12 px-4 border-b bg-background gap-3 sticky top-0 z-10">
          <SidebarTrigger className="flex-shrink-0" />
          <div className="h-4 w-px bg-border flex-shrink-0" />
          <div className="flex-1 flex justify-center">
            <GlobalSearch onNavigate={handleSearchNav} />
          </div>
          <span className="text-sm text-muted-foreground flex-shrink-0">
            {activePage}{selectedLead ? ` · ${selectedLead.name}` : ""}
          </span>
        </div>
        <div className="flex-1 overflow-auto bg-muted/30 min-h-[calc(100vh-3rem)]">
          {renderPage()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
