'use client'

type EventLike = {
    id: string
    title: string
    start_time: string | Date
    end_time: string | Date
}

export default function CalendarGrid({ year, month, grid, events }: { year: number, month: number, grid: Date[][], events: EventLike[] }) {
    const today = new Date()

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()

    const iso = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    const inMonth = (d: Date) => d.getMonth() === month - 1

    const eventsForDay = (day: Date) => {
        const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0)
        const nextDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1, 0, 0, 0, 0)
        return events.filter(e => new Date(e.start_time) < nextDay && new Date(e.end_time) >= startOfDay)
    }
    const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
        <div>
            <div className="mt-6 grid grid-cols-7 text-xs/6 text-gray-500 dark:text-gray-400">
                {headers.map((h) => (
                    <div key={h}>{h.slice(0, 1)}</div>  // shows single letter, key is unique
                ))}
            </div>
            <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200 dark:bg-white/15 dark:shadow-none dark:ring-white/15">
                {grid.flatMap((week, wi) =>
                    week.map((day, di) => {
                        const dayISO = iso(day)
                        const isToday = isSameDay(day, today)
                        const isCurrentMonth = inMonth(day)
                        // optionally track selection in state; omitted here
                        const dayEvents = eventsForDay(day)
                        return (
                            <button
                                key={`${wi}-${di}-${dayISO}`}
                                type="button"
                                data-is-today={isToday ? '' : undefined}
                                data-is-current-month={isCurrentMonth ? '' : undefined}
                                className="py-1.5 not-data-is-current-month:bg-gray-50 not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-400 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white not-data-is-selected:data-is-current-month:not-data-is-today:text-gray-900 data-is-current-month:hover:bg-gray-100 data-is-selected:font-semibold data-is-selected:text-white data-is-today:font-semibold data-is-today:not-data-is-selected:text-indigo-600 nth-36:rounded-bl-lg nth-7:rounded-tr-lg dark:not-data-is-current-month:bg-gray-900/75 dark:not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-500 dark:hover:bg-gray-900/25 dark:data-is-current-month:bg-gray-900/90 dark:not-data-is-selected:data-is-current-month:not-data-is-today:text-white dark:data-is-current-month:hover:bg-gray-900/50 dark:data-is-selected:text-gray-900 dark:data-is-today:not-data-is-selected:text-indigo-400"
                            >
                                <time
                                    dateTime={dayISO}
                                    className="mx-auto flex size-7 items-center justify-center rounded-full in-data-is-selected:not-in-data-is-today:bg-gray-900 in-data-is-selected:in-data-is-today:bg-indigo-600 dark:in-data-is-selected:not-in-data-is-today:bg-white dark:in-data-is-selected:in-data-is-today:bg-indigo-500"
                                >
                                    {day.getDate()}
                                </time>
                            </button>
                        )
                    })
                )}
            </div>
        </div>
    )
}