import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import "./calendar.css"

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
  return (
    <div className="p-5 h-full overflow-auto">
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
        events={events}
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
