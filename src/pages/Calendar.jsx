import { useState, useRef, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import { ChevronDown } from "lucide-react"
import "./calendar.css"

const FILTERS = [
  { id: "all",          label: "Calendar",     section: null },
  { id: "tasks",        label: "Tasks",        section: "MY VIEWS" },
  { id: "appointments", label: "Appointments", section: "MY VIEWS" },
]

function CalendarDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = FILTERS.find(f => f.id === value)

  useEffect(() => {
    function click(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", click)
    return () => document.removeEventListener("mousedown", click)
  }, [])

  const sections = [
    { label: null,       items: FILTERS.filter(f => !f.section) },
    { label: "MY VIEWS", items: FILTERS.filter(f => f.section === "MY VIEWS") },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
      >
        {selected?.label}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-8 w-44 border rounded-xl shadow-xl z-50 overflow-hidden py-1"
          style={{ background: "hsl(220, 13%, 13%)" }}>
          {sections.map((sec, si) => (
            <div key={si}>
              {sec.label && (
                <p className="text-xs font-semibold text-muted-foreground px-3 pt-3 pb-1 tracking-wider">{sec.label}</p>
              )}
              {sec.items.map(f => (
                <button
                  key={f.id}
                  onClick={() => { onChange(f.id); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-accent/50
                    ${value === f.id ? "text-blue-500 font-medium" : "text-foreground"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const events = [
  { id: "1", title: "Martin Rousseau — Cockroach",    start: "2025-06-27T09:00:00", end: "2025-06-27T10:00:00", color: "#3b82f6", extendedProps: { type: "job" } },
  { id: "2", title: "Sylvie Côté — Ant colony",       start: "2025-06-27T11:30:00", end: "2025-06-27T12:30:00", color: "#f59e0b", extendedProps: { type: "job" } },
  { id: "3", title: "Tremblay Landscaping — Wasps",   start: "2025-06-27T14:00:00", end: "2025-06-27T15:00:00", color: "#3b82f6", extendedProps: { type: "job" } },
  { id: "4", title: "Anne Dubois — Rodent inspection",start: "2025-06-27T16:30:00", end: "2025-06-27T17:30:00", color: "#3b82f6", extendedProps: { type: "job" } },
  { id: "5", title: "Robert Gagné — Bed bugs",        start: "2025-06-28T10:00:00", end: "2025-06-28T11:30:00", color: "#ef4444", extendedProps: { type: "job" } },
  { id: "6", title: "📞 Follow-up — Claude Bertrand", start: "2025-06-28T13:00:00", end: "2025-06-28T13:30:00", color: "#8b5cf6", extendedProps: { type: "task" } },
  { id: "7", title: "Pizza Palace — Monthly inspect", start: "2025-06-29T09:30:00", end: "2025-06-29T10:30:00", color: "#10b981", extendedProps: { type: "job" } },
  { id: "8", title: "📧 Send quote — Manon Leblanc",  start: "2025-06-30T11:00:00", end: "2025-06-30T11:30:00", color: "#8b5cf6", extendedProps: { type: "task" } },
  { id: "9", title: "Luc Thibodeau — Site inspection",start: "2025-07-01T10:00:00", end: "2025-07-01T11:00:00", color: "#3b82f6", extendedProps: { type: "job" } },
  { id: "10",title: "Sandra Paquette — Follow-up",    start: "2025-07-02T14:00:00", end: "2025-07-02T14:30:00", color: "#8b5cf6", extendedProps: { type: "task" } },
]

export default function Calendar() {
  const [filter, setFilter] = useState("all")

  const filteredEvents = events.filter(e => {
    if (filter === "tasks") return e.extendedProps.type === "task"
    if (filter === "appointments") return e.extendedProps.type === "job"
    return true
  })

  return (
    <div className="p-5 h-full overflow-auto flex flex-col gap-3">
      <CalendarDropdown value={filter} onChange={setFilter} />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridWeek"
        initialDate="2025-06-27"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List",
        }}
        events={filteredEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        height="100%"
        eventClick={(info) => {
          alert(`${info.event.title}\n${info.event.startStr}`)
        }}
        select={(info) => {
          const title = prompt("New event title:")
          if (title) {
            info.view.calendar.addEvent({ title, start: info.start, end: info.end, color: "#3b82f6" })
          }
        }}
      />
    </div>
  )
}
