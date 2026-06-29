import { useState, useRef, useEffect } from "react"
import { MessageSquare, Mail, AtSign, Phone, Check, CheckCheck } from "lucide-react"

const notifications = [
  { id: 1, type: "tag",   read: false, time: "2 min ago",  author: "Marie-Eve",    message: "Tagged you in a note on Robert Gagné",        lead: "Robert Gagné" },
  { id: 2, type: "sms",  read: false, time: "15 min ago", author: "Claude Bertrand", message: "Thanks for calling back! When can you come?", lead: "Claude Bertrand" },
  { id: 3, type: "email", read: false, time: "1h ago",    author: "Sandra Paquette", message: "Email opened · Quote for wasp nest removal",  lead: "Sandra Paquette" },
  { id: 4, type: "sms",  read: true,  time: "3h ago",    author: "Luc Thibodeau",   message: "Is Friday morning OK for the inspection?",     lead: "Luc Thibodeau" },
  { id: 5, type: "email", read: true,  time: "Yesterday", author: "Pizza Palace Hull", message: "Email opened · Monthly contract renewal",    lead: "Pizza Palace Hull" },
  { id: 6, type: "tag",  read: true,  time: "Yesterday", author: "Luc",             message: "Tagged you in a note on Manon Leblanc",        lead: "Manon Leblanc" },
]

const icons = {
  tag:   { icon: AtSign,         color: "text-purple-500", bg: "bg-purple-500/10" },
  sms:   { icon: MessageSquare,  color: "text-green-500",  bg: "bg-green-500/10" },
  email: { icon: Mail,           color: "text-blue-500",   bg: "bg-blue-500/10" },
}

export function NotificationsPanel() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(notifications)
  const ref = useRef(null)
  const unread = items.filter(n => !n.read).length

  useEffect(() => {
    function click(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", click)
    return () => document.removeEventListener("mousedown", click)
  }, [])

  function markAllRead() { setItems(items.map(n => ({ ...n, read: true }))) }
  function markRead(id) { setItems(items.map(n => n.id === id ? { ...n, read: true } : n)) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative flex items-center justify-center size-9 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      >
        <MessageSquare className="size-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 border rounded-xl shadow-xl z-50 overflow-hidden"
          style={{ background: "hsl(220, 13%, 13%)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <p className="text-sm font-semibold">Communications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1">
                <CheckCheck className="size-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {items.map(n => {
              const cfg = icons[n.type]
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-accent/50
                    ${!n.read ? "bg-accent/20" : ""}`}
                >
                  <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <cfg.icon className={`size-3.5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{n.lead}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  {!n.read && <div className="size-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              )
            })}
          </div>

          <div className="px-4 py-2.5 border-t text-center">
            <button className="text-xs text-blue-500 hover:text-blue-400">View all communications</button>
          </div>
        </div>
      )}
    </div>
  )
}
