import { addMonths, startOfMonth } from 'date-fns'


export function parseYmParam(ym?: string): { year: number; month: number } {
    // ym is YYYY-MM; month is 1-based for readability
    if (!ym) {
        const now = new Date()
        return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 }
    }
    const m = /^\d{4}-\d{2}$/.exec(ym)
    if (!m) throw new Error('Invalid ym parameter; expected YYYY-MM')
    const [yearStr, monthStr] = ym.split('-')
    const year = Number(yearStr)
    const month = Number(monthStr)
    if (month < 1 || month > 12) throw new Error('Month out of range')
    return { year, month }
}


export function monthBoundariesUTC(year: number, month: number) {
    // Compute in UTC to avoid TZ drift on the server.
    // JS Date months are 0-based. For SQL range queries use [gte, lt nextFirst].
    const first = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0))
    const nextFirst = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
    return { first, nextFirst }
}


export function formatYm(year: number, month: number) {
    return `${year}-${String(month).padStart(2, '0')}`
}


export function prevYm(year: number, month: number) {
    const d = new Date(Date.UTC(year, month - 1, 1))
    const p = addMonths(d, -1)
    return formatYm(p.getUTCFullYear(), p.getUTCMonth() + 1)
}


export function nextYm(year: number, month: number) {
    const d = new Date(Date.UTC(year, month - 1, 1))
    const n = addMonths(d, 1)
    return formatYm(n.getUTCFullYear(), n.getUTCMonth() + 1)
}


export function monthGrid(year: number, month: number) {
    // Returns a 6x7 grid (weeks x days) covering the month, with Date objects in local time for rendering labels.
    const firstOfMonth = new Date(year, month - 1, 1)
    const startWeekday = firstOfMonth.getDay() // 0=Sun
    const startDate = new Date(year, month - 1, 1 - startWeekday) // Sunday before or on the 1st


    const grid: Date[][] = []
    let cursor = startDate
    for (let w = 0; w < 6; w++) {
        const row: Date[] = []
        for (let d = 0; d < 7; d++) {
            row.push(new Date(cursor))
            cursor = new Date(cursor)
            cursor.setDate(cursor.getDate() + 1)
        }
        grid.push(row)
    }
    return grid
}