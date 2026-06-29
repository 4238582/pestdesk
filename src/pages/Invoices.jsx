import { useState } from "react"
import { Plus, Search, FileText, CheckCircle2, Clock, AlertCircle, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialInvoices = [
  { id: "INV-001", client: "Martin Rousseau",      phone: "819-555-0101", date: "Jun 10, 2025", due: "Jun 24, 2025", amount: 285,  status: "Paid",    service: "Cockroach treatment" },
  { id: "INV-002", client: "Sylvie Côté",           phone: "819-555-0202", date: "Jun 15, 2025", due: "Jun 29, 2025", amount: 195,  status: "Paid",    service: "Ant colony removal" },
  { id: "INV-003", client: "Tremblay Landscaping",  phone: "819-555-0303", date: "Jun 18, 2025", due: "Jul 02, 2025", amount: 450,  status: "Unpaid",  service: "Wasp nest removal" },
  { id: "INV-004", client: "Robert Gagné",          phone: "819-555-0611", date: "Jun 14, 2025", due: "Jun 28, 2025", amount: 680,  status: "Overdue", service: "Bed bug treatment" },
  { id: "INV-005", client: "Pizza Palace Hull",     phone: "819-555-0720", date: "Jun 01, 2025", due: "Jun 15, 2025", amount: 320,  status: "Overdue", service: "Monthly pest inspection" },
  { id: "INV-006", client: "Anne Dubois",           phone: "819-555-0455", date: "Jun 20, 2025", due: "Jul 04, 2025", amount: 175,  status: "Unpaid",  service: "Rodent inspection" },
  { id: "INV-007", client: "Claude Bertrand",       phone: "819-555-0142", date: "Jun 22, 2025", due: "Jul 06, 2025", amount: 890,  status: "Unpaid",  service: "Bed bug full treatment" },
  { id: "INV-008", client: "Manon Leblanc",         phone: "819-555-0399", date: "Jun 25, 2025", due: "Jul 09, 2025", amount: 240,  status: "Draft",   service: "Rodent control" },
]

const statusConfig = {
  Paid:    { color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  Unpaid:  { color: "bg-amber-100 text-amber-700",  icon: Clock },
  Overdue: { color: "bg-red-100 text-red-700",      icon: AlertCircle },
  Draft:   { color: "bg-gray-100 text-gray-600",    icon: FileText },
}

const services = ["Cockroach treatment", "Ant colony removal", "Wasp nest removal", "Bed bug treatment", "Rodent inspection", "Monthly pest inspection", "Rodent control", "Spider treatment", "Termite inspection"]

const emptyForm = { client: "", phone: "", service: "", amount: "", due: "" }

export default function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState(null)

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.phone.includes(search) || inv.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const totals = {
    paid:    invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0),
    unpaid:  invoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.amount, 0),
  }

  function createInvoice() {
    if (!form.client || !form.service || !form.amount) return
    const id = `INV-${String(invoices.length + 1).padStart(3, "0")}`
    setInvoices([{
      id, ...form,
      date: new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }),
      amount: Number(form.amount),
      status: "Draft",
    }, ...invoices])
    setOpen(false)
    setForm(emptyForm)
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground">{invoices.length} total invoices</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> New invoice
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Collected",  value: totals.paid,    color: "text-green-500" },
          { label: "Pending",    value: totals.unpaid,  color: "text-amber-500" },
          { label: "Overdue",    value: totals.overdue, color: "text-red-500" },
        ].map(c => (
          <div key={c.label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${c.color}`}>${c.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border bg-muted/50 w-72">
          <Search className="size-4 text-muted-foreground flex-shrink-0" />
          <input
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
            placeholder="Search client, phone or invoice #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 border rounded-lg p-0.5">
          {["All", "Paid", "Unpaid", "Overdue", "Draft"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded transition-colors ${statusFilter === s ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Invoice</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Client</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Service</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Due</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv, i) => {
              const cfg = statusConfig[inv.status]
              return (
                <tr key={inv.id} className="border-b last:border-b-0 hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{inv.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {inv.client.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{inv.client}</p>
                        <p className="text-xs text-muted-foreground">{inv.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{inv.service}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.date}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.due}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setPreview(inv)}
                        className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="size-3.5" />
                      </button>
                      <button className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                        <Download className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">No invoices found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New invoice dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" style={{ background: "hsl(220, 13%, 13%)" }}>
          <DialogHeader><DialogTitle>New invoice</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label className="text-xs text-muted-foreground">Client name</Label>
              <Input className="mt-1" placeholder="Jean Tremblay" value={form.client} onChange={e => setForm({...form, client: e.target.value})} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <Input className="mt-1" placeholder="819-555-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Service</Label>
              <Select value={form.service} onValueChange={v => setForm({...form, service: v})}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent style={{ background: "hsl(220, 13%, 13%)" }}>
                  {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Amount ($)</Label>
                <Input className="mt-1" placeholder="250" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Due date</Label>
                <Input className="mt-1" type="date" value={form.due} onChange={e => setForm({...form, due: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={createInvoice}>Create invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice preview */}
      {preview && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.75)" }} onClick={() => setPreview(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] rounded-2xl border shadow-2xl p-8"
            style={{ background: "hsl(220, 13%, 13%)" }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <FileText className="size-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">PestDesk</span>
                </div>
                <p className="text-xs text-muted-foreground">Hull Pest Control</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Invoice</p>
                <p className="text-lg font-bold">{preview.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bill to</p>
                <p className="font-medium">{preview.client}</p>
                <p className="text-muted-foreground text-xs">{preview.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Date issued</p>
                <p className="text-xs">{preview.date}</p>
                <p className="text-xs text-muted-foreground mt-1">Due date</p>
                <p className="text-xs">{preview.due}</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="bg-muted/30 px-4 py-2 grid grid-cols-3 text-xs text-muted-foreground font-medium">
                <span>Service</span><span className="text-center">Qty</span><span className="text-right">Amount</span>
              </div>
              <div className="px-4 py-3 grid grid-cols-3 text-sm">
                <span>{preview.service}</span><span className="text-center">1</span><span className="text-right font-medium">${preview.amount}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-sm font-medium">Total</span>
              <span className="text-xl font-bold">${preview.amount.toLocaleString()}</span>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPreview(null)} className="flex-1 border rounded-lg py-2 text-sm hover:bg-accent transition-colors">Close</button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="size-4" /> Download PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
