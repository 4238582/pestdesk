import { useState, useRef, useEffect } from "react"
import { Search, Phone, User } from "lucide-react"

const allClients = [
  { id: 1, name: "Martin Rousseau",      phone: "819-555-0101", type: "customer" },
  { id: 2, name: "Sylvie Côté",           phone: "819-555-0202", type: "customer" },
  { id: 3, name: "Tremblay Landscaping",  phone: "819-555-0303", type: "customer" },
  { id: 4, name: "Claude Bertrand",       phone: "819-555-0142", type: "lead" },
  { id: 5, name: "Marie-Eve Gagnon",      phone: "819-555-0287", type: "lead" },
  { id: 6, name: "Luc Thibodeau",         phone: "613-555-0391", type: "lead" },
  { id: 7, name: "Sandra Paquette",       phone: "819-555-0514", type: "lead" },
  { id: 8, name: "Robert Gagné",          phone: "819-555-0611", type: "customer" },
  { id: 9, name: "Pizza Palace Hull",     phone: "819-555-0720", type: "customer" },
]

export function GlobalSearch({ onNavigate }) {
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const ref = useRef(null)

  const results = query.length > 1
    ? allClients.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
      ).slice(0, 6)
    : []

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setFocused(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative w-72">
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border bg-muted/50 text-sm">
        <Search className="size-4 text-muted-foreground flex-shrink-0" />
        <input
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
          placeholder="Search client or phone..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
        />
      </div>

      {focused && results.length > 0 && (
        <div className="absolute top-10 left-0 w-full bg-popover border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map(r => (
            <div
              key={r.id}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent cursor-pointer"
              onMouseDown={() => { onNavigate(r); setQuery(""); setFocused(false) }}
            >
              <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {r.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="size-3" />{r.phone}
                </p>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${r.type === "lead" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                {r.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
