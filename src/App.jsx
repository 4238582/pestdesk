import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import Dashboard from "@/pages/Dashboard"

function PlaceholderPage({ name }) {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-6">
      {name} page — coming soon
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard")

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard": return <Dashboard />
      default: return <PlaceholderPage name={activePage} />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex flex-col flex-1 min-h-screen">
        <div className="flex items-center h-12 px-4 border-b bg-background">
          <SidebarTrigger className="-ml-1" />
          <span className="ml-3 text-sm font-medium">{activePage}</span>
        </div>
        <div className="flex-1 overflow-auto bg-muted/30">
          {renderPage()}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default App
