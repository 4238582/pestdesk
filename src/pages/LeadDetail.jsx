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
  { value: "call",  label: "Call",  icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "sms",   label: "SMS",   icon: MessageSquare },
]
const pipeline = [
  { key: "New",       label: "New lead" },
  { key: "Contacted", label: "Contacted" },
  { key: "Quoted",    label: "Quoted" },
  { key: "Scheduled", label: "Scheduled" },
  { key: "Complete",  label: "Complete" },
  { key: "Invoiced",  label: "Invoiced" },
]

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
      <div className="flex gap-4 p-4 border-b bg-background flex-shrink-0">

        {/* Tasks */}
        <div className="flex-1 rounded-lg border flex flex-col overflow-hidden" style={{minHeight: 160}}>
          <div className="flex items-center justify-between px-3 py-2.5 border-b">
            <span className="text-xs font-semibold">Tasks & appointments</span>
            <button onClick={() => setTaskDialog(true)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors">
              Add
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
            {tasks.length === 0 ? (
              <>
                <ClipboardList className="size-8 opacity-25" />
                <p className="text-xs">No tasks scheduled</p>
              </>
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
        <div className="flex-1 rounded-lg border flex flex-col overflow-hidden" style={{minHeight: 160}}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b">
            <span className="text-xs font-semibold">Communications</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
            <Mail className="size-8 opacity-25" />
            <p className="text-xs">No communications yet</p>
          </div>
        </div>

        {/* Notes */}
        <div className="flex-1 rounded-lg border flex flex-col overflow-hidden" style={{minHeight: 160}}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b">
            <span className="text-xs font-semibold">Notes</span>
          </div>
          <div className="flex-1 relative">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground p-4">
                <FileText className="size-8 opacity-25" />
                <p className="text-xs">No notes</p>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1.5 overflow-y-auto max-h-32">
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
            {/* Inline composer at bottom of Notes box */}
            <div className="border-t p-2 relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="size-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">JP</div>
                <span className="text-xs text-muted-foreground">Add a note or drop a file here</span>
              </div>
              <textarea
                className="w-full rounded border bg-muted/20 p-2 text-xs resize-none outline-none focus:ring-1 focus:ring-ring"
                style={{minHeight: 52}}
                placeholder="Write a note... type @ to tag"
                value={noteText}
                onChange={handleNoteInput}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) saveNote() }}
              />
              {showTagMenu && filteredColleagues.length > 0 && (
                <div className="absolute bottom-20 left-2 bg-popover border rounded-lg shadow-lg z-50 w-40 overflow-hidden">
                  {filteredColleagues.map(c => (
                    <div key={c} onMouseDown={() => tagColleague(c)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer text-xs">
                      <div className="size-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">{c.slice(0,2).toUpperCase()}</div>
                      {c}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-2">
                  <button className="text-muted-foreground hover:text-foreground"><User className="size-3.5" /></button>
                  <button className="text-muted-foreground hover:text-foreground"><MessageSquare className="size-3.5" /></button>
                </div>
                <button onClick={saveNote}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
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

      {/* ── Bottom action bar (like Activix) ── */}
      <div className="flex items-center gap-6 px-6 py-2.5 border-t bg-background flex-shrink-0">
        {[Phone, Mail, MessageSquare, Video, Calendar].map((Icon, i) => (
          <button key={i} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon className="size-4" />
          </button>
        ))}
      </div>

      {/* Task dialog */}
      <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add task</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div>
              <Label>Task type</Label>
              <Select value={newTask.type} onValueChange={v => setNewTask({...newTask, type: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{taskTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input className="mt-1" placeholder="e.g. Follow up call" value={newTask.label} onChange={e => setNewTask({...newTask, label: e.target.value})} />
            </div>
            <div>
              <Label>Due date</Label>
              <Input className="mt-1" type="date" value={newTask.due} onChange={e => setNewTask({...newTask, due: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialog(false)}>Cancel</Button>
            <Button onClick={saveTask}>Add task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
