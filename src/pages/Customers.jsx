import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Phone, Mail, MapPin, User, Search } from "lucide-react"

const reps = ["Jean-Philippe", "Marie-Eve", "Luc", "Sandra"]

const initialCustomers = [
  { id: 1, name: "Martin Rousseau",     phone: "819-555-0101", email: "martin.r@gmail.com",    address: "142 Rue Principale, Gatineau", rep: "Jean-Philippe", date: "Jun 10" },
  { id: 2, name: "Sylvie Côté",          phone: "819-555-0202", email: "sylvie.c@hotmail.com",  address: "88 Chemin du Lac, Aylmer",     rep: "Jean-Philippe", date: "Jun 15" },
  { id: 3, name: "Tremblay Landscaping", phone: "819-555-0303", email: "info@tremblay.com",     address: "550 Blvd Industriel, Hull",    rep: "Marie-Eve",     date: "Jun 18" },
  { id: 4, name: "Robert Gagné",         phone: "819-555-0611", email: "rgagne@outlook.com",    address: "29 Rue des Érables, Gatineau", rep: "Jean-Philippe", date: "Jun 20" },
  { id: 5, name: "Pizza Palace Hull",    phone: "819-555-0720", email: "contact@pizzapalace.ca", address: "12 Rue Laval, Hull",           rep: "Luc",           date: "Jun 22" },
]

const emptyForm = { name: "", phone: "", email: "", address: "", rep: "" }

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState("")
  const [errors, setErrors] = useState({})

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name  = "Name is required"
    if (!form.phone.trim()) e.phone = "Phone is required"
    if (!form.rep)          e.rep   = "Select a representative"
    return e
  }

  function save() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setCustomers([{
      id: Date.now(),
      ...form,
      date: new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
    }, ...customers])
    setOpen(false)
    setForm(emptyForm)
    setErrors({})
  }

  function openNew() {
    setForm(emptyForm)
    setErrors({})
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} total customers</p>
        </div>
        <Button className="gap-2" onClick={openNew}>
          <Plus className="size-4" />
          New customer
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border bg-muted/50 max-w-sm">
        <Search className="size-4 text-muted-foreground flex-shrink-0" />
        <input
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
          placeholder="Search by name, phone or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Customer list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No customers found</div>
        )}
        {filtered.map(c => (
          <div key={c.id} className="rounded-xl border bg-card p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors cursor-pointer">
            <div className="size-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{c.name}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="size-3" />{c.phone}</span>
                {c.email && <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="size-3" />{c.email}</span>}
                {c.address && <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="size-3" />{c.address}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-end">
                <User className="size-3" />
                <span>{c.rep}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New customer dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New customer</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Name */}
            <div>
              <Label>Full name <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1"
                placeholder="Jean Tremblay"
                value={form.name}
                onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ""}) }}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label>Phone number <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1"
                placeholder="819-555-0000"
                value={form.phone}
                onChange={e => { setForm({...form, phone: e.target.value}); setErrors({...errors, phone: ""}) }}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <Label>Email address</Label>
              <Input
                className="mt-1"
                placeholder="jean@gmail.com"
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Input
                className="mt-1"
                placeholder="123 Rue Principale, Gatineau"
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />
            </div>

            {/* Rep */}
            <div>
              <Label>Created by <span className="text-red-500">*</span></Label>
              <Select value={form.rep} onValueChange={v => { setForm({...form, rep: v}); setErrors({...errors, rep: ""}) }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select representative" />
                </SelectTrigger>
                <SelectContent>
                  {reps.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rep && <p className="text-xs text-red-500 mt-1">{errors.rep}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Create customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
