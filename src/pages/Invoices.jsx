import { useState } from "react"
import { Plus, Search, FileText, CheckCircle2, Clock, AlertCircle, Download, Eye, Send, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import jsPDF from "jspdf"

// Canadian provincial/federal tax rates relevant to JP's service area
const TAX_RATES = {
  Quebec:  { label: "Quebec",  gst: 0.05,  pst: 0.09975, pstLabel: "QST" },
  Ontario: { label: "Ontario", gst: 0,     pst: 0.13,    pstLabel: "HST", hstCombined: true },
}

function calcTax(amount, province) {
  const rates = TAX_RATES[province]
  if (!rates) return { gst: 0, pst: 0, total: amount }
  if (rates.hstCombined) {
    const hst = amount * rates.pst
    return { gst: 0, pst: hst, pstLabel: rates.pstLabel, total: amount + hst }
  }
  const gst = amount * rates.gst
  const pst = amount * rates.pst
  return { gst, pst, pstLabel: rates.pstLabel, total: amount + gst + pst }
}

const initialInvoices = [
  { id: "INV-001", client: "Martin Rousseau",      phone: "819-555-0101", email: "martin.r@gmail.com",     date: "Jun 10, 2025", due: "Jun 24, 2025", amount: 285,  status: "Paid",    service: "Cockroach treatment",     province: "Quebec",  sent: true },
  { id: "INV-002", client: "Sylvie Côté",           phone: "819-555-0202", email: "sylvie.c@hotmail.com",   date: "Jun 15, 2025", due: "Jun 29, 2025", amount: 195,  status: "Paid",    service: "Ant colony removal",       province: "Quebec",  sent: true },
  { id: "INV-003", client: "Tremblay Landscaping",  phone: "819-555-0303", email: "info@tremblay.com",      date: "Jun 18, 2025", due: "Jul 02, 2025", amount: 450,  status: "Unpaid",  service: "Wasp nest removal",        province: "Quebec",  sent: true },
  { id: "INV-004", client: "Robert Gagné",          phone: "819-555-0611", email: "rgagne@outlook.com",     date: "Jun 14, 2025", due: "Jun 28, 2025", amount: 680,  status: "Overdue", service: "Bed bug treatment",        province: "Quebec",  sent: true },
  { id: "INV-005", client: "Pizza Palace Hull",     phone: "819-555-0720", email: "contact@pizzapalace.ca", date: "Jun 01, 2025", due: "Jun 15, 2025", amount: 320,  status: "Overdue", service: "Monthly pest inspection",  province: "Quebec",  sent: true },
  { id: "INV-006", client: "Anne Dubois",           phone: "819-555-0455", email: "anne.d@gmail.com",       date: "Jun 20, 2025", due: "Jul 04, 2025", amount: 175,  status: "Unpaid",  service: "Rodent inspection",        province: "Ontario", sent: false },
  { id: "INV-007", client: "Claude Bertrand",       phone: "819-555-0142", email: "claude.b@gmail.com",     date: "Jun 22, 2025", due: "Jul 06, 2025", amount: 890,  status: "Unpaid",  service: "Bed bug full treatment",   province: "Quebec",  sent: false },
  { id: "INV-008", client: "Manon Leblanc",         phone: "819-555-0399", email: "manon.l@gmail.com",      date: "Jun 25, 2025", due: "Jul 09, 2025", amount: 240,  status: "Draft",   service: "Rodent control",           province: "Ontario", sent: false },
]

const statusConfig = {
  Paid:    { color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  Unpaid:  { color: "bg-amber-100 text-amber-700",  icon: Clock },
  Overdue: { color: "bg-red-100 text-red-700",      icon: AlertCircle },
  Draft:   { color: "bg-gray-100 text-gray-600",    icon: FileText },
}

const services = ["Cockroach treatment", "Ant colony removal", "Wasp nest removal", "Bed bug treatment", "Rodent inspection", "Monthly pest inspection", "Rodent control", "Spider treatment", "Termite inspection"]

const emptyForm = { client: "", phone: "", email: "", service: "", amount: "", due: "", province: "Quebec" }

function downloadInvoicePDF(inv) {
  const tax = calcTax(inv.amount, inv.province)
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setFont(undefined, "bold")
  doc.text("PestDesk", 20, 25)
  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  doc.text("Hull Pest Control", 20, 32)

  doc.setFontSize(14)
  doc.setFont(undefined, "bold")
  doc.text(`Invoice ${inv.id}`, 150, 25)
  doc.setFontSize(9)
  doc.setFont(undefined, "normal")
  doc.text(`Date: ${inv.date}`, 150, 32)
  doc.text(`Due: ${inv.due}`, 150, 37)

  doc.setDrawColor(200)
  doc.line(20, 45, 190, 45)

  doc.setFontSize(10)
  doc.setFont(undefined, "bold")
  doc.text("Bill to:", 20, 55)
  doc.setFont(undefined, "normal")
  doc.text(inv.client, 20, 61)
  doc.text(inv.phone, 20, 66)
  doc.text(`Province: ${inv.province}`, 20, 71)

  // Table header
  let y = 90
  doc.setFillColor(240, 240, 240)
  doc.rect(20, y - 6, 170, 8, "F")
  doc.setFont(undefined, "bold")
  doc.text("Service", 24, y)
  doc.text("Qty", 130, y)
  doc.text("Amount", 160, y)
  doc.setFont(undefined, "normal")

  y += 10
  doc.text(inv.service, 24, y)
  doc.text("1", 130, y)
  doc.text(`$${inv.amount.toFixed(2)}`, 160, y)

  y += 15
  doc.line(120, y, 190, y)
  y += 8
  doc.text("Subtotal", 130, y)
  doc.text(`$${inv.amount.toFixed(2)}`, 160, y)

  if (tax.gst > 0) {
    y += 7
    doc.text("GST (5%)", 130, y)
    doc.text(`$${tax.gst.toFixed(2)}`, 160, y)
  }
  if (tax.pst > 0) {
    y += 7
    doc.text(`${tax.pstLabel}`, 130, y)
    doc.text(`$${tax.pst.toFixed(2)}`, 160, y)
  }

  y += 10
  doc.setFont(undefined, "bold")
  doc.setFontSize(12)
  doc.text("Total", 130, y)
  doc.text(`$${tax.total.toFixed(2)}`, 160, y)

  doc.setFontSize(8)
  doc.setFont(undefined, "normal")
  doc.setTextColor(150)
  doc.text("Thank you for your business.", 20, 280)

  doc.save(`${inv.id}-${inv.client.replace(/\s+/g, "-")}.pdf`)
}

export default function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState(null)
  const [sendConfirm, setSendConfirm] = useState(null) // invoice being confirmed for send

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.phone.includes(search) || inv.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "All" || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const totals = {
    paid:    invoices.filter(i => i.status === "Paid").reduce((s, i) => s + calcTax(i.amount, i.province).total, 0),
    unpaid:  invoices.filter(i => i.status === "Unpaid").reduce((s, i) => s + calcTax(i.amount, i.province).total, 0),
    overdue: invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + calcTax(i.amount, i.province).total, 0),
  }

  function createInvoice() {
    if (!form.client || !form.service || !form.amount) return
    const id = `INV-${String(invoices.length + 1).padStart(3, "0")}`
    setInvoices([{
      id, ...form,
      date: new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }),
      amount: Number(form.amount),
      status: "Draft",
      sent: false,
    }, ...invoices])
    setOpen(false)
    setForm(emptyForm)
  }

  function sendInvoice(inv) {
    setSendConfirm({ ...inv })
  }

  function confirmSend(inv) {
    const tax = calcTax(inv.amount, inv.province)
    const subject = encodeURIComponent(`Invoice ${inv.id} from Hull Pest Control`)
    const body = encodeURIComponent(
      `Hi ${inv.client},\n\nPlease find your invoice details below.\n\n` +
      `Invoice: ${inv.id}\nService: ${inv.service}\nSubtotal: $${inv.amount.toFixed(2)}\n` +
      `Tax: $${(tax.total - inv.amount).toFixed(2)}\nTotal due: $${tax.total.toFixed(2)}\nDue date: ${inv.due}\n\n` +
      `Thank you for your business!\nHull Pest Control`
    )
    window.open(`mailto:${inv.email || ""}?subject=${subject}&body=${body}`)
    setInvoices(prev => prev.map(i => i.id === inv.id
      ? { ...i, email: inv.email, sent: true, status: i.status === "Draft" ? "Unpaid" : i.status }
      : i
    ))
    setSendConfirm(null)
  }

  function markPaid(inv) {
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: "Paid" } : i))
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
            <p className="text-xs text-muted-foreground">{c.label} <span className="text-muted-foreground/60">(w/ tax)</span></p>
            <p className={`text-2xl font-semibold mt-1 ${c.color}`}>${c.value.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
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
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Province</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Due</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Total (tax incl.)</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => {
              const cfg = statusConfig[inv.status]
              const tax = calcTax(inv.amount, inv.province)
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
                      <button title="Open client sheet"
                        className="size-6 border rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0 ml-1">
                        <ExternalLink className="size-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{inv.service}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.province}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.due}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold">${tax.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                        {inv.status}
                      </span>
                      {inv.sent && <span title="Sent to client"><Send className="size-3 text-muted-foreground" /></span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {inv.status !== "Paid" && (
                        <button onClick={() => markPaid(inv)} title="Mark as paid"
                          className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors text-muted-foreground hover:text-green-500">
                          <CheckCircle2 className="size-3.5" />
                        </button>
                      )}
                      <button onClick={() => sendInvoice(inv)} title="Send to client"
                        className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors text-muted-foreground hover:text-blue-500">
                        <Send className="size-3.5" />
                      </button>
                      <button onClick={() => setPreview(inv)} title="Preview"
                        className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="size-3.5" />
                      </button>
                      <button onClick={() => downloadInvoicePDF(inv)} title="Download PDF"
                        className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input className="mt-1" placeholder="819-555-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input className="mt-1" type="email" placeholder="jean@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
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

            <div>
              <Label className="text-xs text-muted-foreground">Province (for tax)</Label>
              <Select value={form.province} onValueChange={v => setForm({...form, province: v})}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select province" /></SelectTrigger>
                <SelectContent style={{ background: "hsl(220, 13%, 13%)" }}>
                  <SelectItem value="Quebec">Quebec (GST 5% + QST 9.975%)</SelectItem>
                  <SelectItem value="Ontario">Ontario (HST 13%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Amount before tax ($)</Label>
                <Input className="mt-1" placeholder="250" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Due date</Label>
                <Input className="mt-1" type="date" value={form.due} onChange={e => setForm({...form, due: e.target.value})} />
              </div>
            </div>

            {form.amount && form.province && (
              <div className="rounded-lg border p-3 text-xs flex flex-col gap-1 bg-muted/20">
                {(() => {
                  const t = calcTax(Number(form.amount), form.province)
                  return (
                    <>
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${Number(form.amount).toFixed(2)}</span></div>
                      {t.gst > 0 && <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>${t.gst.toFixed(2)}</span></div>}
                      {t.pst > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t.pstLabel}</span><span>${t.pst.toFixed(2)}</span></div>}
                      <div className="flex justify-between font-semibold pt-1 border-t mt-1"><span>Total</span><span>${t.total.toFixed(2)}</span></div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={createInvoice}>Create invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send confirmation dialog */}
      {sendConfirm && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.75)" }} onClick={() => setSendConfirm(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[420px] rounded-2xl border shadow-2xl p-6"
            style={{ background: "hsl(220, 13%, 13%)" }}>
            <h2 className="text-base font-semibold mb-1">Send invoice</h2>
            <p className="text-xs text-muted-foreground mb-4">Verify the client's email before sending.</p>
            <div className="flex flex-col gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Client</Label>
                <p className="text-sm font-medium mt-0.5">{sendConfirm.client}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="size-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    value={sendConfirm.email || ""}
                    onChange={e => setSendConfirm(c => ({...c, email: e.target.value}))}
                    placeholder="client@email.com"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="rounded-lg border p-3 text-xs bg-muted/20">
                <p className="text-muted-foreground mb-1">Will send:</p>
                <p className="font-medium">{sendConfirm.id} — {sendConfirm.service}</p>
                <p className="text-muted-foreground">Total: ${calcTax(sendConfirm.amount, sendConfirm.province).total.toFixed(2)} · Due: {sendConfirm.due}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSendConfirm(null)}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-accent transition-colors">
                Cancel
              </button>
              <button onClick={() => confirmSend(sendConfirm)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Send className="size-4" /> Send invoice
              </button>
            </div>
          </div>
        </>
      )}

      {/* Invoice preview */}
      {preview && (() => {
        const tax = calcTax(preview.amount, preview.province)
        return (
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
                  <p className="text-muted-foreground text-xs">{preview.province}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Date issued</p>
                  <p className="text-xs">{preview.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">Due date</p>
                  <p className="text-xs">{preview.due}</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="bg-muted/30 px-4 py-2 grid grid-cols-3 text-xs text-muted-foreground font-medium">
                  <span>Service</span><span className="text-center">Qty</span><span className="text-right">Amount</span>
                </div>
                <div className="px-4 py-3 grid grid-cols-3 text-sm">
                  <span>{preview.service}</span><span className="text-center">1</span><span className="text-right font-medium">${preview.amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-sm mb-4">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${preview.amount.toFixed(2)}</span></div>
                {tax.gst > 0 && <div className="flex justify-between text-muted-foreground"><span>GST (5%)</span><span>${tax.gst.toFixed(2)}</span></div>}
                {tax.pst > 0 && <div className="flex justify-between text-muted-foreground"><span>{tax.pstLabel}</span><span>${tax.pst.toFixed(2)}</span></div>}
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-sm font-medium">Total</span>
                <span className="text-xl font-bold">${tax.total.toFixed(2)}</span>
              </div>
              {preview.status !== "Paid" && (
                <button onClick={() => { markPaid(preview); setPreview(p => ({...p, status: "Paid"})) }}
                  className="w-full mt-4 border border-green-500/40 text-green-500 hover:bg-green-500/10 rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-4" /> Mark as paid
                </button>
              )}
              <div className="flex gap-3 mt-3">
                <button onClick={() => setPreview(null)} className="flex-1 border rounded-lg py-2 text-sm hover:bg-accent transition-colors">Close</button>
                <button onClick={() => sendInvoice(preview)}
                  className="flex-1 border rounded-lg py-2 text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2">
                  <Mail className="size-4" /> Email
                </button>
                <button onClick={() => downloadInvoicePDF(preview)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Download className="size-4" /> PDF
                </button>
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}
