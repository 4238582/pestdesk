import { useState } from "react"
import { X, RefreshCw, ChevronDown, Phone, Mail, User, MapPin, Bug } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const reps = ["Jean-Philippe", "Marie-Eve", "Luc", "Sandra"]
const pestTypes = ["Ants", "Cockroaches", "Bed bugs", "Rodents", "Wasps", "Spiders", "Termites", "Other"]

const emptyForm = { name: "", company: "", phone: "", email: "", address: "", pest: "", rep: "", notes: "" }

export function QuickCreatePanel({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [showExtra, setShowExtra] = useState(false)
  const [errors, setErrors] = useState({})

  function reset() { setForm(emptyForm); setErrors({}) }

  function save() {
    const e = {}
    if (!form.name.trim())  e.name  = true
    if (!form.phone.trim()) e.phone = true
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ ...form, id: Date.now(), status: "New", date: new Date().toLocaleDateString("en-CA", { month: "short", day: "numeric" }) })
    reset()
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-40 bg-background border-l shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0">
          <h2 className="text-sm font-semibold">New lead</h2>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors" title="Reset">
              <RefreshCw className="size-4" />
            </button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* Full name */}
          <div>
            <Label className="text-xs text-muted-foreground">Full name <span className="text-red-500">*</span></Label>
            <div className="relative mt-1">
              <User className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                className={`pl-8 ${errors.name ? "border-red-500" : ""}`}
                placeholder="Jean Tremblay"
                value={form.name}
                onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: false}) }}
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <Label className="text-xs text-muted-foreground">Company name</Label>
            <Input className="mt-1" placeholder="Tremblay Inc." value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Phone <span className="text-red-500">*</span></Label>
              <div className="relative mt-1">
                <Phone className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  className={`pl-8 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="819-555-0000"
                  value={form.phone}
                  onChange={e => { setForm({...form, phone: e.target.value}); setErrors({...errors, phone: false}) }}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input className="pl-8" placeholder="jean@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Rep */}
          <div>
            <Label className="text-xs text-muted-foreground">Representative</Label>
            <Select value={form.rep} onValueChange={v => setForm({...form, rep: v})}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select rep" /></SelectTrigger>
              <SelectContent>{reps.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {/* Additional fields toggle */}
          <button
            onClick={() => setShowExtra(e => !e)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={`size-3.5 transition-transform ${showExtra ? "rotate-180" : ""}`} />
            Additional fields
          </button>

          {showExtra && (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <Input className="pl-8" placeholder="123 Rue Principale, Gatineau" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Pest type</Label>
                <Select value={form.pest} onValueChange={v => setForm({...form, pest: v})}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select pest" /></SelectTrigger>
                  <SelectContent>{pestTypes.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <textarea
                  className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm resize-none outline-none focus:ring-1 focus:ring-ring min-h-[80px]"
                  placeholder="What did the client say?"
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t flex-shrink-0">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button onClick={save} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
            Create lead
          </button>
        </div>
      </div>
    </>
  )
}
