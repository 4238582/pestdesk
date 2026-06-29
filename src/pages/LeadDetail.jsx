import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Phone, Mail, MessageSquare, Video, MoreHorizontal,
  Settings, Eye, Share2, ChevronLeft, CheckCircle2,
  Circle, Plus, ClipboardList, FileText, Bug,
  User, Calendar
} from "lucide-react"

const colleagues = ["Jean-Philippe", "Marie-Eve", "Luc", "Sandra", "Robert"]
const reps = ["—", "Jean-Philippe", "Marie-Eve", "Luc", "Sandra"]
const taskTypes = [
  { value: "call",        label: "Call",             icon: Phone },
  { value: "email",       label: "Email",            icon: Mail },
  { value: "sms",         label: "SMS",              icon: MessageSquare },
  { value: "appointment", label: "Appointment",      icon: Calendar },
  { value: "inspection",  label: "Site inspection",  icon: Bug },
  { value: "quote",       label: "Send quote",       icon: FileText },
  { value: "followup",    label: "Follow-up",        icon: CheckCircle2 },
]
const pipeline = [
  { key: "New",       label: "New lead" },
  { key: "Contacted", label: "Contacted" },
  { key: "Quoted",    label: "Quoted" },
  { key: "Scheduled", label: "Scheduled" },
  { key: "Complete",  label: "Complete" },
  { key: "Invoiced",  label: "Invoiced" },
]

function TaskTypeSelect({ value, onChange }) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const selected = taskTypes.find(t => t.value === value)
  const filtered = taskTypes.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <Label className="text-xs text-muted-foreground">Type <span className="text-red-500">*</span></Label>
      <div className="relative mt-1">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between h-9 px-3 rounded-md border bg-background text-sm hover:bg-accent transition-colors"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <selected.icon className="size-4 text-muted-foreground" />
              {selected.label}
            </span>
          ) : (
            <span className="text-muted-foreground">No selection</span>
          )}
          <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>

        {open && (
          <div className="absolute top-10 left-0 w-full border rounded-lg shadow-lg z-50 overflow-hidden" style={{ background: "hsl(220, 13%, 13%)" }}>
            <div className="flex items-center gap-2 px-3 py-2 border-b">
              <svg className="size-3.5 text-muted-foreground flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                autoFocus
                className="flex-1 text-xs bg-transparent outline-none"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { onChange(t.value); setOpen(false); setSearch("") }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-accent text-left transition-colors
                    ${value === t.value ? "bg-accent/60" : ""}`}
                >
                  <t.icon className="size-4 text-muted-foreground flex-shrink-0" />
                  {t.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-3 text-xs text-muted-foreground">No results</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LeadDetail({ lead, onBack, onUpdate }) {
  const [tasks, setTasks]       = useState([])
  const [notes, setNotes]       = useState([])
  const [noteText, setNoteText] = useState("")
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [tagSearch, setTagSearch]     = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [taskDialog, setTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState({ type: "call", label: "", due: "" })
  const [rep,       setRep]       = useState(lead.rep || "Jean-Philippe")
  const [tech,      setTech]      = useState("—")
  const [secondRep, setSecondRep] = useState("—")
  const [manager,   setManager]   = useState("—")
  const [status,    setStatus]    = useState(lead.status || "New")

  const stageIdx = pipeline.findIndex(p => p.key === status)
  const initials = lead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  function saveNote() {
    if (!noteText.trim()) return
    setNotes([...notes, {
      id: Date.now(), author: "Jean-Philippe",
      text: noteText, time: new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" }),
      tags: selectedTags,
    }])
    setNoteText(""); setSelectedTags([])
  }

  function handleNoteInput(e) {
    const val = e.target.value
    setNoteText(val)
    const lastAt = val.lastIndexOf("@")
    if (lastAt !== -1 && lastAt === val.length - 1) { setShowTagMenu(true); setTagSearch("") }
    else if (lastAt !== -1 && showTagMenu) setTagSearch(val.slice(lastAt + 1))
    else setShowTagMenu(false)
  }

  function tagColleague(name) {
    setNoteText(prev => prev.slice(0, prev.lastIndexOf("@")) + `@${name} `)
    setSelectedTags(t => [...t, name]); setShowTagMenu(false)
  }

  function saveTask() {
    if (!newTask.label) return
    setTasks(t => [...t, { id: Date.now(), ...newTask, done: false }])
    setTaskDialog(false); setNewTask({ type: "call", label: "", due: "" })
  }

  function setStage(key) { setStatus(key); onUpdate({ ...lead, status: key }) }

  const filteredColleagues = colleagues.filter(c => c.toLowerCase().includes(tagSearch.toLowerCase()))

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[hsl(var(--background))]">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 h-11 border-b flex-shrink-0 text-sm">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /><span className="text-xs">Leads</span>
        </button>

        <Select value={status} onValueChange={setStage}>
          <SelectTrigger className="h-7 text-xs w-32 border rounded px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pipeline.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <span className="flex items-center gap-1.5 text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-medium">
          <CheckCircle2 className="size-3" /> Active
        </span>

        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
          <span>{new Date().toLocaleDateString("en-CA", { day:"numeric", month:"short", year:"numeric" })} {new Date().toLocaleTimeString("en-CA",{hour:"2-digit",minute:"2-digit"})}</span>
          <button className="hover:text-foreground"><Settings className="size-3.5" /></button>
          <button className="hover:text-foreground"><Eye className="size-3.5" /></button>
          <button className="hover:text-foreground"><Share2 className="size-3.5" /></button>
        </div>
      </div>

      {/* ── Client header ── */}
      <div className="flex items-stretch border-b flex-shrink-0">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 px-6 py-4 flex-shrink-0">
          {/* Avatar with person silhouette like Activix */}
          <div className="size-16 rounded-full border-2 border-border bg-muted flex flex-col items-center justify-center relative flex-shrink-0">
            <User className="size-7 text-muted-foreground" />
            <div className="absolute bottom-0.5 right-0.5 size-3 bg-green-500 rounded-full border border-background" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">{lead.name.split(" ")[0]} <span className="font-bold">{lead.name.split(" ").slice(1).join(" ")}</span></h1>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Bug className="size-3" />{lead.pest || "—"}</p>
          </div>
        </div>

        {/* Rep columns */}
        <div className="flex flex-1 border-l">
          {[
            { label: "REPRESENTATIVE",  value: rep,       setter: setRep },
            { label: "TECHNICIAN",      value: tech,      setter: setTech },
            { label: "SECOND REP",      value: secondRep, setter: setSecondRep },
            { label: "MANAGER",         value: manager,   setter: setManager },
          ].map((col, i) => (
            <div key={i} className="flex-1 border-r last:border-r-0 px-4 py-3 flex flex-col justify-center">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-widest mb-1.5">{col.label}</p>
              <Select value={col.value} onValueChange={col.setter}>
                <SelectTrigger className="h-auto text-xs border-0 p-0 shadow-none bg-transparent focus:ring-0 gap-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reps.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 px-4 border-l flex-shrink-0">
          {[{I:Phone,l:"Call"},{I:Mail,l:"Email"},{I:MessageSquare,l:"SMS"},{I:Video,l:"Video"}].map(({I,l}) => (
            <button key={l} title={l} className="size-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <I className="size-4" />
            </button>
          ))}
          <button className="flex items-center gap-1 text-xs border px-3 h-9 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground ml-1">
            <MoreHorizontal className="size-4" /> Plus
          </button>
        </div>
      </div>

      {/* ── 3 panels ── */}
      <div className="flex gap-4 p-4 border-b bg-background flex-shrink-0" style={{height: 220}}>

        {/* Tasks */}
        <div className="flex-1 rounded-lg border flex flex-col overflow-hidden" style={{height: 200}}>
          <div className="flex items-center justify-between px-3 py-2.5 border-b">
            <span className="text-xs font-semibold">Tasks & appointments</span>
            <button onClick={() => setTaskDialog(true)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors">
              Add
            </button>
          </div>
          <div className="flex-1 flex items-center p-4 text-muted-foreground gap-3">
            {tasks.length === 0 ? (
              <div className="flex items-center gap-4 w-full">
                <div className="size-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="size-6 opacity-50" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">No tasks scheduled</p>
                  <button onClick={() => setTaskDialog(true)} className="text-xs text-blue-500 hover:underline mt-0.5">Add one</button>
                </div>
              </div>
            ) : tasks.map(task => {
              const TI = taskTypes.find(t => t.value === task.type)?.icon || ClipboardList
              return (
                <div key={task.id} onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t,done:!t.done} : t))}
                  className={`flex items-center gap-2 w-full p-2 rounded border cursor-pointer hover:bg-accent/30 ${task.done?"opacity-50":""}`}>
                  {task.done ? <CheckCircle2 className="size-3.5 text-green-500" /> : <Circle className="size-3.5 text-muted-foreground" />}
                  <span className={`text-xs flex-1 ${task.done?"line-through":""}`}>{task.label}</span>
                  <TI className="size-3 text-muted-foreground" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Communications */}
        <div className="flex-1 rounded-lg border flex flex-col overflow-hidden" style={{height: 200}}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b">
            <span className="text-xs font-semibold">Communications</span>
          </div>
          <div className="flex-1 flex items-center p-4">
            <div className="flex items-center gap-4 w-full">
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Mail className="size-6 opacity-50" />
              </div>
              <div>
                <p className="text-xs font-medium">No communications yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Calls, emails and SMS appear here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="flex-1 rounded-lg border flex flex-col overflow-hidden" style={{height: 200}}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b">
            <span className="text-xs font-semibold">Notes</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="flex items-center p-4">
                <div className="flex items-center gap-4 w-full">
                  <div className="size-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="size-6 opacity-50" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">No notes</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Notes added here are visible to all reps</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1.5">
                {notes.map(note => (
                  <div key={note.id} className="rounded border bg-card p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="size-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">JP</div>
                      <span className="text-xs font-medium">{note.author}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{note.time}</span>
                    </div>
                    <p className="text-xs">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Note composer (below the 3 panels, above pipeline) ── */}
      <div className="border-b bg-background flex-shrink-0 relative">
        <div className="flex items-center gap-3 px-4 py-2.5 border-b">
          <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">JP</div>
          <span className="text-xs text-muted-foreground">Add a note or drop a file here</span>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => { setShowTagMenu(m => !m); setTagSearch("") }}
              className={`hover:text-foreground transition-colors ${showTagMenu ? "text-blue-500" : "text-muted-foreground"}`}
              title="Tag a colleague"
            ><User className="size-4" /></button>
            <button className="text-muted-foreground hover:text-foreground"><MessageSquare className="size-4" /></button>
            <button onClick={saveNote} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded font-medium transition-colors">Save</button>
          </div>
        </div>
        <textarea
          className="w-full bg-transparent px-4 py-3 text-sm resize-none outline-none min-h-[72px]"
          placeholder="Write a note... type @ to tag a colleague"
          value={noteText}
          onChange={handleNoteInput}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) saveNote() }}
        />
        {showTagMenu && (
          <div className="absolute bottom-20 left-3 border rounded-lg shadow-xl z-50 w-44 overflow-hidden"
            style={{ background: "hsl(220, 13%, 13%)" }}>
            <div className="px-3 py-2 border-b">
              <p className="text-xs text-muted-foreground font-medium">Tag a colleague</p>
            </div>
            {filteredColleagues.map(c => (
              <div key={c} onMouseDown={() => tagColleague(c)}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-accent/50 cursor-pointer">
                <div className="size-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">{c.slice(0,2).toUpperCase()}</div>
                <span className="text-xs">{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Pipeline (Activix "Navigateur d'offres" style) ── */}
      <div className="flex-shrink-0 border-b">
        <div className="px-4 pt-2 pb-1">
          <p className="text-xs font-medium text-muted-foreground">Pipeline</p>
        </div>
        <div className="flex">
          {pipeline.map((stage, i) => {
            const isPast    = i < stageIdx
            const isCurrent = i === stageIdx
            return (
              <button key={stage.key} onClick={() => setStage(stage.key)}
                className={`flex-1 py-2.5 text-xs font-medium border-r last:border-r-0 relative transition-colors flex items-center justify-center gap-1.5
                  ${isCurrent
                    ? "bg-green-500 text-white"
                    : isPast
                      ? "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                      : "hover:bg-accent text-muted-foreground"
                  }`}>
                {isCurrent && <CheckCircle2 className="size-3.5" />}
                {stage.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Quote / service area ── */}
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-muted/10 flex-shrink-0">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-3">
          <FileText className="size-8 opacity-30" />
        </div>
        <p className="text-sm font-medium">No quote yet</p>
        <p className="text-xs mt-1 text-muted-foreground">Add a pest control service to start building a quote</p>
        <button className="mt-4 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1.5 transition-colors">
          <Bug className="size-3.5" /> Add service
        </button>
      </div>

      {/* ── Invoice history ── */}
      <div className="flex-shrink-0 border-t px-6 py-4 bg-background">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">Invoice history</p>
          <button className="text-xs text-blue-500 hover:text-blue-400">+ New invoice</button>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { id: "INV-001", date: "Jun 10, 2025", service: "Inspection", amount: 285, status: "Paid" },
          ].map(inv => (
            <div key={inv.id} className="flex items-center justify-between text-xs py-2 border-b last:border-0">
              <span className="text-muted-foreground font-mono">{inv.id}</span>
              <span className="text-muted-foreground">{inv.date}</span>
              <span className="truncate max-w-[160px] text-muted-foreground">{inv.service}</span>
              <span className="font-medium">${inv.amount}</span>
              <span className={`px-2 py-0.5 rounded-full font-medium ${inv.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{inv.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom action bar (like Activix) ── */}
      <div className="flex items-center gap-6 px-6 py-2.5 border-t bg-background flex-shrink-0">
        {[Phone, Mail, MessageSquare, Video, Calendar].map((Icon, i) => (
          <button key={i} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon className="size-4" />
          </button>
        ))}
      </div>

      {/* Task dialog — Activix style */}
      <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
        <DialogContent className="max-w-md" style={{ background: "hsl(220, 13%, 13%)" }}>
          <DialogHeader>
            <DialogTitle className="text-base">Add a task or appointment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">

            {/* Type — searchable */}
            <TaskTypeSelect
              value={newTask.type}
              onChange={v => setNewTask({...newTask, type: v})}
            />

            {/* Description */}
            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Input className="mt-1" placeholder="e.g. Follow up call" value={newTask.label} onChange={e => setNewTask({...newTask, label: e.target.value})} />
            </div>

            {/* Date + Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <Input className="mt-1" type="date" value={newTask.due} onChange={e => setNewTask({...newTask, due: e.target.value})} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Time</Label>
                <Input className="mt-1" type="time" value={newTask.time || ""} onChange={e => setNewTask({...newTask, time: e.target.value})} />
              </div>
            </div>

            {/* Assign to */}
            <div>
              <Label className="text-xs text-muted-foreground">Assign to</Label>
              <Select value={newTask.assignedTo || "Jean-Philippe"} onValueChange={v => setNewTask({...newTask, assignedTo: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Jean-Philippe","Marie-Eve","Luc","Sandra"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setTaskDialog(false); setNewTask({ type: "", label: "", due: "" }) }}>Cancel</Button>
            <Button onClick={saveTask} className="bg-blue-600 hover:bg-blue-700">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
