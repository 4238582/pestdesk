import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Phone, Mail, MapPin, Bug, Clock } from "lucide-react"

const pestTypes = ["Ants", "Cockroaches", "Bed bugs", "Rodents", "Wasps", "Spiders", "Termites", "Other"]

const initialLeads = [
  { id: 1, name: "Claude Bertrand",    phone: "819-555-0142", email: "claude.b@gmail.com",   address: "14 Rue Laval, Gatineau",       pest: "Bed bugs",    status: "New",       date: "Jun 28", notes: "Found bugs in bedroom" },
  { id: 2, name: "Marie-Eve Gagnon",   phone: "819-555-0287", email: "megagnon@hotmail.com", address: "302 Av. Cartier, Hull",         pest: "Cockroaches", status: "Contacted", date: "Jun 27", notes: "Restaurant kitchen" },
  { id: 3, name: "Luc Thibodeau",      phone: "613-555-0391", email: "luc.t@outlook.com",    address: "88 Promenade du Lac, Aylmer",   pest: "Wasps",       status: "Quoted",    date: "Jun 26", notes: "Nest under deck" },
  { id: 4, name: "Sandra Paquette",    phone: "819-555-0514", email: "spaquette@gmail.com",  address: "45 Chemin Pink, Gatineau",      pest: "Rodents",     status: "Won",       date: "Jun 25", notes: "Heard scratching in walls" },
  { id: 5, name: "Depot Materiaux JB", phone: "819-555-0671", email: "info@depotjb.com",     address: "220 Blvd Industriel, Hull",     pest: "Ants",        status: "Lost",      date: "Jun 24", notes: "Went with another company" },
]

const statusConfig = {
  New:       { color: "bg-blue-100 text-blue-700",   label: "New" },
  Contacted: { color: "bg-amber-100 text-amber-700", label: "Contacted" },
  Quoted:    { color: "bg-purple-100 text-purple-700", label: "Quoted" },
  Won:       { color: "bg-green-100 text-green-700", label: "Won" },
  Lost:      { color: "bg-red-100 text-red-700",     label: "Lost" },
}

const emptyForm = { name: "", phone: "", email: "", address: "", pest: "", notes: "" }

export default function Leads({ onSelectLead }) {
  const [leads, setLeads] = useState(initialLeads)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [activeTab, setActiveTab] = useState("All")

  const tabs = ["All", "New", "Contacted", "Quoted", "Won", "Lost"]

  const filtered = activeTab === "All" ? leads : leads.filter(l => l.status === activeTab)

  const counts = tabs.reduce((acc, t) => {
    acc[t] = t === "All" ? leads.length : leads.filter(l => l.status === t).length
    return acc
  }, {})

  function openNew() {
    setSelected(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(lead) {
    setSelected(lead)
    setForm({ name: lead.name, phone: lead.phone, email: lead.email, address: lead.address, pest: lead.pest, notes: lead.notes })
    setOpen(true)
  }

  function saveLead() {
    if (!form.name) return
    if (selected) {
      setLeads(leads.map(l => l.id === selected.id ? { ...l, ...form } : l))
    } else {
      setLeads([{ id: Date.now(), ...form, status: "New", date: "Today" }, ...leads])
    }
    setOpen(false)
  }

  function updateStatus(id, status) {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
        </div>
        <Button className="gap-2" onClick={openNew}>
          <Plus className="size-4" />
          New lead
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-5 gap-3">
        {["New", "Contacted", "Quoted", "Won", "Lost"].map(s => (
          <div key={s} className="rounded-xl border bg-card p-3 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab(s)}>
            <p className="text-xs text-muted-foreground">{s}</p>
            <p className="text-2xl font-semibold mt-1">{counts[s]}</p>
          </div>
        ))}
      </div>

      {/* Tabs + list */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {tabs.map(t => (
            <TabsTrigger key={t} value={t}>
              {t} {counts[t] > 0 && <span className="ml-1 text-xs text-muted-foreground">({counts[t]})</span>}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="flex flex-col gap-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">No leads in this stage</div>
            )}
            {filtered.map(lead => (
              <div key={lead.id} className="rounded-xl border bg-card p-4 flex items-start gap-4 hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => onSelectLead ? onSelectLead(lead) : openEdit(lead)}>
                <div className="size-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{lead.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusConfig[lead.status].color}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="size-3" />{lead.phone}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="size-3" />{lead.address}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Bug className="size-3" />{lead.pest}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="size-3" />{lead.date}</span>
                  </div>
                  {lead.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{lead.notes}"</p>}
                </div>
                <Select value={lead.status} onValueChange={v => { updateStatus(lead.id, v); }} onClick={e => e.stopPropagation()}>
                  <SelectTrigger className="w-32 h-8 text-xs" onClick={e => e.stopPropagation()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusConfig).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit lead" : "New lead"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Full name</Label>
                <Input className="mt-1" placeholder="Jean Tremblay" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input className="mt-1" placeholder="819-555-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1" placeholder="email@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input className="mt-1" placeholder="123 Rue Principale, Gatineau" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div className="col-span-2">
                <Label>Pest type</Label>
                <Select value={form.pest} onValueChange={v => setForm({...form, pest: v})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select pest type" />
                  </SelectTrigger>
                  <SelectContent>
                    {pestTypes.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input className="mt-1" placeholder="What did the customer say?" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={saveLead}>{selected ? "Save changes" : "Add lead"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
