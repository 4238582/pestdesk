import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Bug, CheckCircle2, Circle } from "lucide-react"

const VIEWS = ["Day", "Week", "Month"]

const events = [
  { id: 1, date: "2025-06-27", time: "09:00", end: "10:00", client: "Martin Rousseau",     type: "job",  pest: "Cockroach treatment", address: "142 Rue Principale, Gatineau", color: "bg-blue-500",   done: true },
  { id: 2, date: "2025-06-27", time: "11:30", end: "12:30", client: "Sylvie Côté",          type: "job",  pest: "Ant colony",          address: "88 Chemin du Lac, Aylmer",    color: "bg-amber-500",  done: false },
  { id: 3, date: "2025-06-27", time: "14:00", end: "15:00", client: "Tremblay Landscaping", type: "job",  pest: "Wasp nest removal",   address: "550 Blvd Industriel, Hull",   color: "bg-blue-500",   done: false },
  { id: 4, date: "2025-06-27", time: "16:30", end: "17:30", client: "Anne Dubois",          type: "job",  pest: "Rodent inspection",   address: "29 Rue des Érables, Gatineau",color: "bg-blue-500",   done: false },
  { id: 5, date: "2025-06-28", time: "10:00", end: "11:00", client: "Robert Gagné",         type: "job",  pest: "Bed bug treatment",   address: "14 Rue Laval, Gatineau",      color: "bg-red-500",    done: false },
  { id: 6, date: "2025-06-28", time: "13:00", end: "13:30", client: "Claude Bertrand",      type: "task", pest: "Follow-up call",      address: "",                            color: "bg-purple-500", done: false },
  { id: 7, date: "2025-06-29", time: "09:30", end: "10:30", client: "Pizza Palace Hull",    type: "job",  pest: "Monthly inspection",  address: "12 Rue Laval, Hull",          color: "bg-green-500",  done: false },
  { id: 8, date: "2025-06-30", time: "11:00", end: "12:00", client: "Manon Leblanc",        type: "task", pest: "Send quote",          address: "",                            color: "bg-purple-500", done: false },
]

const hours = Array.from({ length: 11 }, (_, i) => i + 8) // 8am to 6pm

function formatDate(d) {
  return d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function toDateStr(d) {
  return d.toISOString().split("T")[0]
}

export default function Calendar() {
  const [view, setView] = useState("Week")
  const [current, setCurrent] = useState(new Date("2025-06-27"))

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(current)
    d.setDate(d.getDate() - d.getDay() + i)
    return d
  })

  const dayEvents = events.filter(e => e.date === toDateStr(current))

  function prevPeriod() {
    if (view === "Day")   setCurrent(d => addDays(d, -1))
    if (view === "Week")  setCurrent(d => addDays(d, -7))
    if (view === "Month") setCurrent(d => addDays(d, -30))
  }
  function nextPeriod() {
    if (view === "Day")   setCurrent(d => addDays(d, 1))
    if (view === "Week")  setCurrent(d => addDays(d, 7))
    if (view === "Month") setCurrent(d => addDays(d, 30))
  }

  const title = view === "Day"
    ? formatDate(current)
    : view === "Week"
      ? `${formatDate(weekDays[0])} — ${formatDate(weekDays[6])}`
      : current.toLocaleDateString("en-CA", { month: "long", year: "numeric" })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-background flex-shrink-0">
        <button onClick={() => setCurrent(new Date("2025-06-27"))}
          className="text-xs border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">Today</button>
        <div className="flex items-center gap-1">
          <button onClick={prevPeriod} className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors"><ChevronLeft className="size-4" /></button>
          <button onClick={nextPeriod} className="size-7 flex items-center justify-center rounded hover:bg-accent transition-colors"><ChevronRight className="size-4" /></button>
        </div>
        <h2 className="text-sm font-medium flex-1">{title}</h2>
        <div className="flex items-center gap-1 border rounded-lg p-0.5">
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`text-xs px-3 py-1 rounded transition-colors ${view === v ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {v}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">
          <Plus className="size-3.5" /> Add
        </button>
      </div>

      {/* Calendar body */}
      <div className="flex-1 overflow-auto">

        {/* WEEK VIEW */}
        {view === "Week" && (
          <div className="flex h-full min-h-[600px]">
            {/* Time column */}
            <div className="w-16 flex-shrink-0 border-r">
              <div className="h-10 border-b" />
              {hours.map(h => (
                <div key={h} className="h-14 border-b px-2 flex items-start pt-1">
                  <span className="text-xs text-muted-foreground">{h}:00</span>
                </div>
              ))}
            </div>
            {/* Day columns */}
            {weekDays.map((day, di) => {
              const ds = toDateStr(day)
              const dayEvs = events.filter(e => e.date === ds)
              const isToday = ds === "2025-06-27"
              return (
                <div key={di} className="flex-1 border-r last:border-r-0 flex flex-col min-w-0">
                  {/* Day header */}
                  <div className={`h-10 border-b flex flex-col items-center justify-center flex-shrink-0 ${isToday ? "bg-blue-500/10" : ""}`}>
                    <span className="text-xs text-muted-foreground">{day.toLocaleDateString("en-CA", { weekday: "short" })}</span>
                    <span className={`text-sm font-medium ${isToday ? "text-blue-500" : ""}`}>{day.getDate()}</span>
                  </div>
                  {/* Hour slots */}
                  <div className="flex-1 relative">
                    {hours.map(h => <div key={h} className="h-14 border-b" />)}
                    {/* Events */}
                    {dayEvs.map(ev => {
                      const [hh, mm] = ev.time.split(":").map(Number)
                      const top = (hh - 8) * 56 + (mm / 60) * 56
                      const [eh, em] = ev.end.split(":").map(Number)
                      const height = ((eh - hh) * 60 + (em - mm)) / 60 * 56
                      return (
                        <div key={ev.id}
                          className={`absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-white cursor-pointer overflow-hidden ${ev.color} opacity-90 hover:opacity-100`}
                          style={{ top, height: Math.max(height, 20) }}>
                          <p className="text-xs font-medium truncate">{ev.client}</p>
                          <p className="text-xs opacity-80 truncate">{ev.pest}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* DAY VIEW */}
        {view === "Day" && (
          <div className="flex h-full min-h-[600px]">
            <div className="w-16 flex-shrink-0 border-r">
              {hours.map(h => (
                <div key={h} className="h-16 border-b px-2 flex items-start pt-1">
                  <span className="text-xs text-muted-foreground">{h}:00</span>
                </div>
              ))}
            </div>
            <div className="flex-1 relative">
              {hours.map(h => <div key={h} className="h-16 border-b" />)}
              {dayEvents.map(ev => {
                const [hh, mm] = ev.time.split(":").map(Number)
                const top = (hh - 8) * 64 + (mm / 60) * 64
                const [eh, em] = ev.end.split(":").map(Number)
                const height = Math.max(((eh - hh) * 60 + (em - mm)) / 60 * 64, 30)
                return (
                  <div key={ev.id}
                    className={`absolute left-2 right-2 rounded-lg px-3 py-1.5 text-white cursor-pointer ${ev.color} opacity-90 hover:opacity-100`}
                    style={{ top, height }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{ev.time}</span>
                      <span className="text-xs font-medium">{ev.client}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Bug className="size-3 opacity-70" />
                      <span className="text-xs opacity-90">{ev.pest}</span>
                    </div>
                    {ev.address && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 opacity-70" />
                        <span className="text-xs opacity-80 truncate">{ev.address}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {/* Tasks sidebar */}
            <div className="w-60 border-l p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tasks today</p>
              <div className="flex flex-col gap-2">
                {events.filter(e => e.type === "task").map(t => (
                  <div key={t.id} className="flex items-start gap-2 p-2 rounded-lg border">
                    {t.done ? <CheckCircle2 className="size-4 text-green-500 flex-shrink-0 mt-0.5" /> : <Circle className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-medium">{t.client}</p>
                      <p className="text-xs text-muted-foreground">{t.pest}</p>
                      <p className="text-xs text-muted-foreground">{t.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MONTH VIEW */}
        {view === "Month" && (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-0 border-l border-t">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="border-r border-b px-2 py-1.5 text-xs font-medium text-muted-foreground">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const startOfMonth = new Date(current.getFullYear(), current.getMonth(), 1)
                const startDay = startOfMonth.getDay()
                const day = new Date(startOfMonth)
                day.setDate(1 - startDay + i)
                const ds = toDateStr(day)
                const dayEvs = events.filter(e => e.date === ds)
                const isCurrentMonth = day.getMonth() === current.getMonth()
                const isToday = ds === "2025-06-27"
                return (
                  <div key={i} className={`border-r border-b min-h-[90px] p-1.5 ${isCurrentMonth ? "" : "opacity-30"}`}>
                    <span className={`text-xs font-medium inline-flex size-5 items-center justify-center rounded-full
                      ${isToday ? "bg-blue-500 text-white" : "text-muted-foreground"}`}>
                      {day.getDate()}
                    </span>
                    <div className="mt-1 flex flex-col gap-0.5">
                      {dayEvs.slice(0, 3).map(ev => (
                        <div key={ev.id} className={`text-xs text-white px-1 py-0.5 rounded truncate ${ev.color}`}>
                          {ev.time} {ev.client}
                        </div>
                      ))}
                      {dayEvs.length > 3 && <div className="text-xs text-muted-foreground">+{dayEvs.length - 3} more</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
