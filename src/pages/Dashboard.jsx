import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Clock, TrendingUp, FileText, AlertCircle } from "lucide-react"

const metrics = [
  { label: "Jobs today",       value: "8",       sub: "3 complete · 5 remaining", icon: Clock,       color: "text-blue-600" },
  { label: "Open invoices",    value: "$3,240",   sub: "12 unpaid",                icon: FileText,    color: "text-amber-500" },
  { label: "Monthly revenue",  value: "$18,450",  sub: "↑ 12% vs last month",      icon: TrendingUp,  color: "text-green-600" },
  { label: "Overdue follow-ups", value: "4",      sub: "Needs contact",            icon: AlertCircle, color: "text-red-500" },
]

const jobs = [
  { initials: "MR", name: "Martin Rousseau",      address: "142 Rue Principale, Gatineau", time: "9:00 AM",  type: "Cockroach treatment", status: "Complete",  statusColor: "bg-green-100 text-green-700" },
  { initials: "SC", name: "Sylvie Côté",           address: "88 Chemin du Lac, Aylmer",     time: "11:30 AM", type: "Ant colony",          status: "En route",  statusColor: "bg-amber-100 text-amber-700" },
  { initials: "TL", name: "Tremblay Landscaping",  address: "550 Blvd Industriel, Hull",    time: "2:00 PM",  type: "Wasp nest removal",   status: "Scheduled", statusColor: "bg-blue-100 text-blue-700" },
  { initials: "AD", name: "Anne Dubois",           address: "29 Rue des Érables, Gatineau", time: "4:30 PM",  type: "Rodent inspection",   status: "Scheduled", statusColor: "bg-blue-100 text-blue-700" },
]

const followups = [
  { name: "Robert Gagné",      detail: "Bed bug treatment · Jun 14", tag: "Overdue",  tagColor: "bg-red-100 text-red-700" },
  { name: "Pizza Palace Hull", detail: "Recurring · Jun 20",         tag: "Overdue",  tagColor: "bg-red-100 text-red-700" },
  { name: "Manon Leblanc",     detail: "Rodent check · Jun 29",      tag: "In 2 days", tagColor: "bg-amber-100 text-amber-700" },
]

const schedule = [
  { time: "9:00",  name: "Martin R.",    type: "Cockroach · Done",   dot: "bg-green-500" },
  { time: "11:30", name: "Sylvie C.",    type: "Ant colony · En route", dot: "bg-amber-500" },
  { time: "2:00",  name: "Tremblay L.", type: "Wasp nest",           dot: "bg-blue-500" },
  { time: "4:30",  name: "Anne D.",      type: "Rodent inspection",   dot: "bg-blue-500" },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Friday, June 27, 2025</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          New job
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <m.icon className={`size-4 ${m.color}`} />
            </div>
            <p className={`text-2xl font-semibold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Jobs list */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium mb-3">Today's jobs</h2>
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div key={job.name} className="rounded-xl border bg-card p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="size-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {job.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{job.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{job.address}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {job.time} · {job.type}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panels */}
        <div className="flex flex-col gap-4">
          {/* Schedule */}
          <div className="rounded-xl border bg-card p-4">
            <h2 className="text-sm font-medium mb-3">Today's schedule</h2>
            <div className="flex flex-col gap-0">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <span className="text-xs text-muted-foreground w-10">{s.time}</span>
                  <div className={`size-2 rounded-full flex-shrink-0 ${s.dot}`} />
                  <div>
                    <p className="text-xs font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-ups */}
          <div className="rounded-xl border bg-card p-4">
            <h2 className="text-sm font-medium mb-3">Follow-ups needed</h2>
            <div className="flex flex-col gap-0">
              {followups.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-xs font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.detail}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${f.tagColor}`}>
                    {f.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
