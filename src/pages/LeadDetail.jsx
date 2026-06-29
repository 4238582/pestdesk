import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Bug, ArrowLeft, Plus, CheckCircle2, Circle, Clock, MessageSquare, Send } from "lucide-react"

const colleagues = ["Jean-Philippe", "Marie-Eve", "Luc", "Sandra", "Robert"]

const taskTypes = [
  { value: "call",  label: "Call",  icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "sms",   label: "SMS",   icon: MessageSquare },
]

const statusConfig = {
  New:       "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Quoted:    "bg-purple-100 text-purple-700",
  Won:       "bg-green-100 text-green-700",
  Lost:      "bg-red-100 text-red-700",
}

export default function LeadDetail({ lead, onBack, onUpdate }) {
  const [tasks, setTasks] = useState([
    { id: 1, type: "call",  label: "Follow up call", due: "Today",    done: false },
    { id: 2, type: "email", label: "Send quote",     due: "Tomorrow", done: false },
  ])
  const [notes, setNotes] = useState([
    { id: 1, author: "Jean-Philippe", text: "Client called, seems very interested. Has had the problem for 2 weeks.", time: "Jun 27 · 2:30 PM", tags: [] },
  ])
  const [noteText, setNoteText] = useState("")
  const [tagSearch, setTagSearch] = useState("")
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [taskDialog, setTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState({ type: "call", label: "", due: "" })

  function addNote() {
    if (!noteText.trim()) return
    setNotes([...notes, {
      id: Date.now(),
      author: "Jean-Philippe",
      text: noteText,
      time: "Just now",
      tags: selectedTags,
    }])
    setNoteText("")
    setSelectedTags([])
  }

  function handleNoteInput(e) {
    const val = e.target.value
    setNoteText(val)
    const lastAt = val.lastIndexOf("@")
    if (lastAt !== -1 && lastAt === val.length - 1) {
      setShowTagMenu(true)
      setTagSearch("")
    } else if (lastAt !== -1 && showTagMenu) {
      setTagSearch(val.slice(lastAt + 1))
    } else {
      setShowTagMenu(false)
    }
  }

  function tagColleague(name) {
    setNoteText(prev => {
      const lastAt = prev.lastIndexOf("@")
      return prev.slice(0, lastAt) + `@${name} `
    })
    setSelectedTags([...selectedTags, name])
    setShowTagMenu(false)
  }

  function addTask() {
    if (!newTask.label) return
    setTasks([...tasks, { id: Date.now(), ...newTask, done: false }])
    setTaskDialog(false)
    setNewTask({ type: "call", label: "", due: "" })
  }

  function toggleTask(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const filteredColleagues = colleagues.filter(c =>
    c.toLowerCase().includes(tagSearch.toLowerCase())
  )

  const TaskIcon = ({ type }) => {
    const t = taskTypes.find(t => t.value === type)
    return t ? <t.icon className="size-3.5" /> : null
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-background">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-3 flex-1">
          <div className="size-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
            {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-semibold">{lead.name}</h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="size-3" />{lead.phone}</span>
              <span className="flex items-center gap-1"><Bug className="size-3" />{lead.pest}</span>
            </div>
          </div>
        </div>
        <Select value={lead.status} onValueChange={v => onUpdate({ ...lead, status: v })}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statusConfig).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — info + tasks */}
        <div className="w-80 border-r flex flex-col overflow-y-auto">
          {/* Info */}
          <div className="p-4 border-b">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Contact info</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" />{lead.phone}</div>
              <div className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{lead.email || "—"}</div>
              <div className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" />{lead.address}</div>
              <div className="flex items-center gap-2"><Bug className="size-4 text-muted-foreground" />{lead.pest}</div>
            </div>
          </div>

          {/* Tasks */}
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tasks & appointments</p>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setTaskDialog(true)}>
                <Plus className="size-3.5" />
              </Button>
            </div>
            {tasks.length === 0 && (
              <p className="text-xs text-muted-foreground">No tasks yet</p>
            )}
            <div className="flex flex-col gap-2">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer ${task.done ? "opacity-50" : ""}`} onClick={() => toggleTask(task.id)}>
                  {task.done
                    ? <CheckCircle2 className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                    : <Circle className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${task.done ? "line-through" : ""}`}>{task.label}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <TaskIcon type={task.type} />
                      <span className="capitalize">{task.type}</span>
                      {task.due && <><span>·</span><Clock className="size-3" /><span>{task.due}</span></>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {tasks.length > 0 && (
              <Button size="sm" variant="outline" className="w-full mt-3 h-7 text-xs gap-1" onClick={() => setTaskDialog(true)}>
                <Plus className="size-3" /> Add task
              </Button>
            )}
          </div>
        </div>

        {/* Right — notes */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</p>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {notes.map(note => (
              <div key={note.id} className="rounded-xl border bg-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                    {note.author.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium">{note.author}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{note.time}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {note.tags.map(t => (
                      <span key={t} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">@{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Note input */}
          <div className="p-4 border-t">
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">JP</div>
                <span className="text-xs font-medium">Jean-Philippe</span>
              </div>
              <textarea
                className="w-full rounded-lg border bg-muted/30 p-3 text-sm resize-none outline-none focus:ring-1 focus:ring-ring min-h-[80px]"
                placeholder="Add a note... type @ to tag a colleague"
                value={noteText}
                onChange={handleNoteInput}
                onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) addNote() }}
              />
              {showTagMenu && (
                <div className="absolute bottom-16 left-0 bg-popover border rounded-lg shadow-lg z-50 w-48 overflow-hidden">
                  {filteredColleagues.map(c => (
                    <div key={c} className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer text-sm" onMouseDown={() => tagColleague(c)}>
                      <div className="size-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                        {c.slice(0, 2).toUpperCase()}
                      </div>
                      {c}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">Ctrl+Enter to save</p>
                <Button size="sm" className="gap-1.5 h-8" onClick={addNote}>
                  <Send className="size-3.5" /> Save note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add task dialog */}
      <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div>
              <Label>Task type</Label>
              <Select value={newTask.type} onValueChange={v => setNewTask({...newTask, type: v})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input className="mt-1" placeholder="e.g. Follow up on quote" value={newTask.label} onChange={e => setNewTask({...newTask, label: e.target.value})} />
            </div>
            <div>
              <Label>Due date</Label>
              <Input className="mt-1" type="date" value={newTask.due} onChange={e => setNewTask({...newTask, due: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialog(false)}>Cancel</Button>
            <Button onClick={addTask}>Add task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
